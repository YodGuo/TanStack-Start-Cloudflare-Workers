import { createFileRoute, notFound } from "@tanstack/react-router";
import { SOLUTIONS } from "@/components/marketing/solutions-grid";
import { productsQuery } from "@/features/products/queries/products.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/products/product-card";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";

// Static content per industry
const SOLUTION_DETAIL: Record<string, {
  challenge: string;
  requirements: string[];
  recommended: string[];   // product category slugs
}> = {
  "data-center": {
    challenge:
      "Data centres cannot tolerate even milliseconds of downtime. A single power event can corrupt in-flight transactions, trigger costly unplanned shutdowns, and violate SLA commitments worth millions.",
    requirements: [
      "Double-conversion online topology for zero transfer time",
      "Hot-swappable batteries and modules for maintenance without shutdown",
      "High efficiency (>96%) to reduce cooling load and energy costs",
      "Scalable N+1 or 2N redundancy configurations",
      "SNMP / Modbus integration with DCIM platforms",
    ],
    recommended: [],
  },
  "healthcare": {
    challenge:
      "Medical equipment failure during surgery or ICU monitoring can be life-threatening. Healthcare UPS must meet IEC 60601 and maintain power quality to protect sensitive diagnostic and life-support equipment.",
    requirements: [
      "IEC 60601-1 compliant isolation transformers",
      "Low leakage current for patient-connected equipment",
      "Automatic bypass with <1 ms transfer for non-critical loads",
      "Battery self-test with fault alerting",
      "IT and TN-S distribution compatibility",
    ],
    recommended: [],
  },
  "industrial": {
    challenge:
      "Factory environments expose power systems to voltage spikes, harmonics from variable-speed drives, and extreme temperatures. Industrial UPS must protect PLCs, SCADA, and automation equipment in harsh conditions.",
    requirements: [
      "Wide input voltage window to handle generator fluctuations",
      "High tolerance for input harmonics (THDi)",
      "Extended temperature range (-10°C to +50°C)",
      "IP-rated enclosures for dusty or wet environments",
      "DIN rail mounting options for control cabinet integration",
    ],
    recommended: [],
  },
  "telecom": {
    challenge:
      "Telecom infrastructure requires continuous power across distributed, often unmanned sites. Battery backup must bridge grid outages until generator start, with remote monitoring across thousands of nodes.",
    requirements: [
      "DC power plant compatibility (48V / 24V systems)",
      "Wide operating temperature range for outdoor cabinets",
      "Remote monitoring via SNMP, 4G, or satellite",
      "Lithium-ion battery options for longer cycle life",
      "Modular architecture for phased capacity expansion",
    ],
    recommended: [],
  },
  "finance": {
    challenge:
      "Trading platforms, ATM networks, and core banking systems must operate without interruption. A microsecond of downtime during peak trading can result in significant financial and reputational damage.",
    requirements: [
      "Sub-millisecond failover with double-conversion topology",
      "Redundant power paths (A + B feeds) for critical loads",
      "Integrated power quality monitoring and event logging",
      "Compliance with financial sector availability mandates",
      "Scalable from branch office to trading floor",
    ],
    recommended: [],
  },
  "government": {
    challenge:
      "Public sector and defence installations demand security-cleared supply chains, compliance with government procurement standards, and long design life to match building infrastructure cycles.",
    requirements: [
      "Compliance with government procurement frameworks",
      "20+ year design life with long-term parts availability",
      "Secure supply chain with traceable components",
      "EMC compliance for sensitive environments",
      "Integration with building management systems (BMS)",
    ],
    recommended: [],
  },
};

export const Route = createFileRoute("/solutions/$industry")({
  loader: async ({ context, params }) => {
    const solution = SOLUTIONS.find((s) => s.slug === params.industry);
    if (!solution) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return solution;
  },
  component: SolutionPage,
});

function SolutionPage() {
  const solution  = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQuery());
  const detail    = SOLUTION_DETAIL[solution.slug];

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm text-muted-foreground">
            Solutions / {solution.industry}
          </p>
          <h1 className="mb-4 text-4xl font-medium">{solution.title}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {solution.description}
          </p>
        </div>
      </section>

      {/* Challenge */}
      {detail && (
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="mb-4 text-xl font-medium">The challenge</h2>
          <p className="text-muted-foreground leading-relaxed">
            {detail.challenge}
          </p>
        </section>
      )}

      {/* Requirements */}
      {detail && detail.requirements.length > 0 && (
        <section className="bg-muted/30 py-14">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-xl font-medium">
              Power protection requirements
            </h2>
            <ul className="flex flex-col gap-3">
              {detail.requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs">
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Recommended products */}
      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="mb-6 text-xl font-medium">Recommended products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <CtaBanner
        headline={`Power your ${solution.industry.toLowerCase()} environment`}
        subtext="Speak with an engineer about the right configuration for your site."
        cta={{ label: "Request a consultation", to: "/quote" }}
      />

      <QuoteDrawer />
    </>
  );
}
