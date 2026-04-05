import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useCallback } from "react";
import { editorExtensions } from "./extensions";
import { Toolbar } from "./toolbar";
import { ImagePicker } from "@/components/media/image-picker";
import type { JSONContent } from "@tiptap/react";

interface EditorProps {
  defaultValue?: JSONContent;
  placeholder?: string;
  onChange?: (content: JSONContent) => void;
}

export function Editor({ defaultValue, placeholder, onChange }: EditorProps) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const editor = useEditor({
    extensions: editorExtensions(placeholder),
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[320px] px-5 py-4 focus:outline-none text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  const insertImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <>
      <div className="rounded-xl border bg-background">
        <Toolbar editor={editor} onInsertImage={() => setImagePickerOpen(true)} />
        <EditorContent editor={editor} />
      </div>

      {imagePickerOpen && (
        <ImagePicker
          onSelect={insertImage}
          onClose={() => setImagePickerOpen(false)}
        />
      )}
    </>
  );
}
