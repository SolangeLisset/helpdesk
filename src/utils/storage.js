export function readJsonStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
