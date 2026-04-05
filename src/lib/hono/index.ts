import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "@/lib/auth";
import type { Env } from "@/lib/env";

type Variables = {
  auth: ReturnType<typeof createAuth>;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── Global middleware ──────────────────────────────────────────────────────

app.use("*", cors({
  origin: (origin) => origin, // tighten in production
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Attach auth instance to every request context
app.use("*", async (c, next) => {
  c.set("auth", createAuth(c.env));
  await next();
});

// ── Better Auth — handles all /api/auth/* routes ───────────────────────────

app.on(["GET", "POST"], "/api/auth/**", (c) => {
  return c.get("auth").handler(c.req.raw);
});

// ── Media / R2 ────────────────────────────────────────────────────────────

app.get("/images/:key{.+}", async (c) => {
  const key = c.req.param("key");
  const object = await c.env.BUCKET.get(key);

  if (!object) return c.notFound();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
});

// ── Quote requests ─────────────────────────────────────────────────────────
// TanStack Start server functions handle /api/quotes via their own routing.
// Add standalone Hono routes here only for webhooks or non-SSR endpoints.

// ── Queue consumer (email dispatch) ───────────────────────────────────────

export async function handleQueue(
  batch: MessageBatch<{ type: string; payload: unknown }>,
  env: Env,
) {
  for (const message of batch.messages) {
    try {
      if (message.body.type === "send-email") {
        const { to, subject, text } = message.body.payload as {
          to: string;
          subject: string;
          text: string;
        };
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@yourdomain.com",
            to,
            subject,
            text,
          }),
        });
      }
      message.ack();
    } catch {
      message.retry();
    }
  }
}

export default app;
