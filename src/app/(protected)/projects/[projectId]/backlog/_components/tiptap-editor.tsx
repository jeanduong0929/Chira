import { Bold, Italic, List } from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "p-10 text-sm prose",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border">
      <div className="flex gap-2 border-b p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "rounded bg-gray-200 p-2" : "p-2"
          }
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "rounded bg-gray-200 p-2" : "p-2"
          }
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "rounded bg-gray-200 p-2" : "p-2"
          }
        >
          <List className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="marker:text-black" />
    </div>
  );
};
