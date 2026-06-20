"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

export function HeaderSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    // focus-within drives the ring purely in CSS — no useState needed.
    <div
      className={[
        "flex items-center gap-2 rounded-lg border border-border bg-input",
        "px-3 py-1.5 transition-colors",
        "focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20",
        "w-48 sm:w-64",
      ].join(" ")}
      // Clicking anywhere in the wrapper focuses the input
      onClick={() => inputRef.current?.focus()}
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />

      <input
        ref={inputRef}
        type="search"
        placeholder="Search…"
        aria-label="Search"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />

      {/* Keyboard shortcut hint — hidden while input is focused (focus-within hides border shift) */}
      <kbd
        aria-hidden="true"
        className="hidden shrink-0 items-center rounded border border-border px-1 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex"
      >
        /
      </kbd>
    </div>
  );
}
