import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPIData } from "@/types";

const ICON_VARIANTS = {
  default: "bg-accent/10 text-accent",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger:  "bg-danger-bg text-danger",
} as const;

type IconVariant = keyof typeof ICON_VARIANTS;

interface KPICardProps {
  data: KPIData;
  icon?: React.ElementType;
  iconVariant?: IconVariant;
}

export function KPICard({ data, icon: Icon, iconVariant = "default" }: KPICardProps) {
  const { label, value, delta, deltaLabel, trend } = data;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{value}</p>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              ICON_VARIANTS[iconVariant]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {trend === "up"      && <TrendingUp   className="h-3.5 w-3.5 text-success" />}
        {trend === "down"    && <TrendingDown  className="h-3.5 w-3.5 text-danger"  />}
        {trend === "neutral" && <Minus         className="h-3.5 w-3.5 text-muted-foreground" />}
        <span
          className={cn(
            "font-medium",
            trend === "up"      && "text-success",
            trend === "down"    && "text-danger",
            trend === "neutral" && "text-muted-foreground"
          )}
        >
          {delta > 0 ? "+" : ""}{delta}{delta !== 0 ? "%" : ""}
        </span>
        <span className="text-muted-foreground">{deltaLabel}</span>
      </div>
    </div>
  );
}
