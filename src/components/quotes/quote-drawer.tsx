import { useState, useEffect } from "react";
import { QuoteForm } from "./quote-form";

interface QuoteDrawerProps {
  product?: { id: string; name: string };
}

export function QuoteDrawer({ product }: QuoteDrawerProps) {
  const [open, setOpen] = useState(false);

  // Trap scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lg transition-transform hover:scale-105"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Request a quote
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="font-medium">Request a quote</p>
            <p className="text-sm text-muted-foreground">
              We'll respond within one business day
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 hover:bg-muted"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <QuoteForm
            mode="drawer"
            product={product}
            onSuccess={() => {
              // Keep panel open to show success state
            }}
          />
        </div>
      </div>
    </>
  );
}
