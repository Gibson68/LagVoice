import { useState, useEffect } from 'react'

/**
 * Shared dark mode hook.
 * Reads from localStorage, syncs across tabs via storage events,
 * and toggles the `dark` class on <html>.
 */
export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('lagvoice_dark') === 'true' } catch { return false }
  })

  // Sync from localStorage (other tabs / layout toggle)
  useEffect(() => {
    const check = () => {
      try { setDark(localStorage.getItem('lagvoice_dark') === 'true') } catch {}
    }
    window.addEventListener('storage', check)
    const interval = setInterval(check, 500)
    return () => { window.removeEventListener('storage', check); clearInterval(interval) }
  }, [])

  // Keep <html class="dark"> in sync
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return dark
}

/**
 * Toggle dark mode and persist to localStorage.
 * Returns [dark, toggle].
 */
export function useDarkModeToggle() {
  const dark = useDarkMode()

  const toggle = () => {
    const next = !dark
    try { localStorage.setItem('lagvoice_dark', String(next)) } catch {}
    setDark(next)
  }

  return [dark, toggle]
}
