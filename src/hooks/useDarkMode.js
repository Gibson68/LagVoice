/**
 * useDarkMode — the single owner of the app's colour scheme.
 *
 * One module-level store keeps every consumer in sync, so toggling from the
 * header updates the sidebar, the page and every other mounted screen in the
 * same paint. Consumers subscribe with useSyncExternalStore; the value is also
 * mirrored onto <html class="dark"> for the CSS token overrides in index.css.
 */
import { useCallback, useSyncExternalStore } from 'react'
import { readRaw, writeRaw, STORAGE_KEYS } from '../utils/storage'

function readInitialTheme() {
  if (typeof document === 'undefined') return false
  const stored = readRaw(STORAGE_KEYS.theme, null)
  if (stored === 'true') return true
  if (stored === 'false') return false
  // Nothing saved yet: follow the operating system.
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  } catch {
    return false
  }
}

let current = readInitialTheme()
const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return current
}

function getServerSnapshot() {
  return false
}

/** Mirror the theme onto the document so CSS and the browser UI agree. */
function applyTheme(dark) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#0f172a' : '#1266f1')
}

function setTheme(next, { persist = true } = {}) {
  if (next === current) return
  current = next
  if (persist) writeRaw(STORAGE_KEYS.theme, String(next))
  applyTheme(next)
  listeners.forEach((listener) => listener())
}

// Apply immediately at module load so the first render already matches storage.
applyTheme(current)

// Keep tabs in step with each other.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.theme && event.newValue !== null) {
      setTheme(event.newValue === 'true', { persist: false })
    }
  })
}

/** Current colour scheme as a boolean. */
export function useDarkMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** `[dark, toggle]` for components that own the control. */
export function useDarkModeToggle() {
  const dark = useDarkMode()
  const toggle = useCallback(() => setTheme(!current), [])
  return [dark, toggle]
}

export function setDarkMode(next) {
  setTheme(Boolean(next))
}
