// localStorage can be missing or throw (private mode, blocked site data); the shop must still work without it.
const PREFIX = 'backline:'

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Nothing to do: the state simply lives for this visit only.
  }
}
