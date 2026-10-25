# Book directions — Markdown editor with TypeScript

**Catalog #1149** · Peter O'Hanlon, *Advanced TypeScript Programming Projects* (Packt, 2019), **Chapter 2**

- Finished code: [PacktPublishing/Advanced-TypeScript-3-Programming-Projects/Chapter02](https://github.com/PacktPublishing/Advanced-TypeScript-3-Programming-Projects/tree/master/Chapter02)
- O'Reilly: [Creating a Markdown Editor with TypeScript](https://www.oreilly.com/library/view/advanced-typescript-programming/9781789133042/3593e33f-7490-47b6-b129-ab5e08aef1b0.xhtml)
- Local reference: [`reference/MarkdownParser.ts`](./reference/MarkdownParser.ts)
- Web parser module: [`web/src/lib/markdownParser.ts`](./web/src/lib/markdownParser.ts)

## What the book asks you to build

A **markdown editor** that converts plain text to HTML using a **custom parser** (not a third-party markdown library):

1. **TagType → HTML** mapping (`h1`–`h3`, `p`, `hr`).
2. **MarkdownDocument** accumulates HTML fragments.
3. **LineParser** detects line prefixes (`# `, `## `, `### `, `---`).
4. **Visitor** classes emit opening tag + content + closing tag.
5. **Chain of responsibility** tries handlers in order: H1 → H2 → H3 → HR → paragraph (fallback).
6. **HtmlHandler** wires a textarea to a preview (`keyup` → `ToHtml`).

## Supported markdown (book scope)

| Line starts with | HTML |
|------------------|------|
| `# ` | `<h1>` |
| `## ` | `<h2>` |
| `### ` | `<h3>` |
| `---` | `<hr>` |
| (anything else) | `<p>` |

## Web version (`web/` — Next.js, port **3009**)

| Book piece | Web equivalent |
|------------|----------------|
| `Markdown.ToHtml` | [`markdownToHtml()`](./web/src/lib/markdownParser.ts) |
| Textarea + label preview | Split-pane React UI ([`MarkdownEditorApp.tsx`](./web/src/components/MarkdownEditorApp.tsx)) |
| Bootstrap layout | Tailwind split panels + modern theme |
