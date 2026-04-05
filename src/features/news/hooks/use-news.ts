import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createNewsFn, updateNewsFn, deleteNewsFn } from "../api/news.api";
import { NEWS_KEYS } from "../queries/news.queries";
import type { CreateNewsInput, UpdateNewsInput } from "../news.schema";

export function useCreateNews() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateNewsInput) => createNewsFn({ data }),
    onSuccess: ({ slug }) => {
      qc.invalidateQueries({ queryKey: NEWS_KEYS.all });
      navigate({ to: "/admin/news" });
    },
  });
}

// ✅ 已更新：成功后返回上一页 + 完整缓存失效
export function useUpdateNews() {
  const qc = useQueryClient();
  const navigate = useNavigate(); // 👈 新增导航

  return useMutation({
    mutationFn: (data: UpdateNewsInput) => updateNewsFn({ data }),
    onSuccess: (_, variables) => {
      // 失效列表缓存
      qc.invalidateQueries({ queryKey: NEWS_KEYS.all });
      // 失效当前文章详情缓存
      qc.invalidateQueries({
        queryKey: NEWS_KEYS.adminById(variables.id),
      });
      // 🚀 成功后返回上一页（回到管理员新闻列表）
      navigate({ to: ".." });
    },
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNewsFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWS_KEYS.all }),
  });
}
