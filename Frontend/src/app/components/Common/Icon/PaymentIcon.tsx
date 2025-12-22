type Props = { size?: number; bg?: string; fg?: string };

export default function PaymentIcon({ size = 22, bg = "#E30019", fg = "#fff" }: Props) {
  return (
    <svg viewBox="0 0 29 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="14.5215" cy="14" r="14" fill={bg} />
      <rect x="8.8" y="10.5" width="11.8" height="7.6" rx="1.4" fill="none" stroke={fg} strokeWidth="1.8" />
      <path d="M9.3 12.6h10.8" stroke={fg} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.4 16.5h3.2" stroke={fg} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
