import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { newsBySlugQuery, commentsQuery } from "@/features/news/queries/news.queries";
import { commentsQuery as commentsQ } from "@/features/news/queries/comments.queries";
import { CommentThread } from "@/components/news/comment-thread";
import { QuoteDrawer } from "@/components/quotes/quote-drawer";

// 👇 新增：Tiptap 渲染依赖
import { generateHTML } from "@tiptap/html";
import { editorExtensions } from "@/components/editor/extensions";
import type { JSONContent } from "@tiptap/react";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(
      newsBySlugQuery(params.slug)
    );
    if (!post) throw notFound();

    // Preload comments
    await context.queryClient.ensureQueryData(commentsQ(post.id));

    return post;
  },
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const post = Route.useLoaderData();
  const { data } = useSuspenseQuery(newsBySlugQuery(post.slug));
  if (!data) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          {data.tags.map((t) => (
            // 👇 修复：缺少 <a> 标签开头
            <a
              key={t.id}
              href={`/news?tag=${t.slug}`}
              className="rounded-full bg-muted px-2 py-0.5 text-xs hover:bg-muted/70"
            >
              {t.name}
            </a>
          ))}
        </div>
        <h1 className="mb-3 text-3xl font-medium">{data.title}</h1>
        {data.summary && (
          <p className="text-lg text-muted-foreground">{data.summary}</p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          {data.publishedAt
            ? new Date(data.publishedAt * 1000).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </p>
      </div>

      {/* Article content */}
      {/* 👇 已自动使用新的 Tiptap 渲染器 */}
      <ArticleContent content={data.content} />

      {/* Comments */}
      <Suspense fallback={<div className="mt-12 text-sm text-muted-foreground">Loading comments…</div>}>
        <CommentThread postId={data.id} />
      </Suspense>

      <QuoteDrawer />
    </div>
  );
}

// 👇 已完全替换：真正的 Tiptap 静态渲染器（SSR 无客户端 JS）
function ArticleContent({ content }: { content: unknown }) {
  if (!content) return null;

  // 将 Tiptap JSON 转为 HTML（服务器端渲染）
  const html = generateHTML(content as JSONContent, editorExtensions());

  return (
    <div
      className="prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
