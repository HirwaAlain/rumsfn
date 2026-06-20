import { HeaderSearch } from "./HeaderSearch";
import { HeaderNotifications } from "./HeaderNotifications";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { ThemeToggle } from "./ThemeToggle";

// No "use client" needed here — interactivity lives in each sub-component.
export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-header-border bg-header px-4 sm:px-6">
      <HeaderSearch />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <HeaderNotifications />

        {/* Vertical rule between actions and user */}
        <div className="mx-2 h-5 w-px bg-border" aria-hidden="true" />

        <HeaderUserMenu />
      </div>
    </header>
  );
}
