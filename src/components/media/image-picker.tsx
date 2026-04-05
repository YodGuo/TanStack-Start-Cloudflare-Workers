import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { mediaQuery } from "@/features/media/queries/media.queries";
import { FileUpload } from "./file-upload";
import type { UploadResult } from "@/features/media/hooks/use-media";

interface ImagePickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-2xl flex-col rounded-xl border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex gap-4">
            {(["library", "upload"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm capitalize transition-colors ${
                  tab === t
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {tab === "upload" ? (
            <FileUpload
              onUploaded={(result: UploadResult) => {
                onSelect(result.url);
                onClose();
              }}
            />
          ) : (
            <Suspense fallback={
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading library…
              </div>
            }>
              <MediaLibrary onSelect={onSelect} onClose={onClose} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaLibrary({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const { data: items } = useSuspenseQuery(mediaQuery());
  const images = items.filter((m) => m.mimeType.startsWith("image/"));

  if (images.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No images uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {images.map((item) => (
        <button
          key={item.id}
          onClick={() => { onSelect(item.url); onClose(); }}
          className="group aspect-square overflow-hidden rounded-lg border bg-muted transition-all hover:border-foreground"
        >
          <img
            src={item.url}
            alt={item.filename}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}
