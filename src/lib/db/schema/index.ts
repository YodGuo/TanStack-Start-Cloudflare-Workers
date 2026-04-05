import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  role: text("role", { enum: ["admin", "editor", "user"] }).default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const productCategories = sqliteTable("product_categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  parentId: text("parent_id"),
  order: integer("order").default(0),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categoryId: text("category_id").references(() => productCategories.id),
  name: text("name").notNull(),
  summary: text("summary"),
  specs: text("specs", { mode: "json" }).$type<Record<string, string>>(),
  datasheetUrl: text("datasheet_url"),
  imageUrl: text("image_url"),
  published: integer("published", { mode: "boolean" }).default(false),
  order: integer("order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Quote Requests ───────────────────────────────────────────────────────────

export const quoteRequests = sqliteTable("quote_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  phone: text("phone"),
  productIds: text("product_ids", { mode: "json" }).$type<string[]>(),
  message: text("message"),
  status: text("status", {
    enum: ["new", "contacted", "quoted", "closed"],
  }).default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── News ─────────────────────────────────────────────────────────────────────

export const newsPosts = sqliteTable("news_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content", { mode: "json" }),
  authorId: text("author_id").references(() => users.id),
  status: text("status", {
    enum: ["draft", "published"],
  }).default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const newsPostTags = sqliteTable("news_post_tags", {
  postId: text("post_id").notNull().references(() => newsPosts.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

// ─── Comments ─────────────────────────────────────────────────────────────────

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => newsPosts.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  authorId: text("author_id").references(() => users.id),
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  status: text("status", {
    enum: ["pending", "approved", "rejected"],
  }).default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
