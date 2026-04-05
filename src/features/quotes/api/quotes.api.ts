import { createServerFn } from "@tanstack/start";
import { nanoid } from "nanoid";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/middleware/auth";
import { authMiddleware } from "@/middleware/auth";
import { quoteRequests } from "@/lib/db/schema";
import {
  submitQuoteSchema,
  updateQuoteStatusSchema,
} from "../quotes.schema";

// ── Public: submit a quote request ────────────────────────────────────────

export const submitQuoteFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => submitQuoteSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Reject honeypot
    if (data._hp) return { ok: true };

    const id = nanoid();

    await context.db.insert(quoteRequests).values({
      id,
      email: data.email,
      name: data.name,
      company: data.company,
      phone: data.phone,
      productIds: data.productIds ?? [],
      message: data.message,
      status: "new",
    });

    // Push email to queue — non-blocking
    await context.env.EMAIL_QUEUE.send({
      type: "quote-received",
      payload: {
        to: context.env.ADMIN_EMAIL,
        subject: `New quote request from ${data.company ?? data.email}`,
        text: [
          `Email: ${data.email}`,
          data.name    ? `Name: ${data.name}`       : null,
          data.company ? `Company: ${data.company}` : null,
          data.phone   ? `Phone: ${data.phone}`     : null,
          data.product ? `Product: ${data.product}` : null,
          ``,
          `Requirements:`,
          data.message,
        ].filter(Boolean).join("\n"),
      },
    });

    return { ok: true };
  });

// ── Admin: list all quote requests ────────────────────────────────────────

export const getQuotesFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    return context.db
      .select()
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt))
      .all();
  });

// ── Admin: update quote status ────────────────────────────────────────────

export const updateQuoteStatusFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => updateQuoteStatusSchema.parse(data))
  .handler(async ({ data, context }) => {
    await context.db
      .update(quoteRequests)
      .set({ status: data.status })
      .where(eq(quoteRequests.id, data.id));

    return { ok: true };
  });

// ── Admin: delete a quote request ─────────────────────────────────────────

export const deleteQuoteFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await context.db
      .delete(quoteRequests)
      .where(eq(quoteRequests.id, data.id));

    return { ok: true };
  });
