import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { productsQuery, categoriesQuery } from "@/features/products/queries/products.queries";
import { ProductCard } from "@/components/products/product-card";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";

const searchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery(deps.category)),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: productList } = useSuspenseQuery(productsQuery(category));
  const { data: categories }  = useSuspenseQuery(categoriesQuery());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-medium">Products</h1>
        <p className="mt-1 text-muted-foreground">
          Uninterruptible power supply solutions for every environment
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: {} })}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              !category
                ? "bg-foreground text-background"
                : "hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ search: { category: cat.slug } })}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                category === cat.slug
                  ? "bg-foreground text-background"
                  : "hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {productList.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <QuoteDrawer />
    </div>
  );
}
