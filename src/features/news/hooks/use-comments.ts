import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCommentFn, updateCommentStatusFn, deleteCommentFn } from "../api/comments.api";
import { COMMENT_KEYS } from "../queries/comments.queries";
import type { SubmitCommentInput, CommentStatus } from "../comments.schema";

export function useSubmitComment(postId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitCommentInput) => submitCommentFn({ data }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.byPost(postId) }),
  });
}

export function useUpdateCommentStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; status: CommentStatus }) =>
      updateCommentStatusFn({ data }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.all }),
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCommentFn({ data: { id } }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.all }),
  });
}
