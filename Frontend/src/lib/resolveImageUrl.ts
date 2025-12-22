const STATIC_BASE = process.env.NEXT_PUBLIC_STATIC_BASE ?? 'http://localhost:8000';

export function resolveImageUrl(url?: string | null) {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;

  // đảm bảo có dấu /
  return `${STATIC_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}
