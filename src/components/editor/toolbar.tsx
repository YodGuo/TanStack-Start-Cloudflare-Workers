import type { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
}

type ToolbarButton = {
  label: string;
  icon: string;
  action: () => void;
  isActive?: boolean;
};

export function Toolbar({ editor, onInsertImage }: ToolbarProps) {
  const groups: ToolbarButton[][] = [
    [
      {
        label: "Bold",
        icon: "B",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
      },
      {
        label: "Italic",
        icon: "I",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
      },
      {
        label: "Strike",
        icon: "S",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: editor.isActive("strike"),
      },
    ],
    [
      {
        label: "H2",
        icon: "H2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: editor.isActive("heading", { level: 2 }),
      },
      {
        label: "H3",
        icon: "H3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: editor.isActive("heading", { level: 3 }),
      },
    ],
    [
      {
        label: "Bullet list",
        icon: "•—",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
      },
      {
        label: "Ordered list",
        icon: "1—",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
      },
    ],
    [
      {
        label: "Code block",
        icon: "</>",
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        isActive: editor.isActive("codeBlock"),
      },
      {
        label: "Blockquote",
        icon: "❝",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: editor.isActive("blockquote"),
      },
    ],
    [
      {
        label: "Image",
        icon: "⬚",
        action: onInsertImage,
      },
    ],
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b px-3 py-2">
      {groups.map((group, gi) => (
        <div key={gi} className="flex gap-0.5">
          {group.map((btn) => (
            <button
              key={btn.label}
              type="button"
              title={btn.label}
              onClick={btn.action}
              className={`rounded px-2 py-1 text-xs font-mono transition-colors ${
                btn.isActive
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.icon}
            </button>
          ))}
          {gi < groups.length - 1 && (
            <div className="mx-1 w-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
