import { QuoteForm } from "./quote-form";

interface QuoteInlineProps {
  product: { id: string; name: string };
}

export function QuoteInline({ product }: QuoteInlineProps) {
  return (
    <div className="rounded-xl border bg-muted/40 p-6">
      <div className="mb-5">
        <p className="font-medium">Request a quote</p>
        <p className="text-sm text-muted-foreground">
          Get pricing for {product.name}
        </p>
      </div>
      <QuoteForm mode="inline" product={product} />
    </div>
  );
}
