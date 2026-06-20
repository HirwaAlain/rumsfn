interface RumsLogoIconProps {
  className?: string;
}

// Checkerboard border squares: 3×3 each on a 4-unit grid, (i+j) even, outside inner square (9–23)
const BORDER_SQUARES: [number, number][] = [
  [0, 0], [8, 0], [16, 0], [24, 0],
  [4, 4], [12, 4], [20, 4], [28, 4],
  [0, 8], [24, 8],
  [4, 12], [28, 12],
  [0, 16], [24, 16],
  [4, 20], [28, 20],
  [0, 24], [8, 24], [16, 24], [24, 24],
  [4, 28], [12, 28], [20, 28], [28, 28],
];

const GOLD   = "#C9A553";
const R_INK  = "#0D1B2A";

export function RumsLogoIcon({ className }: RumsLogoIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {BORDER_SQUARES.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={3} height={3} fill={GOLD} />
      ))}
      <rect x={9} y={9} width={14} height={14} fill={GOLD} rx={1} />
      <text
        x={16}
        y={16}
        fontFamily="'Inter', 'Helvetica Neue', sans-serif"
        fontWeight="700"
        fontSize={10}
        textAnchor="middle"
        dominantBaseline="central"
        fill={R_INK}
      >
        R
      </text>
    </svg>
  );
}
