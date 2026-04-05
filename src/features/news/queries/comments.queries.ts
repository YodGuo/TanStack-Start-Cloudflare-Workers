import { queryOptions } from "@tanstack/react-query";
import { getCommentsFn, getAdminCommentsFn } from "../api/comments.api";
import type { CommentStatus } from "../comments.schema";

export const COMMENT_KEYS = {
  all:       ["comments"] as const,
  byPost:    (postId: string) => ["comments", "post", postId] as const,
  adminList: (status: string) => ["comments", "admin", status] as const,
};

export function commentsQuery(postId: string) {
  return queryOptions({
    queryKey: COMMENT_KEYS.byPost(postId),
    queryFn: () => getCommentsFn({ data: { postId } }),
  });
}

export function adminCommentsQuery(status: CommentStatus | "all" = "pending") {
  return queryOptions({
    queryKey: COMMENT_KEYS.adminList(status),
    queryFn: () => getAdminCommentsFn({ data: { status } }),
  });
}
