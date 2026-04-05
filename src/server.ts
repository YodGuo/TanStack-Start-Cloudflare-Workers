import { createRequestHandler } from "@tanstack/start/cloudflare-workers";
import honoApp, { handleQueue } from "@/lib/hono";
import type { Env } from "@/lib/env";

const tanstackHandler = createRequestHandler({
  // Points to your TanStack Start build output
  build: () => import("./router"),
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Hono handles: /api/auth/*, /images/*, and any other Hono-registered routes
    if (
      url.pathname.startsWith("/api/auth/") ||
      url.pathname.startsWith("/images/")
    ) {
      return honoApp.fetch(request, env, ctx);
    }

    // Everything else goes to TanStack Start (SSR + server functions)
    return tanstackHandler(request, env, ctx);
  },

  // Queue consumer
  queue: handleQueue,
} satisfies ExportedHandler<Env>;
