import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getNewsListFn, getNewsBySlugFn, getTagsFn, getAdminNewsListFn } from "../api/news.api";

export const NEWS_KEYS = {
  all:       ["news"] as const,
  list:      (tag?: string) => ["news", "list", tag ?? "all"] as const,
  detail:    (slug: string) => ["news", "detail", slug] as const,
  tags:      () => ["news", "tags"] as const,
  adminList: () => ["news", "admin", "list"] as const,
};

export function newsListQuery(tag?: string) {
  return infiniteQueryOptions({
    queryKey: NEWS_KEYS.list(tag),
    queryFn: ({ pageParam = 0 }) =>
      getNewsListFn({ data: { tag, limit: 12, offset: pageParam } }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length * 12 : undefined,
    initialPageParam: 0,
  });
}

export function newsBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: NEWS_KEYS.detail(slug),
    queryFn: () => getNewsBySlugFn({ data: { slug } }),
  });
}

export function tagsQuery() {
  return queryOptions({
    queryKey: NEWS_KEYS.tags(),
    queryFn: () => getTagsFn(),
  });
}

export function adminNewsListQuery() {
  return queryOptions({
    queryKey: NEWS_KEYS.adminList(),
    queryFn: () => getAdminNewsListFn(),
  });
}
