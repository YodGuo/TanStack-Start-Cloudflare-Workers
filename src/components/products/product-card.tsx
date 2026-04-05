import { Link } from "@tanstack/react-router";
import type { products } from "@/lib/db/schema";

type Product = typeof products.$inferSelect;

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col rounded-xl border bg-background transition-colors hover:bg-muted/40"
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-10 w-10 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-medium group-hover:underline">{product.name}</p>
        {product.summary && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.summary}
          </p>
        )}
        <div className="mt-auto pt-3">
          <span className="text-xs font-medium text-muted-foreground">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
