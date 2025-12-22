type Props = { size?: number; bg?: string; fg?: string };

export default function SuccessIcon({ size = 22, bg = "#E30019", fg = "#fff" }: Props) {
  return (
    <svg viewBox="0 0 29 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="14.5215" cy="14" r="14" fill={bg} />
      <path
        d="M9.8 14.2l2.6 2.7 6.9-7.2"
        fill="none"
        stroke={fg}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
