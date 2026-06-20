"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "rums-sidebar-collapsed";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setCollapsed(JSON.parse(stored) as boolean);
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);

  const persist = (value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore — non-fatal
    }
  };

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
    persist(false);
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
    persist(true);
  }, []);

  return { collapsed, toggle, expand, collapse };
}
