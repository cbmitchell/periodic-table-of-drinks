import { useState } from 'react'

export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    try {
      sessionStorage.setItem(key, JSON.stringify(newValue))
    } catch {
      // ignore storage errors (e.g. private browsing, quota exceeded)
    }
  }

  return [value, setStoredValue]
}
