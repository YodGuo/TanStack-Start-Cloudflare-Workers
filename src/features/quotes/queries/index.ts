import { queryOptions } from "@tanstack/react-query";
import { getQuotesFn } from "../api/quotes.api";

export const QUOTE_KEYS = {
  all: ["quotes"] as const,
  list: () => [...QUOTE_KEYS.all, "list"] as const,
};

export function quotesQuery() {
  return queryOptions({
    queryKey: QUOTE_KEYS.list(),
    queryFn: () => getQuotesFn(),
  });
}
