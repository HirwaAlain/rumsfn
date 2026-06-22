"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavLinkProps {
  item: NavItemConfig;
  isActive: boolean;
  collapsed: boolean;
}

export function SidebarNavLink({ item, isActive, collapsed }: SidebarNavLinkProps) {
  const { label, href, icon: Icon } = item;

  if (collapsed) {
    return (
      <Link
        href={href}
        title={label}
        aria-current={isActive ? "page" : undefined}
        className="flex items-center justify-center py-0.5"
      >
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150",
            isActive
              ? "bg-sidebar-active shadow-md shadow-purple/20 text-sidebar-fg-active"
              : "text-sidebar-fg hover:bg-sidebar-hover hover:text-accent"
          )}
        >
          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "transition-all duration-150",
        isActive
          ? "bg-sidebar-active text-sidebar-fg-active shadow-md shadow-purple/20"
          : "text-sidebar-fg hover:bg-sidebar-hover hover:text-accent"
      )}
    >
      <Icon
        className={cn("h-[18px] w-[18px] shrink-0 transition-colors")}
        aria-hidden="true"
      />

      <AnimatePresence initial={false}>
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.15 }}
          className="truncate"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </Link>
  );
}
