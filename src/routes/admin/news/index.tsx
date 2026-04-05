import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { adminNewsListQuery } from "@/features/news/queries/news.queries";
import { useDeleteNews, useUpdateNews } from "@/features/news/hooks/use-news";

export const Route = createFileRoute("/admin/news/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminNewsListQuery()),
  component: AdminNewsPage,
});

function AdminNewsPage() {
  const { data: posts } = useSuspenseQuery(adminNewsListQuery());
  const deleteNews = useDeleteNews();
  const updateNews = useUpdateNews();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-medium">News articles</h1>
        <Link
          to="/admin/news/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          New article
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{post.title}</p>
              <p className="text-xs text-muted-foreground">
                {post.status === "published" && post.publishedAt
                  ? `Published ${new Date(post.publishedAt * 1000).toLocaleDateString()}`
                  : "Draft"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateNews.mutate({
                    id: post.id,
                    status: post.status === "published" ? "draft" : "published",
                  })
                }
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <Link
                to="/admin/news/$id/edit"
                params={{ id: post.id }}
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteNews.mutate(post.id)}
                className="rounded-md border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
