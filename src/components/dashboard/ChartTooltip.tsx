interface PayloadItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
  valueFormatter?: (value: number) => string;
}

export function ChartTooltip({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
      {label && (
        <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            {/* color dot comes from recharts runtime data — must be inline */}
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground capitalize">{item.name}:</span>
            <span className="ml-auto pl-3 font-semibold text-foreground">
              {valueFormatter ? valueFormatter(item.value) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
