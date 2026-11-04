// localStorage can be missing or throw (private mode, blocked site data); the shop must still work without it.
const PREFIX = 'backline:'

/** Reads a saved value. The shape is not checked here: callers validate what they get back. */
export function load(key: string, fallback: unknown): unknown {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : (JSON.parse(raw) as unknown)
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Nothing to do: the state simply lives for this visit only.
  }
}
