import { z } from "zod";

export const requestUploadUrlSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().positive(),
});

export const confirmUploadSchema = z.object({
  key: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

export type RequestUploadUrlInput = z.infer<typeof requestUploadUrlSchema>;
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;
