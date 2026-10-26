"use client";

export function HelpJumpButton() {
  return (
    <button
      type="button"
      className="help-jump-btn"
      onClick={() =>
        document.getElementById("help-heading")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    >
      Help
    </button>
  );
}
