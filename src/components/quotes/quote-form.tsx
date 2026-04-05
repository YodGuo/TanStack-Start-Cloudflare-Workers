import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitQuote } from "@/features/quotes/hooks/use-quotes";

const quoteSchema = z.object({
  email:   z.string().email("Invalid email"),
  name:    z.string().optional(),
  company: z.string().optional(),
  phone:   z.string().optional(),
  product: z.string().optional(),
  message: z.string().min(1, "Please describe your requirements"),
  _hp:     z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  mode: "drawer" | "inline";
  product?: { id: string; name: string };
  onSuccess?: () => void;
}

export function QuoteForm({ mode, product, onSuccess }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitQuote();

  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { product: product?.name ?? "" },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    await mutateAsync({ ...values, productIds: product ? [product.id] : [] });
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
          <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-base font-medium">Request received</p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register("_hp")} type="text" tabIndex={-1} style={{ display: "none" }} autoComplete="off" />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email *</label>
        <input {...register("email")} type="email" className="input" placeholder="you@company.com" />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--color-text-secondary)]">Name</label>
          <input {...register("name")} className="input" placeholder="Jane Smith" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--color-text-secondary)]">Company</label>
          <input {...register("company")} className="input" placeholder="Acme Corp" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-[var(--color-text-secondary)]">Phone</label>
        <input {...register("phone")} type="tel" className="input" placeholder="+1 555 000 0000" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-[var(--color-text-secondary)]">Product interest</label>
        {product ? (
          <input value={product.name} readOnly className="input cursor-not-allowed opacity-60" />
        ) : (
          <input {...register("product")} className="input" placeholder="e.g. Online UPS 10 kVA" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Requirements *</label>
        <textarea
          {...register("message")}
          className="input min-h-[100px] resize-none"
          placeholder="Describe your power requirements, load type, environment, backup duration needed…"
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isPending} className="btn-primary mt-1">
        {isPending ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
