interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "20+",    label: "Years of experience"      },
  { value: "500+",   label: "Installations worldwide"  },
  { value: "99.99%", label: "Guaranteed uptime"        },
  { value: "24 / 7", label: "Technical support"        },
];

export function StatsBar({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <section className="border-y bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 text-center">
              <p className="text-3xl font-medium">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
