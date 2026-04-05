import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@/features/products/products.schema";
import type { productCategories } from "@/lib/db/schema";
// 👇 新增：导入富文本编辑器
import { Editor } from "@/components/editor/editor";

type Category = typeof productCategories.$inferSelect;

interface ProductFormProps {
  defaultValues?: Partial<CreateProductInput>;
  categories: Category[];
  onSubmit: (values: CreateProductInput) => void;
  isPending: boolean;
}

export function ProductForm({
  defaultValues,
  categories,
  onSubmit,
  isPending,
}: ProductFormProps) {
  const { register, handleSubmit, control, setValue, formState: { errors } } =
    useForm<CreateProductInput>({
      resolver: zodResolver(createProductSchema),
      defaultValues: {
        specs: [],
        features: [],
        published: false,
        order: 0,
        ...defaultValues,
      },
    });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* Basic info */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">Basic info</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name *</label>
          <input {...register("name")} className="input" placeholder="Online UPS 10 kVA" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Category</label>
            <select {...register("categoryId")} className="input">
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Display order</label>
            <input
              {...register("order", { valueAsNumber: true })}
              type="number"
              className="input"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Summary</label>
          <input
            {...register("summary")}
            className="input"
            placeholder="Short one-line description for catalog listing"
          />
        </div>

        {/* 👇 已替换：富文本编辑器 Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <Editor
            defaultValue={
              defaultValues?.description
                ? JSON.parse(defaultValues.description)
                : undefined
            }
            placeholder="Full product description shown on detail page"
            onChange={(json) => setValue("description", JSON.stringify(json))}
            className="min-h-[120px]"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </section>

      {/* Specifications */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Specifications</h2>
          <button
            type="button"
            onClick={() => appendSpec({ label: "", value: "" })}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            + Add row
          </button>
        </div>

        {specFields.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No specifications added yet.
          </p>
        )}

        {specFields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`specs.${i}.label`)}
              className="input flex-1"
              placeholder="e.g. Capacity"
            />
            <input
              {...register(`specs.${i}.value`)}
              className="input flex-1"
              placeholder="e.g. 10 kVA / 9 kW"
            />
            <button
              type="button"
              onClick={() => removeSpec(i)}
              className="rounded-md border px-2 text-muted-foreground hover:text-destructive"
            >
              ×
            </button>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Key features</h2>
          <button
            type="button"
            onClick={() => appendFeature("")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            + Add feature
          </button>
        </div>

        {featureFields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`features.${i}`)}
              className="input flex-1"
              placeholder="e.g. Double-conversion online topology"
            />
            <button
              type="button"
              onClick={() => removeFeature(i)}
              className="rounded-md border px-2 text-muted-foreground hover:text-destructive"
            >
              ×
            </button>
          </div>
        ))}
      </section>

      {/* Media */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">Media</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Main image URL</label>
          <input
            {...register("imageUrl")}
            className="input"
            placeholder="https://..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Datasheet URL</label>
          <input
            {...register("datasheetUrl")}
            className="input"
            placeholder="https://... (PDF)"
          />
        </div>
      </section>

      {/* Visibility */}
      <section className="flex items-center gap-3">
        <input
          {...register("published")}
          id="published"
          type="checkbox"
          className="h-4 w-4"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Published (visible to public)
        </label>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
