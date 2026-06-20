"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import { ChartSkeleton } from "@/components/shared/LoadingSkeleton";
import type { LicenseTrendPoint } from "@/types";

const COLORS = {
  issued:  "#00C2CB",
  revoked: "#EF4444",
  expired: "#F59E0B",
} as const;

interface Props { data: LicenseTrendPoint[]; }

export function LicenseTrendChart({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();

  if (!mounted) return <ChartSkeleton height={240} />;

  const isDark    = resolvedTheme === "dark";
  const gridColor = isDark ? "#1E3A5F" : "#E2E8F0";
  const axisColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        License Activity — Last 6 Months
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: axisColor }}
            iconType="circle"
            iconSize={8}
          />
          <Line type="monotone" dataKey="issued"  stroke={COLORS.issued}  strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="revoked" stroke={COLORS.revoked} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="expired" stroke={COLORS.expired} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
