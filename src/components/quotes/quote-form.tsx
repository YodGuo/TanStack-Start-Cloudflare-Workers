import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const quoteSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Required"),
  phone: z.string().optional(),
  product: z.string().optional(),
  message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  mode: "drawer" | "inline";
  product?: { id: string; name: string };
  onSuccess?: () => void;
}

export function QuoteForm({ mode, product, onSuccess }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { product: product?.name ?? "" },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        productIds: product ? [product.id] : [],
      }),
    });
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-medium">Request received</p>
        <p className="text-sm text-muted-foreground">
          Our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name *</label>
          <input {...register("name")} className="input" placeholder="Jane Smith" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Company *</label>
          <input {...register("company")} className="input" placeholder="Acme Corp" />
          {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email *</label>
        <input {...register("email")} type="email" className="input" placeholder="jane@acme.com" />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Phone</label>
        <input {...register("phone")} type="tel" className="input" placeholder="+1 555 000 0000" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Product interest</label>
        {product ? (
          <input
            value={product.name}
            readOnly
            className="input cursor-not-allowed opacity-60"
          />
        ) : (
          <input
            {...register("product")}
            className="input"
            placeholder="e.g. Online UPS 10kVA"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Requirements</label>
        <textarea
          {...register("message")}
          className="input min-h-[80px] resize-none"
          placeholder="Describe your power requirements, environment, or any questions..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
