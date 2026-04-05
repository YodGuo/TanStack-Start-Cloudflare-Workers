import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminProductsQuery } from "@/features/products/queries/products.queries";
import { useDeleteProduct, useToggleProductPublished } from "@/features/products/hooks/use-products";

export const Route = createFileRoute("/admin/products/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminProductsQuery()),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { data: productList } = useSuspenseQuery(adminProductsQuery());
  const deleteProduct = useDeleteProduct();
  const togglePublished = useToggleProductPublished();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-medium">Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          New product
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {productList.length === 0 && (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        )}
        {productList.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
          >
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="h-10 w-16 overflow-hidden rounded bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  /{product.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                product.published
                  ? "bg-green-50 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}>
                {product.published ? "Published" : "Draft"}
              </span>
              <button
                onClick={() =>
                  togglePublished.mutate({
                    id: product.id,
                    published: !product.published,
                  })
                }
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
              >
                {product.published ? "Unpublish" : "Publish"}
              </button>
              <Link
                to="/admin/products/$id/edit"
                params={{ id: product.id }}
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteProduct.mutate(product.id)}
                className="rounded-md border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
