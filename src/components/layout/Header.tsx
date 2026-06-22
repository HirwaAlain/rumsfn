import { HeaderSearch } from "./HeaderSearch";
import { HeaderNotifications } from "./HeaderNotifications";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between gap-4 bg-header px-4 sm:px-6"
      style={{ boxShadow: "0 1px 0 var(--border), 0 4px 16px rgba(123,63,228,0.05)" }}
    >
      <HeaderSearch />

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <HeaderNotifications />
        <div className="mx-1.5 h-5 w-px bg-border" aria-hidden="true" />
        <HeaderUserMenu />
      </div>
    </header>
  );
}
