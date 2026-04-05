import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import type { Env } from "@/lib/env";

export function createAuth(env: Env) {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db(env.DB), {
      provider: "sqlite",
      schema: {
        user: schema.users,
        session: schema.sessions,
      },
    }),
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          input: false,
        },
      },
    },
    hooks: {
      after: [
        {
          matcher: (ctx) =>
            ctx.path === "/sign-up/email" ||
            ctx.path === "/sign-in/social",
          handler: async (ctx) => {
            const userId = ctx.context.newSession?.userId;
            const userEmail = ctx.context.newSession?.user?.email;
            if (userId && userEmail === env.ADMIN_EMAIL) {
              await db(env.DB)
                .update(schema.users)
                .set({ role: "admin" })
                .where(eq(schema.users.id, userId));
            }
          },
        },
      ],
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
