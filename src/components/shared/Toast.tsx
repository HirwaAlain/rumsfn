"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; type: ToastType; message: string }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts]   = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const counter = useRef(0);

  useEffect(() => setMounted(true), []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && createPortal(
        <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2 pointer-events-none">
          <AnimatePresence mode="popLayout">
            {toasts.map(({ id, type, message }) => (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xl",
                  type === "success" && "border-success/40",
                  type === "error"   && "border-danger/40",
                  type === "info"    && "border-accent/40",
                )}
              >
                {type === "success" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
                {type === "error"   && <AlertCircle   className="mt-0.5 h-5 w-5 shrink-0 text-danger" />}
                {type === "info"    && <Info           className="mt-0.5 h-5 w-5 shrink-0 text-accent" />}
                <p className="flex-1 text-sm text-foreground leading-relaxed">{message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(id)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
