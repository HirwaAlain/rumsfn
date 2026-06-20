"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import { ChartSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ComplianceOverviewItem } from "@/types";

interface Props { data: ComplianceOverviewItem[]; }

export function ComplianceDonut({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();

  if (!mounted) return <ChartSkeleton height={240} />;

  const total     = data.reduce((s, d) => s + d.value, 0);
  const compliant = data.find((d) => d.name === "Compliant")?.value ?? 0;
  const pct       = total > 0 ? Math.round((compliant / total) * 100) : 0;
  const axisColor = resolvedTheme === "dark" ? "#94A3B8" : "#64748B";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        Compliance Status Overview
      </h2>
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} />
            <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6">
          <span className="text-2xl font-bold tabular-nums text-foreground">{pct}%</span>
          <span className="text-xs text-muted-foreground">Compliant</span>
        </div>
      </div>
    </div>
  );
}
