import { z } from "zod";

export const quoteStatusSchema = z.enum([
  "new",
  "contacted",
  "quoted",
  "closed",
]);

export type QuoteStatus = z.infer<typeof quoteStatusSchema>;

export const submitQuoteSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  product: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  message: z.string().min(1),
  _hp: z.string().optional(), // honeypot
});

export const updateQuoteStatusSchema = z.object({
  id: z.string(),
  status: quoteStatusSchema,
});

export type SubmitQuoteInput = z.infer<typeof submitQuoteSchema>;
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>;
