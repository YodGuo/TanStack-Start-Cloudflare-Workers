import { z } from "zod";

export const newsStatusSchema = z.enum(["draft", "published"]);
export type NewsStatus = z.infer<typeof newsStatusSchema>;

export const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  content: z.any(), // Tiptap JSON
  tags: z.array(z.string()).optional(),
  status: newsStatusSchema.default("draft"),
  publishedAt: z.number().optional(), // unix timestamp
});

export const updateNewsSchema = createNewsSchema.partial().extend({
  id: z.string(),
});

export const newsItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  content: z.any(),
  status: newsStatusSchema,
  publishedAt: z.number().nullable(),
  createdAt: z.number(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  })),
});

export type NewsItem = z.infer<typeof newsItemSchema>;
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
