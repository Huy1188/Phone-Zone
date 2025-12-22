export function withQuery(path: string, query?: Record<string, any>) {
  if (!query) return path;
  const usp = new URLSearchParams();

  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((x) => usp.append(k, String(x)));
    else usp.set(k, String(v));
  });

  const qs = usp.toString();
  return qs ? `${path}?${qs}` : path;
}
