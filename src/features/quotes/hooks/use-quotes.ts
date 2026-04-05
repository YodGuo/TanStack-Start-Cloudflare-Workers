import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitQuoteFn, updateQuoteStatusFn, deleteQuoteFn } from "../api/quotes.api";
import { QUOTE_KEYS } from "../queries";
import type { SubmitQuoteInput } from "../quotes.schema";

export function useSubmitQuote() {
  return useMutation({
    mutationFn: (data: SubmitQuoteInput) =>
      submitQuoteFn({ data }),
  });
}

export function useUpdateQuoteStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateQuoteStatusFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUOTE_KEYS.all }),
  });
}

export function useDeleteQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuoteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUOTE_KEYS.all }),
  });
}
