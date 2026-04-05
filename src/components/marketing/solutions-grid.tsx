import { Link } from "@tanstack/react-router";

export interface SolutionItem {
  slug: string;
  industry: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const SOLUTIONS: SolutionItem[] = [
  {
    slug:        "data-center",
    industry:    "Data center",
    title:       "Data center & IT",
    description: "Scalable UPS topologies for server rooms, colocation facilities, and hyperscale data centers.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
  {
    slug:        "healthcare",
    industry:    "Healthcare",
    title:       "Healthcare & medical",
    description: "Medical-grade power protection compliant with IEC 60601, for hospitals, clinics, and diagnostic equipment.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    slug:        "industrial",
    industry:    "Industrial",
    title:       "Industrial & manufacturing",
    description: "Ruggedised UPS systems for factory floors, PLCs, SCADA systems, and harsh environments.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    slug:        "telecom",
    industry:    "Telecom",
    title:       "Telecommunications",
    description: "DC and AC power solutions for base stations, network nodes, and telecom infrastructure.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    slug:        "finance",
    industry:    "Finance",
    title:       "Banking & finance",
    description: "Zero-downtime power for trading floors, ATM networks, and financial data centres.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    slug:        "government",
    industry:    "Government",
    title:       "Government & defence",
    description: "Compliant, secure power continuity solutions for public sector and defence applications.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
];

export function SolutionsGrid() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-medium">Solutions by industry</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Power protection designed around the demands of your sector
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution) => (
            <Link
              key={solution.slug}
              to="/solutions/$industry"
              params={{ industry: solution.slug }}
              className="group flex flex-col gap-3 rounded-xl border bg-background p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border text-muted-foreground transition-colors group-hover:border-foreground group-hover:text-foreground">
                {solution.icon}
              </div>
              <div>
                <p className="font-medium">{solution.title}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>
              </div>
              <span className="mt-auto text-xs text-muted-foreground group-hover:text-foreground">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
