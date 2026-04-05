import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { quotesQuery } from "@/features/quotes/queries";
import { useUpdateQuoteStatus, useDeleteQuote } from "@/features/quotes/hooks/use-quotes";
import type { QuoteStatus } from "@/features/quotes/quotes.schema";

export const Route = createFileRoute("/admin/quotes/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(quotesQuery()),
  component: QuotesPage,
});

const STATUS_LABELS: Record<QuoteStatus, string> = {
  new:       "New",
  contacted: "Contacted",
  quoted:    "Quoted",
  closed:    "Closed",
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  new:       "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  quoted:    "bg-purple-50 text-purple-700",
  closed:    "bg-muted text-muted-foreground",
};

function QuotesPage() {
  const { data: quotes } = useSuspenseQuery(quotesQuery());
  const updateStatus = useUpdateQuoteStatus();
  const deleteQuote = useDeleteQuote();

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-medium">Quote requests</h1>

      {quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No quote requests yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg border bg-background p-5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: contact info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {quote.name ?? quote.email}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[quote.status as QuoteStatus]}`}>
                      {STATUS_LABELS[quote.status as QuoteStatus]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{quote.email}</p>
                  {quote.company && (
                    <p className="text-sm text-muted-foreground">{quote.company}</p>
                  )}
                  {quote.phone && (
                    <p className="text-sm text-muted-foreground">{quote.phone}</p>
                  )}
                </div>

                {/* Right: actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={quote.status}
                    onChange={(e) =>
                      updateStatus.mutate({
                        data: {
                          id: quote.id,
                          status: e.target.value as QuoteStatus,
                        },
                      })
                    }
                    className="rounded-md border bg-background px-2 py-1.5 text-sm"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteQuote.mutate(quote.id)}
                    className="rounded-md border px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Message */}
              {quote.message && (
                <div className="mt-3 rounded-md bg-muted/50 px-4 py-3 text-sm">
                  {quote.message}
                </div>
              )}

              {/* Timestamp */}
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(quote.createdAt * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
