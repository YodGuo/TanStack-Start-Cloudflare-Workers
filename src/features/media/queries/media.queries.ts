import { queryOptions } from "@tanstack/react-query";
import { getMediaFn } from "../api/media.api";

export const MEDIA_KEYS = {
  all:  ["media"] as const,
  list: () => ["media", "list"] as const,
};

export function mediaQuery() {
  return queryOptions({
    queryKey: MEDIA_KEYS.list(),
    queryFn: () => getMediaFn({ data: { limit: 50 } }),
  });
}
