// src/lib/utils/uuid.ts
export function getOrCreateAnonymousUUID(): string {
  if (typeof window === "undefined") {
    return ""; // SSR에서는 빈 문자열 또는 null 반환
  }

  const KEY = "anonymous-client-uuid";
  let uuid = localStorage.getItem(KEY);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(KEY, uuid);
  }
  return uuid;
}
