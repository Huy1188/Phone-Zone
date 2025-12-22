// src/lib/storage.ts

const isBrowser = typeof window !== "undefined";

export function getJson<T>(key: string, fallback: T | null = null): T | null {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`storage.getJson error for key=${key}`, error);
    return fallback;
  }
}

export function setJson<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`storage.setJson error for key=${key}`, error);
  }
}

export function remove(key: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`storage.remove error for key=${key}`, error);
  }
}
