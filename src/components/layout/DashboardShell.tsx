"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BreadCrumb } from "@/components/layout/BreadCrumb";
import { useSidebar } from "@/hooks/use-sidebar";

// Sidebar switches to overlay mode below this width (Tailwind's `lg` breakpoint)
const LG_BREAKPOINT = 1024;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { collapsed, toggle, collapse } = useSidebar();

  // Auto-collapse when viewport drops below lg; never auto-expand.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < LG_BREAKPOINT) collapse();
    };
    onResize(); // run once on mount to handle initial mobile load
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
            {/* Backdrop — click to close */}
            <div
              className="absolute inset-0 bg-purple-dark/60 backdrop-blur-sm"
              onClick={collapse}
              aria-hidden="true"
            />
            {/* Sidebar panel slides in from left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 h-full"
            >
              <Sidebar collapsed={false} onToggle={collapse} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar — in flow (≥ lg) ──────────────────────────────── */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} onToggle={toggle} />
      </div>

      {/* ── Content column ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto" id="main-content">
          {/*
            key={pathname} causes Framer Motion to remount on each navigation,
            replaying the enter animation. No exit animation needed — the page
            unmounts before the new one mounts, so the fade-in is sufficient.
          */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="p-5 sm:p-7"
          >
            <BreadCrumb />
            {children}
          </motion.div>
        </main>
      </div>

    </div>
  );
}
