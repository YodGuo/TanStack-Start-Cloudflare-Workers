import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { Editor } from "@/components/editor/editor";
import { useCreateNews } from "@/features/news/hooks/use-news";

export const Route = createFileRoute("/admin/news/new")({
  component: NewNewsPage,
});

function NewNewsPage() {
  const createNews = useCreateNews();
  const [content, setContent] = useState<JSONContent | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createNews.mutate({
      title:   fd.get("title") as string,
      summary: fd.get("summary") as string,
      content,
      status:  "draft",
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-xl font-medium">New article</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Title *</label>
          <input name="title" className="input" placeholder="Article title" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Summary</label>
          <input name="summary" className="input" placeholder="Short description for listing page" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Content</label>
          <Editor placeholder="Write your article…" onChange={setContent} />
        </div>
        <button
          type="submit"
          disabled={createNews.isPending}
          className="btn-primary"
        >
          {createNews.isPending ? "Saving…" : "Save article"}
        </button>
      </form>
    </div>
  );
}
