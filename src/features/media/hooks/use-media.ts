import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestUploadUrlFn, confirmUploadFn, deleteMediaFn } from "../api/media.api";
import { MEDIA_KEYS } from "../queries/media.queries";

export interface UploadResult {
  id: string;
  url: string;
  key: string;
}

// Single hook that handles the full two-step upload flow
export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      // Step 1 — get presigned URL
      const { key, uploadUrl } = await requestUploadUrlFn({
        data: {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        },
      });

      // Step 2 — PUT directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error(`R2 upload failed: ${uploadRes.status}`);
      }

      // Step 3 — confirm and record in D1
      return confirmUploadFn({
        data: {
          key,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        },
      });
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMediaFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEDIA_KEYS.all }),
  });
}
