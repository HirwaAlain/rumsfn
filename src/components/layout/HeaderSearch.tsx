"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

export function HeaderSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={[
        "flex items-center gap-2.5 rounded-full border border-border bg-muted",
        "px-4 py-2 transition-all duration-200",
        "focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/10",
        "focus-within:bg-card",
        "w-56 sm:w-72 md:w-96",
      ].join(" ")}
      onClick={() => inputRef.current?.focus()}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />

      <input
        ref={inputRef}
        type="search"
        placeholder="Search anything…"
        aria-label="Search"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
    </div>
  );
}
