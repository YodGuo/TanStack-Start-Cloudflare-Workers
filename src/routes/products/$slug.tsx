import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productBySlugQuery } from "@/features/products/queries/products.queries";
import { ProductSpecs } from "@/components/products/product-specs";
import { QuoteInline } from "@/components/quotes/quote-inline";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(
      productBySlugQuery(params.slug)
    );
    if (!product) throw notFound();
    return product;
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const product = Route.useLoaderData();
  const { data } = useSuspenseQuery(productBySlugQuery(product.slug));
  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <a href="/products" className="hover:text-foreground">Products</a>
        <span className="mx-2">/</span>
        <span>{data.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-12 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-video overflow-hidden rounded-xl bg-muted">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground/30">
              No image
            </div>
          )}
        </div>

        {/* Summary + quote form */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="mb-3 text-3xl font-medium">{data.name}</h1>
            {data.summary && (
              <p className="text-lg text-muted-foreground">{data.summary}</p>
            )}
          </div>

          {/* Key features */}
          {data.features && data.features.length > 0 && (
            <ul className="flex flex-col gap-2">
              {data.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-muted-foreground">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Datasheet download */}
          {data.datasheetUrl && (
            
              href={data.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download datasheet (PDF)
            </a>
          )}

          {/* Inline quote form */}
          <QuoteInline product={{ id: data.id, name: data.name }} />
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">Overview</h2>
          <div
            className="prose prose-neutral max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </section>
      )}

      {/* Specifications table */}
      {data.specs && data.specs.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">Specifications</h2>
          <ProductSpecs specs={data.specs} />
        </section>
      )}

      {/* Image gallery */}
      {data.images && data.images.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-medium">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.images.map((url, i) => (
              <div key={i} className="aspect-video overflow-hidden rounded-lg bg-muted">
                <img src={url} alt={`${data.name} ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
