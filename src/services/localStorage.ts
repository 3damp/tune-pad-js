export function getLocalStorage<T>(key: string, defaultValue: T): T {
  const storedValue = localStorage.getItem(key)
  if (storedValue) {
    try {
      return JSON.parse(storedValue) as T
    } catch (error) {
      console.error(`Error parsing localStorage value for key "${key}":`, error)
    }
  }
  return defaultValue
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage value for key "${key}":`, error)
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage value for key "${key}":`, error)
  }
}
