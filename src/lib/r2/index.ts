import type { Env } from "@/lib/env";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export type AllowedMimeType = (typeof ALLOWED_TYPES)[number];

export function isAllowedType(type: string): type is AllowedMimeType {
  return ALLOWED_TYPES.includes(type as AllowedMimeType);
}

export function isAllowedSize(size: number) {
  return size <= MAX_SIZE_BYTES;
}

// Generate a stable public URL for an R2 key
export function r2PublicUrl(env: Env, key: string) {
  // If you have a custom CDN domain pointing at R2, use it here.
  // Otherwise fall back to the Workers /images/ route defined in Hono.
  return `${env.BETTER_AUTH_URL}/images/${key}`;
}

// Generate a unique object key
export function generateKey(filename: string) {
  const ext = filename.split(".").pop() ?? "bin";
  const id = crypto.randomUUID();
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `uploads/${date}/${id}.${ext}`;
}
