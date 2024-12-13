import { Dispatch, SetStateAction } from "react";
import { Bold, Bot, Italic, List, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../../../../../convex/_generated/api";

import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/app/(protected)/_components/hint";
import { useMutation } from "@tanstack/react-query";
import { useConvexAction } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TiptapEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
}

export const TiptapEditor = ({
  content,
  setContent,
  readOnly = false,
}: TiptapEditorProps) => {
  const [generateConfirm, GenerateConfirmDialog] = useConfirm();

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "px-5 py-10 text-sm prose leading-normal [&_ul]:ml-4 [&_ul_ul]:mt-5 [&_ul_ul]:ml-0 dark:prose-invert dark:marker:text-white marker:text-black focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const { mutate: generateDescription, isPending: isGeneratingDescription } =
    useMutation({
      mutationFn: useConvexAction(api.issues.generateDescription),
    });

  /**
   * Handles the generation of a task description using the content from the editor.
   *
   * This function first checks if the editor instance is available. If it is, it prompts the user for confirmation
   * before proceeding to generate a description based on the current HTML content of the editor.
   * Upon successful generation, it updates the editor's content with the new description and displays a success toast.
   * If the generation fails, an error toast is displayed.
   *
   * @returns {Promise<void>} A promise that resolves when the description generation process is complete.
   */
  const handleGenerateDescription = async () => {
    if (!editor) return;
    if (readOnly) return;

    if (content === "<p></p>" || content === "") {
      toast.error("Please enter some content before generating a description");
      return;
    }

    const ok = await generateConfirm();
    if (!ok) return;

    generateDescription(
      { content: editor.getHTML() },
      {
        onSuccess: (data) => {
          if (data) {
            editor.commands.setContent(data);
            setContent(data);
            toast.success("Description generated");
          }
        },
        onError: () => {
          toast.error("Failed to generate description");
        },
      },
    );
  };

  if (!editor) return null;

  if (readOnly) {
    return (
      <ScrollArea className="h-[400px]">
        <EditorContent editor={editor} />
      </ScrollArea>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <div className="flex gap-2 border-b p-2">
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold")
                ? "rounded bg-gray-200 p-2 dark:bg-gray-800"
                : "p-2"
            }
            disabled={readOnly}
          >
            <Bold className="size-4" />
          </Button>
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic")
                ? "rounded bg-gray-200 p-2 dark:bg-gray-800"
                : "p-2"
            }
            disabled={readOnly}
          >
            <Italic className="size-4" />
          </Button>
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList")
                ? "rounded bg-gray-200 p-2 dark:bg-gray-800"
                : "p-2"
            }
            disabled={readOnly}
          >
            <List className="size-4" />
          </Button>
          <Hint content="Optimize your task description" side="bottom">
            <Button
              variant={"ghost"}
              type="button"
              onClick={handleGenerateDescription}
              disabled={
                isGeneratingDescription ||
                content === "<p></p>" ||
                content === "" ||
                readOnly
              }
            >
              <Bot className="size-4" />
            </Button>
          </Hint>
        </div>
        <ScrollArea className="h-[200px]">
          {isGeneratingDescription ? (
            <div className="flex h-[200px] animate-pulse items-center justify-center text-sm text-muted-foreground">
              <p>Optimizing your description...</p>
            </div>
          ) : (
            <EditorContent editor={editor} />
          )}
        </ScrollArea>
      </div>

      <GenerateConfirmDialog
        title="Generate Description"
        description="Are you sure you want to generate a description?"
      />
    </>
  );
};
