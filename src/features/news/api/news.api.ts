import { createServerFn } from "@tanstack/start";
import { eq, desc, and, lte, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { newsPosts, tags, newsPostTags } from "@/lib/db/schema";
import { createNewsSchema, updateNewsSchema } from "../news.schema";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Public: list published posts ──────────────────────────────────────────

export const getNewsListFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z.object({
      tag: z.string().optional(),
      limit: z.number().default(12),
      offset: z.number().default(0),
    }).parse(data ?? {})
  )
  .handler(async ({ data, context }) => {
    const now = Math.floor(Date.now() / 1000);

    const posts = await context.db
      .select()
      .from(newsPosts)
      .where(
        and(
          eq(newsPosts.status, "published"),
          lte(newsPosts.publishedAt, now)
        )
      )
      .orderBy(desc(newsPosts.publishedAt))
      .limit(data.limit + 1)
      .offset(data.offset)
      .all();

    const hasNextPage = posts.length > data.limit;
    const items = hasNextPage ? posts.slice(0, data.limit) : posts;

    const postIds = items.map((p) => p.id);
    const postTagRows = postIds.length
      ? await context.db
          .select()
          .from(newsPostTags)
          .innerJoin(tags, eq(newsPostTags.tagId, tags.id))
          .where(inArray(newsPostTags.postId, postIds))
          .all()
      : [];

    const tagsByPost = postTagRows.reduce<Record<string, typeof tags.$inferSelect[]>>(
      (acc, row) => {
        acc[row.news_post_tags.postId] ??= [];
        acc[row.news_post_tags.postId].push(row.tags);
        return acc;
      },
      {}
    );

    return {
      items: items.map((p) => ({ ...p, tags: tagsByPost[p.id] ?? [] })),
      hasNextPage,
    };
  });

// ── Public: get single post by slug ───────────────────────────────────────

export const getNewsBySlugFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const post = await context.db
      .select()
      .from(newsPosts)
      .where(eq(newsPosts.slug, data.slug))
      .get();

    if (!post) return null;

    const postTagRows = await context.db
      .select()
      .from(newsPostTags)
      .innerJoin(tags, eq(newsPostTags.tagId, tags.id))
      .where(eq(newsPostTags.postId, post.id))
      .all();

    return {
      ...post,
      tags: postTagRows.map((r) => r.tags),
    };
  });

// ── Public: get all tags ──────────────────────────────────────────────────

export const getTagsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context.db.select().from(tags).all();
  });

// ── Admin: list all posts ─────────────────────────────────────────────────

export const getAdminNewsListFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    return context.db
      .select()
      .from(newsPosts)
      .orderBy(desc(newsPosts.createdAt))
      .all();
  });

// 👇 【新增】管理员通过 ID 获取单篇文章（你要求添加的）
export const getAdminNewsByIdFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const post = await context.db
      .select()
      .from(newsPosts)
      .where(eq(newsPosts.id, data.id))
      .get();

    if (!post) return null;

    const postTagRows = await context.db
      .select()
      .from(newsPostTags)
      .innerJoin(tags, eq(newsPostTags.tagId, tags.id))
      .where(eq(newsPostTags.postId, post.id))
      .all();

    return {
      ...post,
      tags: postTagRows.map((r) => r.tags),
    };
  });

// ── Admin: create post ────────────────────────────────────────────────────

export const createNewsFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => createNewsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const id = nanoid();
    const baseSlug = slugify(data.title);

    let slug = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await context.db
        .select({ id: newsPosts.id })
        .from(newsPosts)
        .where(eq(newsPosts.slug, slug))
        .get();
      if (!existing) break;
      slug = `${baseSlug}-${suffix++}`;
    }

    await context.db.insert(newsPosts).values({
      id,
      slug,
      title: data.title,
      summary: data.summary,
      content: data.content,
      status: data.status,
      publishedAt: data.status === "published"
        ? (data.publishedAt ?? Math.floor(Date.now() / 1000))
        : null,
      authorId: context.user.id,
    });

    if (data.tags?.length) {
      await upsertTags(context.db, id, data.tags);
    }

    return { id, slug };
  });

// ── Admin: update post ────────────────────────────────────────────────────

export const updateNewsFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => updateNewsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, tags: tagNames, ...fields } = data;

    await context.db
      .update(newsPosts)
      .set({
        ...fields,
        publishedAt:
          fields.status === "published"
            ? (fields.publishedAt ?? Math.floor(Date.now() / 1000))
            : null,
      })
      .where(eq(newsPosts.id, id));

    if (tagNames !== undefined) {
      await context.db
        .delete(newsPostTags)
        .where(eq(newsPostTags.postId, id));
      if (tagNames.length) {
        await upsertTags(context.db, id, tagNames);
      }
    }

    return { ok: true };
  });

// ── Admin: delete post ────────────────────────────────────────────────────

export const deleteNewsFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await context.db
      .delete(newsPosts)
      .where(eq(newsPosts.id, data.id));
    return { ok: true };
  });

// ── Helpers ───────────────────────────────────────────────────────────────

async function upsertTags(db: any, postId: string, tagNames: string[]) {
  for (const name of tagNames) {
    const slug = slugify(name);
    let tag = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .get();

    if (!tag) {
      const tagId = nanoid();
      await db.insert(tags).values({ id: tagId, slug, name });
      tag = { id: tagId, slug, name };
    }

    await db
      .insert(newsPostTags)
      .values({ postId, tagId: tag.id })
      .onConflictDoNothing();
  }
}
