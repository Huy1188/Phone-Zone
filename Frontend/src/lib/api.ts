// src/lib/api.ts
type ApiInit = RequestInit & { cache?: RequestCache };

function getApiBase() {
  if (typeof window === "undefined") {
    return process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "";
  }
  return process.env.NEXT_PUBLIC_API_BASE ?? "";
}

export async function api<T>(path: string, init: ApiInit = {}): Promise<T> {
  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  // clone headers để tránh bị ghi đè
  const headers = new Headers(init.headers || {});
  let body = init.body;

  // ✅ Nếu body là object -> stringify JSON
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    ...init,
    body,
    headers,
    credentials: "include", // ✅ session-cookie
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      typeof data === "object" && data?.message ? data.message : `API error: ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}
