import type { SpecRow } from "@/features/products/products.schema";

export function ProductSpecs({ specs }: { specs: SpecRow[] }) {
  if (!specs?.length) return null;

  return (
    <div className="rounded-xl border">
      <div className="border-b px-5 py-3">
        <p className="text-sm font-medium">Specifications</p>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}
            >
              <td className="px-5 py-2.5 text-muted-foreground">
                {row.label}
              </td>
              <td className="px-5 py-2.5 font-medium">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
