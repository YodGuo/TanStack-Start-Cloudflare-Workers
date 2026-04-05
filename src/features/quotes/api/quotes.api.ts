import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { db } from "@/lib/db";
import { quoteRequests } from "@/lib/db/schema";
import { resend } from "@/lib/email";
import { nanoid } from "nanoid";

const quoteSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  phone: z.string().optional(),
  product: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  message: z.string().optional(),
});

export const submitQuoteFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => quoteSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { env } = context;

    // Insert into D1
    await db(env.DB).insert(quoteRequests).values({
      id: nanoid(),
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      productIds: data.productIds ?? [],
      message: data.message,
      status: "new",
    });

    // Fire email to sales inbox
    await resend(env.RESEND_API_KEY).emails.send({
      from: "noreply@yourdomain.com",
      to: "sales@yourdomain.com",
      subject: `New quote request from ${data.company}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.company}`,
        `Phone: ${data.phone ?? "—"}`,
        `Product: ${data.product ?? "—"}`,
        `Message: ${data.message ?? "—"}`,
      ].join("\n"),
    });

    return { ok: true };
  });
