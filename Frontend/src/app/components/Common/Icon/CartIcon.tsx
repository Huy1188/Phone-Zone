type Props = { size?: number; bg?: string; fg?: string };

export default function CartIcon({ size = 22, bg = "#E30019", fg = "#fff" }: Props) {
  return (
    <svg viewBox="0 0 29 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="14.5215" cy="14" r="14" fill={bg} />
      <path
        d="M9.3 10.2h2l.7 6.3c.05.5.47.9.98.9h6.2c.49 0 .91-.34.98-.82l.6-3.9H12"
        fill="none"
        stroke={fg}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13.2" cy="19.2" r="1" fill={fg} />
      <circle cx="18.1" cy="19.2" r="1" fill={fg} />
    </svg>
  );
}
