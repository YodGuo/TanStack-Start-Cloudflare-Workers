import { Link } from "@tanstack/react-router";

interface CtaBannerProps {
  headline: string;
  subtext: string;
  cta: { label: string; to: string };
}

export function CtaBanner({ headline, subtext, cta }: CtaBannerProps) {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="mb-3 text-2xl font-medium">{headline}</h2>
        <p className="mb-8 text-sm opacity-70">{subtext}</p>
        <Link
          to={cta.to}
          className="rounded-md border border-background/30 bg-background px-8 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
        >
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
