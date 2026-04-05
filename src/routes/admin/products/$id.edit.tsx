import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  adminProductByIdQuery,
  categoriesQuery,
} from "@/features/products/queries/products.queries";
import { useUpdateProduct } from "@/features/products/hooks/use-products";
import { ProductForm } from "@/components/products/product-form";

export const Route = createFileRoute("/admin/products/$id/edit")({
  loader: async ({ context, params }) => {
    const [product] = await Promise.all([
      context.queryClient.ensureQueryData(adminProductByIdQuery(params.id)),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]);
    if (!product) throw notFound();
    return product;
  },
  component: EditProductPage,
});

function EditProductPage() {
  const product = Route.useLoaderData();
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const updateProduct = useUpdateProduct();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-xl font-medium">Edit product</h1>
      <ProductForm
        categories={categories}
        defaultValues={{
          name:         product.name,
          categoryId:   product.categoryId ?? undefined,
          summary:      product.summary ?? undefined,
          description:  product.description ?? undefined,
          specs:        product.specs ?? [],
          features:     product.features ?? [],
          datasheetUrl: product.datasheetUrl ?? "",
          imageUrl:     product.imageUrl ?? undefined,
          images:       product.images ?? [],
          published:    product.published ?? false,
          order:        product.order ?? 0,
        }}
        onSubmit={(values) =>
          updateProduct.mutate({ id: product.id, ...values })
        }
        isPending={updateProduct.isPending}
      />
    </div>
  );
}
