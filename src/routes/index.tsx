import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { ProductHighlights } from "@/components/marketing/product-highlights";
import { SolutionsGrid } from "@/components/marketing/solutions-grid";
import { NewsHighlights } from "@/components/marketing/news-highlights";
import { Certifications } from "@/components/marketing/certifications";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";
import { productsQuery } from "@/features/products/queries/products.queries";
import { newsListQuery } from "@/features/news/queries/news.queries";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureInfiniteQueryData(newsListQuery()),
    ]),
  component: HomePage,
});

function HomePage() {
  const { data: products }  = useSuspenseQuery(productsQuery());
  const { data: newsPages } = useSuspenseQuery(newsListQuery());
  const latestNews = newsPages.pages[0]?.items ?? [];

  return (
    <>
      <Hero
        headline="Power continuity you can rely on"
        subheadline="Enterprise-grade UPS systems and power consulting for data centres, healthcare, industrial, and critical infrastructure."
        ctaPrimary={{ label: "Explore products", to: "/products" }}
        ctaSecondary={{ label: "Request a quote", to: "/quote" }}
      />

      <StatsBar />
      <ProductHighlights items={products} />
      <SolutionsGrid />
      <NewsHighlights items={latestNews} />
      <Certifications />

      <CtaBanner
        headline="Need a custom power solution?"
        subtext="Our engineers assess your load requirements, environment, and budget to recommend the right system."
        cta={{ label: "Talk to an engineer", to: "/quote" }}
      />

      <QuoteDrawer />
    </>
  );
}
