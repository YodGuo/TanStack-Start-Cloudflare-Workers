import { useSuspenseQuery } from "@tanstack/react-query";
import { commentsQuery } from "@/features/news/queries/comments.queries";
import { CommentItemComponent } from "./comment-item";
import { CommentForm } from "./comment-form";

export function CommentThread({ postId }: { postId: string }) {
  const { data: comments } = useSuspenseQuery(commentsQuery(postId));

  return (
    <section className="mt-12 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-medium">
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
        </h2>
      </div>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItemComponent
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      )}

      {/* New comment form */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Leave a comment</h3>
        <CommentForm postId={postId} />
      </div>
    </section>
  );
}
