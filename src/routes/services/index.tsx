import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";

const SERVICES = [
  {
    title:       "Power audit & site survey",
    description: "We assess your existing infrastructure, measure load profiles, identify single points of failure, and produce a written risk report with prioritised recommendations.",
    deliverable: "Written risk assessment + load profile report",
  },
  {
    title:       "UPS sizing & selection",
    description: "Using measured load data and your growth projections, we calculate the correct kVA rating, topology, redundancy level, and battery autonomy for your application.",
    deliverable: "Sizing calculation sheet + product recommendation",
  },
  {
    title:       "Design & engineering",
    description: "Full power system design including single-line diagrams, earthing schemes, PDU layout, and integration with generator and building management systems.",
    deliverable: "Stamped engineering drawings + BOM",
  },
  {
    title:       "Installation & commissioning",
    description: "Factory-trained engineers handle mechanical installation, cable termination, battery connection, and full load commissioning with a signed handover certificate.",
    deliverable: "Commissioning report + handover certificate",
  },
  {
    title:       "Preventive maintenance",
    description: "Scheduled inspection visits covering battery capacity testing, thermal imaging, torque checks, firmware updates, and a written service record.",
    deliverable: "Service report + battery health certificate",
  },
  {
    title:       "24 / 7 remote monitoring",
    description: "SNMP-based monitoring of your UPS fleet with proactive alerting, monthly health reports, and direct escalation to our engineering team for critical events.",
    deliverable: "Monthly health report + on-call escalation",
  },
];

export const Route = createFileRoute("/services/")({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-medium">Consulting services</h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            End-to-end power consulting from initial audit through to long-term
            monitoring — delivered by engineers with decades of field experience.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-3 rounded-xl border bg-background p-6"
            >
              <p className="font-medium">{service.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="mt-auto border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Deliverable: </span>
                  {service.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-medium text-center">
            How we work
          </h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { step: "01", label: "Brief",     desc: "You describe your environment, loads, and concerns." },
              { step: "02", label: "Survey",    desc: "We visit site, measure, and document the current state." },
              { step: "03", label: "Proposal",  desc: "We present a solution with clear scope and pricing." },
              { step: "04", label: "Deliver",   desc: "We execute, commission, and hand over documentation." },
            ].map((phase) => (
              <div key={phase.step} className="flex flex-col gap-2">
                <span className="text-3xl font-medium text-muted-foreground/30">
                  {phase.step}
                </span>
                <p className="font-medium">{phase.label}</p>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        headline="Start with a free site assessment"
        subtext="We'll identify your risks and recommend a practical remediation path — no obligation."
        cta={{ label: "Book an assessment", to: "/quote" }}
      />

      <QuoteDrawer />
    </>
  );
}
