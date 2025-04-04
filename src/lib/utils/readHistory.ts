const STORAGE_KEY = "read_board_ids";

export const markAsRead = (id: number) => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (!stored.includes(id)) {
    stored.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
};

export const isRead = (id: number): boolean => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return stored.includes(id);
};
