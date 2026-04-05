import { createServerFn } from "@tanstack/start";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAdmin } from "@/middleware/auth";
import { media } from "@/lib/db/schema";
import {
  isAllowedType,
  isAllowedSize,
  generateKey,
  r2PublicUrl,
} from "@/lib/r2";
import {
  requestUploadUrlSchema,
  confirmUploadSchema,
} from "../media.schema";

// ── Step 1: generate a presigned PUT URL ──────────────────────────────────

export const requestUploadUrlFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => requestUploadUrlSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (!isAllowedType(data.mimeType)) {
      throw new Error(`File type not allowed: ${data.mimeType}`);
    }
    if (!isAllowedSize(data.size)) {
      throw new Error("File exceeds 20 MB limit");
    }

    const key = generateKey(data.filename);

    // R2 createMultipartUpload / presigned URL
    // Cloudflare R2 supports presigned URLs via the S3-compatible API.
    // We use the Workers binding approach here — the Worker signs the URL
    // server-side and returns it to the client.
    const url = await context.env.BUCKET.createPresignedUrl?.(key, {
      expiresIn: 300, // 5 minutes
    });

    // Fallback: if your R2 binding doesn't expose createPresignedUrl yet,
    // use a direct upload endpoint instead (see comment below).
    if (!url) {
      throw new Error("Presigned URL generation not available");
    }

    return { key, uploadUrl: url };
  });

// ── Step 2: confirm upload, record metadata in D1 ────────────────────────

export const confirmUploadFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => confirmUploadSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Verify the object actually landed in R2
    const obj = await context.env.BUCKET.head(data.key);
    if (!obj) throw new Error("Upload not found in storage");

    const id = nanoid();
    const url = r2PublicUrl(context.env, data.key);

    await context.db.insert(media).values({
      id,
      key: data.key,
      url,
      filename: data.filename,
      mimeType: data.mimeType,
      size: data.size,
      uploadedBy: context.user.id,
    });

    return { id, url, key: data.key };
  });

// ── List media (admin) ────────────────────────────────────────────────────

export const getMediaFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) =>
    z.object({ limit: z.number().default(50) }).parse(data ?? {})
  )
  .handler(async ({ data, context }) => {
    return context.db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt))
      .limit(data.limit)
      .all();
  });

// ── Delete media ──────────────────────────────────────────────────────────

export const deleteMediaFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const item = await context.db
      .select()
      .from(media)
      .where(eq(media.id, data.id))
      .get();

    if (!item) throw new Error("Media not found");

    // Delete from R2
    await context.env.BUCKET.delete(item.key);

    // Delete from D1
    await context.db.delete(media).where(eq(media.id, data.id));

    return { ok: true };
  });
