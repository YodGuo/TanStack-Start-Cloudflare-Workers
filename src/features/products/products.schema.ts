import { z } from "zod";

export const specRowSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  specs: z.array(specRowSchema).optional(),
  features: z.array(z.string()).optional(),
  datasheetUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  published: z.boolean().default(false),
  order: z.number().default(0),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1),
  parentId: z.string().optional(),
});

export type SpecRow = z.infer<typeof specRowSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
