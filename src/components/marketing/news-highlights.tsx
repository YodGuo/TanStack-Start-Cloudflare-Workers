import { Link } from "@tanstack/react-router";
import type { newsPosts } from "@/lib/db/schema";

type Post = typeof newsPosts.$inferSelect;

export function NewsHighlights({ items }: { items: Post[] }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-medium">Latest news</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Industry updates, product releases, and company news
          </p>
        </div>
        <Link
          to="/news"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          All news →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {items.slice(0, 3).map((post, i) => (
          <Link
            key={post.id}
            to="/news/$slug"
            params={{ slug: post.slug }}
            className={`group flex flex-col gap-3 rounded-xl border bg-background p-5 transition-colors hover:bg-muted/40 ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <p className="text-xs text-muted-foreground">
              {post.publishedAt
                ? new Date(post.publishedAt * 1000).toLocaleDateString("en-US", {
                    year:  "numeric",
                    month: "long",
                    day:   "numeric",
                  })
                : ""}
            </p>
            <p className={`font-medium group-hover:underline ${i === 0 ? "text-lg" : "text-sm"}`}>
              {post.title}
            </p>
            {post.summary && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {post.summary}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
