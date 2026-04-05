import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { adminCommentsQuery } from "@/features/news/queries/comments.queries";
import { useUpdateCommentStatus, useDeleteComment } from "@/features/news/hooks/use-comments";
import type { CommentStatus } from "@/features/news/comments.schema";

const searchSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "all"]).default("pending"),
});

export const Route = createFileRoute("/admin/news/comments")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ status: search.status }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(adminCommentsQuery(deps.status)),
  component: AdminCommentsPage,
});

function AdminCommentsPage() {
  const { status } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: comments } = useSuspenseQuery(adminCommentsQuery(status));
  const updateStatus = useUpdateCommentStatus();
  const deleteComment = useDeleteComment();

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-medium">Comment moderation</h1>

      {/* Status filter tabs */}
      <div className="mb-6 flex gap-2 border-b">
        {(["pending", "approved", "rejected", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => navigate({ search: { status: s } })}
            className={`border-b-2 px-4 py-2 text-sm capitalize transition-colors ${
              status === s
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments in this category.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border bg-background p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">{comment.authorEmail}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt * 1000).toLocaleString()}
                </p>
              </div>

              <p className="mb-3 text-sm">{comment.content}</p>

              <div className="flex gap-2">
                {comment.status !== "approved" && (
                  <button
                    onClick={() => updateStatus.mutate({ id: comment.id, status: "approved" })}
                    className="rounded-md border border-green-200 px-3 py-1.5 text-xs text-green-700 hover:bg-green-50"
                  >
                    Approve
                  </button>
                )}
                {comment.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus.mutate({ id: comment.id, status: "rejected" })}
                    className="rounded-md border border-amber-200 px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => deleteComment.mutate(comment.id)}
                  className="rounded-md border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
