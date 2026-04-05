import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import { Editor } from "@/components/editor/editor";
import { useUpdateNews } from "@/features/news/hooks/use-news";
import {
  adminNewsByIdQuery,
  tagsQuery,
} from "@/features/news/queries/news.queries";
import type { NewsStatus } from "@/features/news/news.schema";

// ── Query addition needed in news.queries.ts ──────────────────────────────
// export function adminNewsByIdQuery(id: string) {
//   return queryOptions({
//     queryKey: NEWS_KEYS.adminById(id),
//     queryFn: () => getAdminNewsByIdFn({ data: { id } }),
//   });
// }
//
// And in NEWS_KEYS:
//   adminById: (id: string) => ["news", "admin", id] as const,

const editSchema = z.object({
  title:   z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  tags:    z.string().optional(), // comma-separated
  status:  z.enum(["draft", "published"]),
});

type EditFormValues = z.infer<typeof editSchema>;

export const Route = createFileRoute("/admin/news/$id/edit")({
  loader: async ({ context, params }) => {
    const [post] = await Promise.all([
      context.queryClient.ensureQueryData(adminNewsByIdQuery(params.id)),
      context.queryClient.ensureQueryData(tagsQuery()),
    ]);
    if (!post) throw notFound();
    return post;
  },
  component: EditNewsPage,
});

function EditNewsPage() {
  const post = Route.useLoaderData();
  const { data } = useSuspenseQuery(adminNewsByIdQuery(post.id));
  const { data: allTags } = useSuspenseQuery(tagsQuery());

  if (!data) return null;

  const updateNews = useUpdateNews();

  const [content, setContent] = useState<JSONContent | undefined>(
    data.content as JSONContent | undefined
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title:   data.title,
      summary: data.summary ?? "",
      tags:    data.tags.map((t) => t.name).join(", "),
      status:  data.status as NewsStatus,
    },
  });

  const currentStatus = watch("status");

  const onSubmit = (values: EditFormValues) => {
    const tags = values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    updateNews.mutate({
      id: data.id,
      title:   values.title,
      summary: values.summary,
      content,
      tags,
      status:  values.status,
      publishedAt:
        values.status === "published" && !data.publishedAt
          ? Math.floor(Date.now() / 1000)
          : data.publishedAt ?? undefined,
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Edit article</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            /{data.slug}
          </p>
        </div>
        
          href={`/news/${data.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View live →
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Title *</label>
          <input
            {...register("title")}
            className="input text-base font-medium"
            placeholder="Article title"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Summary
            <span className="ml-1 text-muted-foreground font-normal">
              — shown on listing page
            </span>
          </label>
          <input
            {...register("summary")}
            className="input"
            placeholder="Short description for the news listing"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Content</label>
          <Editor
            defaultValue={data.content as JSONContent}
            placeholder="Write your article…"
            onChange={setContent}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Tags
            <span className="ml-1 text-muted-foreground font-normal">
              — comma separated
            </span>
          </label>
          <input
            {...register("tags")}
            className="input"
            placeholder="industry news, product update, maintenance"
          />
          {/* Existing tag suggestions */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const current = watch("tags") ?? "";
                    const existing = current
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    if (!existing.includes(tag.name)) {
                      setValue(
                        "tags",
                        [...existing, tag.name].join(", "),
                        { shouldDirty: true }
                      );
                    }
                  }}
                  className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-foreground hover:text-foreground"
                >
                  + {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status + submit row */}
        <div className="flex items-center justify-between border-t pt-5">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Status</label>
            <select
              {...register("status")}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {currentStatus === "published" && !data.publishedAt && (
              <span className="text-xs text-muted-foreground">
                Will set publish time to now
              </span>
            )}
            {data.publishedAt && (
              <span className="text-xs text-muted-foreground">
                Published{" "}
                {new Date(data.publishedAt * 1000).toLocaleDateString("en-US", {
                  year:  "numeric",
                  month: "short",
                  day:   "numeric",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {updateNews.isSuccess && !isDirty && (
              <span className="text-xs text-green-600">Saved</span>
            )}
            <button
              type="submit"
              disabled={updateNews.isPending || !isDirty}
              className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-40"
            >
              {updateNews.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
