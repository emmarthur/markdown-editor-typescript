"use client";

import { useMemo, useState } from "react";
import { markdownToHtml } from "@/lib/markdownParser";
import { DemoHelpSection } from "@/components/DemoHelpSection";
import { HelpJumpButton } from "@/components/HelpJumpButton";

const STARTER = `# Welcome

## What you can write

### Supported syntax

Use \`# \`, \`## \`, or \`### \` at the start of a line for headings.

---

Everything else becomes a paragraph. Edit this text and watch the preview update live.
`;

export function MarkdownEditorApp() {
  const [source, setSource] = useState(STARTER);

  const html = useMemo(() => markdownToHtml(source), [source]);

  return (
    <div className="md-shell">
      <div className="md-blob md-blob-a" aria-hidden="true" />
      <div className="md-blob md-blob-b" aria-hidden="true" />

      <header className="md-hero">
        <div className="md-hero-icon" aria-hidden="true">
          ✎
        </div>
        <h1 className="md-title">Markdown Editor</h1>
        <p className="md-tagline">Type on the left — HTML preview on the right</p>
        <HelpJumpButton />
      </header>

      <div className="md-panels">
        <section className="md-panel" aria-label="Markdown source">
          <div className="md-panel-head">
            <span>Markdown</span>
            <button
              type="button"
              className="md-btn-ghost"
              onClick={() => setSource(STARTER)}
            >
              Reset sample
            </button>
          </div>
          <textarea
            className="md-textarea"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={true}
            aria-label="Markdown input"
          />
        </section>

        <section className="md-panel" aria-label="HTML preview">
          <div className="md-panel-head">
            <span>Preview</span>
          </div>
          <div
            className="md-preview"
            dangerouslySetInnerHTML={{
              __html: html || "<p class=\"md-empty\">Start typing to see HTML…</p>",
            }}
          />
        </section>
      </div>

      <DemoHelpSection />
    </div>
  );
}
