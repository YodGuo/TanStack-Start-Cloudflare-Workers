import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { newsListQuery, tagsQuery } from "@/features/news/queries/news.queries";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";

const searchSchema = z.object({ tag: z.string().optional() });

export const Route = createFileRoute("/news/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ tag: search.tag }),
  loader: ({ context, deps }) => Promise.all([
    context.queryClient.ensureInfiniteQueryData(newsListQuery(deps.tag)),
    context.queryClient.ensureQueryData(tagsQuery()),
  ]),
  component: NewsListPage,
});

function NewsListPage() {
  const { tag } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: tagList } = useSuspenseQuery(tagsQuery());
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(newsListQuery(tag));

  const posts = data.pages.flatMap((p) => p.items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-medium">News</h1>

      {tagList.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: {} })}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              !tag ? "bg-foreground text-background" : "hover:bg-muted"
            }`}
          >
            All
          </button>
          {tagList.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate({ search: { tag: t.slug } })}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                tag === t.slug ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No news articles yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            
              key={post.id}
              href={`/news/${post.slug}`}
              className="group flex flex-col gap-2 rounded-xl border bg-background p-5 transition-colors hover:bg-muted/40"
            >
              <p className="font-medium group-hover:underline">{post.title}</p>
              {post.summary && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.summary}
                </p>
              )}
              <div className="mt-auto flex flex-wrap gap-1 pt-3">
                {post.tags.map((t) => (
                  <span key={t.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {t.name}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {post.publishedAt
                  ? new Date(post.publishedAt * 1000).toLocaleDateString()
                  : ""}
              </p>
            </a>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-md border px-6 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      <QuoteDrawer />
    </div>
  );
}
