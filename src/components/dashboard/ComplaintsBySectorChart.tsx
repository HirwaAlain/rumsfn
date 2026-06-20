"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import { ChartSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ComplaintsBySectorPoint } from "@/types";

const SECTOR_COLORS: Record<string, string> = {
  Telecom:   "#00C2CB",
  Energy:    "#F59E0B",
  Water:     "#3B82F6",
  Transport: "#10B981",
};

interface Props { data: ComplaintsBySectorPoint[]; }

export function ComplaintsBySectorChart({ data }: Props) {
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
        Complaints by Sector
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 72 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
          <YAxis dataKey="sector" type="category" tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} width={72} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((entry) => (
              <Cell key={entry.sector} fill={SECTOR_COLORS[entry.sector] ?? "#00C2CB"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
