import { Link } from "@tanstack/react-router";

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaPrimary: { label: string; to: string };
  ctaSecondary?: { label: string; to: string };
  backgroundImage?: string;
}

export function Hero({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-muted/30">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="mb-5 text-4xl font-medium leading-tight sm:text-5xl">
            {headline}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            {subheadline}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={ctaPrimary.to}
              className="rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              {ctaPrimary.label}
            </Link>
            {ctaSecondary && (
              <Link
                to={ctaSecondary.to}
                className="rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
