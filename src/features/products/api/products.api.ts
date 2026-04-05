import { createServerFn } from "@tanstack/start";
import { eq, desc, asc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { products, productCategories } from "@/lib/db/schema";
import {
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
} from "../products.schema";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Public: list published products ───────────────────────────────────────

export const getProductsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    z.object({
      categoryId: z.string().optional(),
    }).parse(data ?? {})
  )
  .handler(async ({ data, context }) => {
    const where = data.categoryId
      ? and(
          eq(products.published, true),
          eq(products.categoryId, data.categoryId)
        )
      : eq(products.published, true);

    return context.db
      .select()
      .from(products)
      .where(where)
      .orderBy(asc(products.order), asc(products.name))
      .all();
  });

// ── Public: get product by slug ────────────────────────────────────────────

export const getProductBySlugFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    return context.db
      .select()
      .from(products)
      .where(
        and(
          eq(products.slug, data.slug),
          eq(products.published, true)
        )
      )
      .get() ?? null;
  });

// ── Public: list categories ────────────────────────────────────────────────

export const getCategoriesFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context.db
      .select()
      .from(productCategories)
      .orderBy(asc(productCategories.order), asc(productCategories.name))
      .all();
  });

// ── Admin: list all products ───────────────────────────────────────────────

export const getAdminProductsFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    return context.db
      .select()
      .from(products)
      .orderBy(asc(products.order), desc(products.createdAt))
      .all();
  });

// ── Admin: get single product by id ───────────────────────────────────────

export const getAdminProductByIdFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    return context.db
      .select()
      .from(products)
      .where(eq(products.id, data.id))
      .get() ?? null;
  });

// ── Admin: create product ─────────────────────────────────────────────────

export const createProductFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => createProductSchema.parse(data))
  .handler(async ({ data, context }) => {
    const id = nanoid();
    const baseSlug = slugify(data.name);

    // Ensure slug uniqueness
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await context.db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, slug))
        .get();
      if (!existing) break;
      slug = `${baseSlug}-${suffix++}`;
    }

    await context.db.insert(products).values({
      id,
      slug,
      ...data,
      datasheetUrl: data.datasheetUrl || null,
    });

    return { id, slug };
  });

// ── Admin: update product ─────────────────────────────────────────────────

export const updateProductFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => updateProductSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;

    await context.db
      .update(products)
      .set({
        ...fields,
        datasheetUrl: fields.datasheetUrl || null,
      })
      .where(eq(products.id, id));

    return { ok: true };
  });

// ── Admin: delete product ─────────────────────────────────────────────────

export const deleteProductFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await context.db
      .delete(products)
      .where(eq(products.id, data.id));
    return { ok: true };
  });

// ── Admin: toggle published ───────────────────────────────────────────────

export const toggleProductPublishedFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) =>
    z.object({ id: z.string(), published: z.boolean() }).parse(data)
  )
  .handler(async ({ data, context }) => {
    await context.db
      .update(products)
      .set({ published: data.published })
      .where(eq(products.id, data.id));
    return { ok: true };
  });

// ── Admin: create category ────────────────────────────────────────────────

export const createCategoryFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: unknown) => createCategorySchema.parse(data))
  .handler(async ({ data, context }) => {
    const id = nanoid();
    const slug = slugify(data.name);

    await context.db.insert(productCategories).values({
      id,
      slug,
      name: data.name,
      parentId: data.parentId ?? null,
    });

    return { id, slug };
  });
