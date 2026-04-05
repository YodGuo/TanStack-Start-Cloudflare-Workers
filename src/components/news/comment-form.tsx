import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitComment } from "@/features/news/hooks/use-comments";
import { submitCommentSchema, type SubmitCommentInput } from "@/features/news/comments.schema";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onCancel }: CommentFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitComment(postId);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<SubmitCommentInput>({
      resolver: zodResolver(submitCommentSchema),
      defaultValues: { postId, parentId },
    });

  const onSubmit = async (values: SubmitCommentInput) => {
    await mutateAsync(values);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Your comment has been submitted and is awaiting moderation.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {/* Honeypot */}
      <input {...register("_hp")} type="text" tabIndex={-1} style={{ display: "none" }} autoComplete="off" />
      <input type="hidden" {...register("postId")} />
      {parentId && <input type="hidden" {...register("parentId")} />}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name *</label>
          <input {...register("authorName")} className="input" placeholder="Your name" />
          {errors.authorName && <p className="text-xs text-red-500">{errors.authorName.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email *</label>
          <input {...register("authorEmail")} type="email" className="input" placeholder="your@email.com" />
          {errors.authorEmail && <p className="text-xs text-red-500">{errors.authorEmail.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Comment *</label>
        <textarea
          {...register("content")}
          className="input min-h-[100px] resize-none"
          placeholder={parentId ? "Write a reply…" : "Share your thoughts…"}
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {isPending ? "Posting…" : parentId ? "Post reply" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
