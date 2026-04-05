import { z } from "zod";

export const commentStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type CommentStatus = z.infer<typeof commentStatusSchema>;

export const submitCommentSchema = z.object({
  postId: z.string(),
  parentId: z.string().optional(),
  authorName: z.string().min(1, "Name is required"),
  authorEmail: z.string().email("Invalid email"),
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  _hp: z.string().optional(), // honeypot
});

export const updateCommentStatusSchema = z.object({
  id: z.string(),
  status: commentStatusSchema,
});

export type SubmitCommentInput = z.infer<typeof submitCommentSchema>;

export type CommentItem = {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string | null;
  authorEmail: string | null;
  content: string;
  status: CommentStatus;
  createdAt: number;
  replies: CommentItem[];
};
