"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { Header } from "@/components/layout/Header";
import { BreadCrumb } from "@/components/layout/BreadCrumb";
import { useSidebar } from "@/hooks/use-sidebar";
import type { NavItemConfig } from "@/components/layout/SidebarNavLink";

const LG_BREAKPOINT = 1024;

interface PortalShellProps {
  children: React.ReactNode;
  navItems: NavItemConfig[];
  roleLabel: string;
}

export function PortalShell({ children, navItems, roleLabel }: PortalShellProps) {
  const pathname = usePathname();
  const { collapsed, toggle, collapse } = useSidebar();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < LG_BREAKPOINT) collapse();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [collapse]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Mobile overlay (< lg) ──────────────────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 flex lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
              onClick={collapse}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 h-full"
            >
              <PortalSidebar
                navItems={navItems}
                collapsed={false}
                onToggle={collapse}
                roleLabel={roleLabel}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex">
        <PortalSidebar
          navItems={navItems}
          collapsed={collapsed}
          onToggle={toggle}
          roleLabel={roleLabel}
        />
      </div>

      {/* ── Content column ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto" id="main-content">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="p-4 sm:p-6"
          >
            <BreadCrumb />
            {children}
          </motion.div>
        </main>
      </div>

    </div>
  );
}
