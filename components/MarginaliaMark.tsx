export function MarginaliaMark({ color = "#B5482A" }: { color?: string }) {
  return (
    <svg
      width="18"
      height="34"
      viewBox="0 0 18 34"
      className="absolute -left-0.5 top-2 pointer-events-none"
      aria-hidden="true"
    >
      <path
        d="M14 2 C 6 4, 4 10, 5 17 C 6 24, 6 28, 14 32"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
