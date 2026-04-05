import { Link } from "@tanstack/react-router";
import type { products } from "@/lib/db/schema";

type Product = typeof products.$inferSelect;

export function ProductHighlights({ items }: { items: Product[] }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-medium">Featured products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Purpose-built UPS solutions for critical environments
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((product) => (
          <Link
            key={product.id}
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="group flex flex-col gap-4 rounded-xl border bg-background p-5 transition-colors hover:bg-muted/40"
          >
            {/* Image */}
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-8 w-8 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-medium group-hover:underline">{product.name}</p>
              {product.summary && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {product.summary}
                </p>
              )}
            </div>

            {/* Top 3 specs inline */}
            {product.specs && product.specs.length > 0 && (
              <div className="flex flex-col gap-1 border-t pt-3">
                {(product.specs as Array<{ label: string; value: string }>)
                  .slice(0, 3)
                  .map((spec) => (
                    <div key={spec.label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
