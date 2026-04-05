import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { requireAdmin } from "@/middleware/auth";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/admin")({
  middleware: [requireAdmin],
  beforeLoad: ({ context }) => {
    if (!context.user || context.user.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

const navItems = [
  { to: "/admin",        label: "Overview"  },
  { to: "/admin/quotes", label: "Quotes"    },
  { to: "/admin/news",   label: "News"      },
  { to: "/admin/products", label: "Products" },
];

function AdminLayout() {
  const { user } = useSession();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r bg-muted/40">
        <div className="border-b px-5 py-4">
          <p className="text-sm font-medium">Admin</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
              activeProps={{ className: "bg-muted font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
