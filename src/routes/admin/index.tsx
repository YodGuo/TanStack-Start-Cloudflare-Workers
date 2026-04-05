import { createFileRoute } from "@tanstack/react-router";
import { quotesQuery } from "@/features/quotes/queries";

export const Route = createFileRoute("/admin/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(quotesQuery()),
  component: AdminOverview,
});

function AdminOverview() {
  const quotes = Route.useLoaderData();
  const newCount = quotes.filter((q) => q.status === "new").length;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-medium">Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total quotes" value={quotes.length} />
        <StatCard label="New quotes" value={newCount} highlight={newCount > 0} />
        <StatCard label="In progress" value={quotes.filter(q => q.status === "contacted" || q.status === "quoted").length} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-5 ${highlight ? "border-amber-200 bg-amber-50" : "bg-muted/40"}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
  );
}
