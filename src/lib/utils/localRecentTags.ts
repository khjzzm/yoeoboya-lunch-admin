const STORAGE_KEY = "recent_hashtags";
const MAX_RECENT = 10;

export function addRecentHashtag(tag: string) {
  const existing = getRecentHashtags();
  const newList = [tag, ...existing.filter((t) => t !== tag)];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList.slice(0, MAX_RECENT)));
}

export function getRecentHashtags(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const removeRecentHashtag = (tag: string): void => {
  const current = getRecentHashtags();
  const updated = current.filter((t) => t !== tag);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export function clearRecentHashtags() {
  localStorage.removeItem(STORAGE_KEY);
}
