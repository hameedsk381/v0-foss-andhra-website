"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import BubbleMenuExtension from "@tiptap/extension-bubble-menu"
import FloatingMenuExtension from "@tiptap/extension-floating-menu"
import { Button } from "./button"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Minus,
} from "lucide-react"
import { useCallback, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import TurndownService from "turndown"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  outputFormat?: "html" | "markdown"
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing...", className, outputFormat = "markdown" }: RichTextEditorProps) {
  // Create turndown service for HTML to Markdown conversion
  const turndownService = useMemo(() => {
    const service = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    })

    // Add custom rules for better conversion
    service.addRule("strikethrough", {
      filter: ["del", "s"] as any,
      replacement: function (content) {
        return "~~" + content + "~~"
      },
    })

    service.addRule("preformattedCode", {
      filter: function (node) {
        return node.nodeName === "PRE" && !!(node as Element).querySelector("code")
      },
      replacement: function (_content, node) {
        const codeNode = (node as Element).querySelector("code")
        const code = codeNode ? codeNode.textContent || "" : ""
        return "\n```\n" + code.trim() + "\n```\n"
      },
    })

    return service
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline decoration-primary underline-offset-4",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg border shadow-sm my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      BubbleMenuExtension,
      FloatingMenuExtension,
    ] as any,
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-zinc dark:prose-invert max-w-none min-h-[400px] p-6 focus:outline-none",
          "prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
          "prose-p:leading-7 prose-li:my-0.5",
          "prose-img:rounded-lg prose-img:shadow-md"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (outputFormat === "markdown") {
        onChange(turndownService.turndown(html))
      } else {
        onChange(html)
      }
    },
  })

  // Safe reference for editor after null check to bypass Tiptap's complex/conflicting types
  const e = editor as any

  // Update editor content when prop changes
  useEffect(() => {
    if (e && content !== e.getHTML()) {
      e.commands.setContent(content)
    }
  }, [content, e])

  const setLink = useCallback(() => {
    if (!e) return

    const previousUrl = e.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) return

    if (url === "") {
      e.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    e.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [e])

  const addImage = useCallback(() => {
    if (!e) return

    const url = window.prompt("Image URL")

    if (url) {
      e.chain().focus().setImage({ src: url }).run()
    }
  }, [e])

  if (!editor) {
    return null
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-background shadow-sm ${className}`}>
      {/* Floating Menu (Triggered on empty line) */}
      {e && (
        <FloatingMenu editor={e} options={{ duration: 100 } as any} className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-lg">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()}
            className={e.isActive("heading", { level: 1 }) ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()}
            className={e.isActive("heading", { level: 2 }) ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleBulletList().run()}
            className={e.isActive("bulletList") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleOrderedList().run()}
            className={e.isActive("orderedList") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button type="button" variant="ghost" size="sm" onClick={addImage} className="text-muted-foreground hover:text-foreground">
            <ImageIcon className="h-4 w-4" />
          </Button>
        </FloatingMenu>
      )}

      {/* Bubble Menu (Triggered on text selection) */}
      {e && (
        <BubbleMenu editor={e} options={{ duration: 100 } as any} className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-lg">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleBold().run()}
            className={e.isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleItalic().run()}
            className={e.isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleStrike().run()}
            className={e.isActive("strike") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleHighlight().run()}
            className={e.isActive("highlight") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => e.chain().focus().toggleCode().run()}
            className={e.isActive("code") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Code className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={e.isActive("link") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      {/* Main Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleBold().run()}
          className={e.isActive("bold") ? "bg-background shadow-sm" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleItalic().run()}
          className={e.isActive("italic") ? "bg-background shadow-sm" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleUnderline().run()}
          className={e.isActive("underline") ? "bg-background shadow-sm" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleStrike().run()}
          className={e.isActive("strike") ? "bg-background shadow-sm" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()}
          className={e.isActive("heading", { level: 1 }) ? "bg-background shadow-sm" : ""}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()}
          className={e.isActive("heading", { level: 2 }) ? "bg-background shadow-sm" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()}
          className={e.isActive("heading", { level: 3 }) ? "bg-background shadow-sm" : ""}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleBulletList().run()}
          className={e.isActive("bulletList") ? "bg-background shadow-sm" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleOrderedList().run()}
          className={e.isActive("orderedList") ? "bg-background shadow-sm" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().toggleBlockquote().run()}
          className={e.isActive("blockquote") ? "bg-background shadow-sm" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().setTextAlign("left").run()}
          className={e.isActive({ textAlign: "left" }) ? "bg-background shadow-sm" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().setTextAlign("center").run()}
          className={e.isActive({ textAlign: "center" }) ? "bg-background shadow-sm" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().setTextAlign("right").run()}
          className={e.isActive({ textAlign: "right" }) ? "bg-background shadow-sm" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().setTextAlign("justify").run()}
          className={e.isActive({ textAlign: "justify" }) ? "bg-background shadow-sm" : ""}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={e.isActive("link") ? "bg-background shadow-sm" : ""}
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().undo().run()}
          disabled={!e.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => e.chain().focus().redo().run()}
          disabled={!e.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={e} />
    </div>
  )
}
