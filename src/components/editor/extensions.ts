import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";

const lowlight = createLowlight();
lowlight.register({ css, js, ts, xml, bash, python });

export const editorExtensions = (placeholder?: string) => [
  StarterKit.configure({
    codeBlock: false, // replaced by CodeBlockLowlight
  }),
  Image.configure({
    inline: false,
    allowBase64: false,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
  }),
  CodeBlockLowlight.configure({ lowlight }),
  Placeholder.configure({
    placeholder: placeholder ?? "Start writing…",
  }),
];

// Dependencies to install:
// bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-image
//         @tiptap/extension-link @tiptap/extension-placeholder
//         @tiptap/extension-code-block-lowlight lowlight highlight.js
