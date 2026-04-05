import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSession } from "@/hooks/use-session";
import { signOut } from "@/lib/auth/client";

export const Route = createFileRoute("/__public")({
  component: PublicLayout,
});

const NAV_LINKS = [
  { to: "/products",  label: "Products"  },
  { to: "/solutions", label: "Solutions" },
  { to: "/services",  label: "Services"  },
  { to: "/news",      label: "News"      },
  { to: "/about",     label: "About"     },
];

function PublicLayout() {
  const { user, isAdmin } = useSession();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-medium">
            YourCompany
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/quote"
              className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="flex flex-col gap-3 sm:col-span-1">
              <p className="text-sm font-medium">YourCompany</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Power continuity solutions for critical infrastructure.
              </p>
            </div>
            {[
              {
                heading: "Products",
                links: [
                  { label: "Online UPS",    to: "/products" },
                  { label: "Modular UPS",   to: "/products" },
                  { label: "Industrial UPS",to: "/products" },
                  { label: "All products",  to: "/products" },
                ],
              },
              {
                heading: "Company",
                links: [
                  { label: "About",    to: "/about"    },
                  { label: "Services", to: "/services" },
                  { label: "News",     to: "/news"     },
                ],
              },
              {
                heading: "Contact",
                links: [
                  { label: "Request a quote", to: "/quote"   },
                  { label: "Solutions",       to: "/solutions/data-center" },
                ],
              },
            ].map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {col.heading}
                </p>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} YourCompany. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
