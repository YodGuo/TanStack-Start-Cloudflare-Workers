import { createMiddleware } from "@tanstack/start";
import { createAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Env } from "@/lib/env";

export const authMiddleware = createMiddleware().server(async ({ next, context }) => {
  const env = context.cloudflare.env as Env;
  const auth = createAuth(env);
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  return next({
    context: {
      env,
      db: db(env.DB),
      auth,
      session,
      user: session?.user ?? null,
    },
  });
});

// Convenience: throws 401 if no session
export const requireAuth = createMiddleware().server(async ({ next, context }) => {
  const env = context.cloudflare.env as Env;
  const auth = createAuth(env);
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return next({
    context: {
      env,
      db: db(env.DB),
      auth,
      session,
      user: session.user,
    },
  });
});

// Convenience: throws 403 if not admin
export const requireAdmin = createMiddleware().server(async ({ next, context }) => {
  const env = context.cloudflare.env as Env;
  const auth = createAuth(env);
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!session || session.user.role !== "admin") {
    throw new Response("Forbidden", { status: 403 });
  }

  return next({
    context: {
      env,
      db: db(env.DB),
      auth,
      session,
      user: session.user,
    },
  });
});
