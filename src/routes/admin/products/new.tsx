import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/features/products/queries/products.queries";
import { useCreateProduct } from "@/features/products/hooks/use-products";
import { ProductForm } from "@/components/products/product-form";

export const Route = createFileRoute("/admin/products/new")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(categoriesQuery()),
  component: NewProductPage,
});

function NewProductPage() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const createProduct = useCreateProduct();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-xl font-medium">New product</h1>
      <ProductForm
        categories={categories}
        onSubmit={(values) => createProduct.mutate(values)}
        isPending={createProduct.isPending}
      />
    </div>
  );
}
