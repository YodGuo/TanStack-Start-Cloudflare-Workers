import { createServerFn } from "@tanstack/start";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { comments, newsPosts, users } from "@/lib/db/schema";
import {
  submitCommentSchema,
  updateCommentStatusSchema,
  type CommentItem,
} from "../comments.schema";

// ── Public: get approved comments for a post ──────────────────────────────

export const getCommentsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ postId: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const rows = await context.db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.postId, data.postId),
          eq(comments.status, "approved")
        )
      )
      .orderBy(desc(comments.createdAt))
      .all();

    // Build nested structure — one level deep
    const roots: CommentItem[] = [];
    const byId: Record<string, CommentItem> = {};

    for (const row of rows) {
      byId[row.id] = { ...row, replies: [] };
    }
    for (const row of rows) {
      if (row.parentId && byId[row.parentId]) {
        byId[row.parentId].replies.push(byId[row.id]);
      } else {
        roots.push(byId[row.id]);
      }
    }

    return roots;
  });

// ── Public: submit a comment ──────────────────────────────────────────────

export const submitCommentFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => submitCommentSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (data._hp) return { ok: true }; // honeypot

    const id = nanoid();

    await context.db.insert(comments).values({
      id,
      postId: data.postId,
      parentId: data.parentId ?? null,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      content: data.content,
      status: "pending",
    });

    // Notify admin
    await context.env.EMAIL_QUEUE.send({
      type: "send-email",
      payload: {
        to: context.env.ADMIN_EMAIL,
        subject: "New comment pending moderation",
        text: [
          `From: ${data.authorName} <${data.authorEmail}>`,
          ``,
          data.content,
        ].join("\n"),
      },
    });

    // Notify parent comment author on reply
    if (data.parentId) {
      const parent = await context.db
        .select()
        .from(comments)
        .where(eq(comments.id, data.parentId))
        .get();

      if (parent?.authorEmail && parent.authorEmail !== data.authorEmail) {
        await context.env.EMAIL_QUEUE.send({
          type: "send-email",
          payload: {
            to: parent.authorEmail,
            subject: `${data.authorName} replied to your comment`,
            text: [
              `${data.authorName} replied to your comment:`,
              ``,
              data.content,
            ].join("\n"),
          },
        });
      }
    }

    return { ok: true };
  });

// ── Admin: list all comments ──────────────────────────────────────────────

export const getAdminCommentsFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) =>
    z.object({
      status: z.enum(["pending", "approved", "rejected", "all"]).default("pending"),
    }).parse(data ?? {})
  )
  .handler(async ({ data, context }) => {
    const where = data.status === "all"
      ? undefined
      : eq(comments.status, data.status);

    return context.db
      .select()
      .from(comments)
      .where(where)
      .orderBy(desc(comments.createdAt))
      .all();
  });

// ── Admin: update comment status ──────────────────────────────────────────

export const updateCommentStatusFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => updateCommentStatusSchema.parse(data))
  .handler(async ({ data, context }) => {
    await context.db
      .update(comments)
      .set({ status: data.status })
      .where(eq(comments.id, data.id));
    return { ok: true };
  });

// ── Admin: delete comment ─────────────────────────────────────────────────

export const deleteCommentFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await context.db
      .delete(comments)
      .where(eq(comments.id, data.id));
    return { ok: true };
  });
