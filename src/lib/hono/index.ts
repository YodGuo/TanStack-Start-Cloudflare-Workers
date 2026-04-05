import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "@/lib/auth";
import type { Env } from "@/lib/env";

type Variables = { auth: ReturnType<typeof createAuth> };

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", cors({
  origin: (origin) => origin,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("*", async (c, next) => {
  c.set("auth", createAuth(c.env));
  await next();
});

app.on(["GET", "POST"], "/api/auth/**", (c) => {
  return c.get("auth").handler(c.req.raw);
});

app.get("/images/:key{.+}", async (c) => {
  const key = c.req.param("key");
  const object = await c.env.BUCKET.get(key);
  if (!object) return c.notFound();
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
});

// Direct upload fallback — used when R2 presigned URLs are unavailable
app.put("/api/media/direct/:key{.+}", async (c) => {
  const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
  if (!session || session.user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  const key = c.req.param("key");
  const body = await c.req.arrayBuffer();
  const ct = c.req.header("content-type") ?? "application/octet-stream";
  await c.env.BUCKET.put(key, body, { httpMetadata: { contentType: ct } });
  return c.json({ ok: true });
});

export async function handleQueue(
  batch: MessageBatch<{ type: string; payload: unknown }>,
  env: Env,
) {
  for (const message of batch.messages) {
    try {
      if (message.body.type === "send-email") {
        const { to, subject, text } = message.body.payload as {
          to: string; subject: string; text: string;
        };
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@yourdomain.com",
            to, subject, text,
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
