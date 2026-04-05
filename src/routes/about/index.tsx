import { createFileRoute } from "@tanstack/react-router";
import { Certifications } from "@/components/marketing/certifications";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-medium">About us</h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Founded in 2004, we have protected critical infrastructure across
            Africa and the Middle East for two decades — from hospital theatres
            to tier-3 data centres.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium">Our story</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We started as a service company maintaining third-party UPS
              systems, which gave us an unfiltered view of where designs failed
              in the field. That experience shaped our product selection
              philosophy: we only represent equipment we would stake our
              reputation on.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Today our team of engineers covers the full project lifecycle —
              from initial power audit through to long-term monitoring contracts
              — with the same people involved from survey to handover.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium">Why clients choose us</h2>
            <ul className="flex flex-col gap-3">
              {[
                "Independent advice — we specify what fits, not what earns the highest margin",
                "Engineering depth — our team holds IEC and manufacturer certifications",
                "Long-term relationships — most clients have been with us for over five years",
                "Fast response — 4-hour on-site SLA for critical failures",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 text-muted-foreground">—</span>
                  <span className="text-muted-foreground leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Certifications />

      <CtaBanner
        headline="Work with engineers who understand power"
        subtext="Get independent advice on your next project — no sales pressure, just engineering."
        cta={{ label: "Get in touch", to: "/quote" }}
      />

      <QuoteDrawer />
    </>
  );
}
