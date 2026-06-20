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

const LABEL_VARIANTS = {
  visible: { opacity: 1, transition: { duration: 0.15, delay: 0.05 } },
  hidden:  { opacity: 0, transition: { duration: 0.1  } },
};

export function SidebarNavLink({ item, isActive, collapsed }: SidebarNavLinkProps) {
  const { label, href, icon: Icon } = item;

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium",
        "transition-colors duration-150",
        collapsed ? "justify-center px-0" : "px-3",
        isActive
          ? "bg-sidebar-active text-sidebar-fg-active"
          : "text-sidebar-fg hover:bg-sidebar-hover hover:text-white"
      )}
    >
      {/* Left active bar */}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-teal"
        />
      )}

      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            variants={LABEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
