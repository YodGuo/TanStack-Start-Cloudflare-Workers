import { useRef, useState } from "react";
import { useUploadFile } from "@/features/media/hooks/use-media";
import type { UploadResult } from "@/features/media/hooks/use-media";

interface FileUploadProps {
  accept?: string;
  onUploaded: (result: UploadResult) => void;
}

export function FileUpload({ accept = "image/*", onUploaded }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const { mutateAsync, isPending } = useUploadFile();

  const upload = async (file: File) => {
    setProgress(`Uploading ${file.name}…`);
    try {
      const result = await mutateAsync(file);
      onUploaded(result);
    } finally {
      setProgress(null);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    upload(files[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragging
          ? "border-foreground bg-muted/60"
          : "border-muted-foreground/30 hover:border-muted-foreground/60"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {isPending ? (
        <p className="text-sm text-muted-foreground">{progress}</p>
      ) : (
        <>
          <svg className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-muted-foreground">
            Drop a file here or <span className="text-foreground underline">browse</span>
          </p>
          <p className="text-xs text-muted-foreground/60">
            JPEG, PNG, WebP, GIF, PDF — max 20 MB
          </p>
        </>
      )}
    </div>
  );
}
