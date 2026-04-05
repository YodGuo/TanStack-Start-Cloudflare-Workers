import { useState } from "react";
import { CommentForm } from "./comment-form";
import type { CommentItem } from "@/features/news/comments.schema";

interface CommentItemProps {
  comment: CommentItem;
  postId: string;
}

export function CommentItemComponent({ comment, postId }: CommentItemProps) {
  const [replying, setReplying] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Comment body */}
      <div className="rounded-lg border bg-background p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">{comment.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt * 1000).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{comment.content}</p>
        <button
          onClick={() => setReplying((v) => !v)}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {replying ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Reply form */}
      {replying && (
        <div className="ml-6">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}

      {/* Nested replies */}
      {comment.replies.length > 0 && (
        <div className="ml-6 flex flex-col gap-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{reply.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(reply.createdAt * 1000).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
