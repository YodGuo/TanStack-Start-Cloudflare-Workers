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

export function useUpdateNews() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNewsInput) => updateNewsFn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWS_KEYS.all }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNewsFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWS_KEYS.all }),
  });
}
