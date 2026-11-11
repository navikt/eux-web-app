import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { SEASONAL_THEME_MODE, SEASONAL_THEMES } from './themes'
import { MonthDay, SeasonalTheme, SeasonalThemeMode } from './types'

const SEASONAL_THEME_URL_PARAM = 'sesongtema'

const storageKey = (id: string): string => `seasonalTheme.${id}.disabled`

const toNumber = ({ month, day }: MonthDay): number => month * 100 + day

const isInSeason = (theme: SeasonalTheme, date: Date): boolean => {
  if (typeof theme.season === 'function') {
    return theme.season(date)
  }
  const today = toNumber({ month: date.getMonth() + 1, day: date.getDate() })
  const from = toNumber(theme.season.from)
  const to = toNumber(theme.season.to)
  return from <= to
    ? today >= from && today <= to
    : today >= from || today <= to
}

export const resolveSeasonalTheme = (
  mode: SeasonalThemeMode,
  date: Date,
  themes: Array<SeasonalTheme> = SEASONAL_THEMES
): SeasonalTheme | undefined => {
  if (mode === 'off') {
    return undefined
  }
  if (mode === 'auto') {
    return themes.find(theme => isInSeason(theme, date))
  }
  return themes.find(theme => theme.id === mode)
}

// A mode given in the URL is kept in memory, so a preview survives navigation within the app,
// while a reload without the param goes back to the configured mode
let previewMode: string | undefined

const getMode = (): SeasonalThemeMode => {
  const fromUrl = new URLSearchParams(window.location.search).get(SEASONAL_THEME_URL_PARAM)
  if (fromUrl) {
    previewMode = fromUrl === 'auto' ? undefined : fromUrl
  }
  return previewMode ?? SEASONAL_THEME_MODE
}

// The user's on/off choice is shared by all components using the hook (header, frontpage, …)
const listeners = new Set<() => void>()
const fallbackStorage = new Map<string, boolean>()

const isDisabledByUser = (id: string): boolean => {
  try {
    return window.localStorage.getItem(storageKey(id)) === 'true'
  } catch {
    return fallbackStorage.get(id) ?? false
  }
}

const setDisabledByUser = (id: string, disabled: boolean): void => {
  try {
    if (disabled) {
      window.localStorage.setItem(storageKey(id), 'true')
    } else {
      window.localStorage.removeItem(storageKey(id))
    }
  } catch {
    fallbackStorage.set(id, disabled)
  }
  listeners.forEach(listener => listener())
}

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener)
  // keeps other browser tabs in sync
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export interface UseSeasonalTheme {
  /** The theme in season (or forced), regardless of the user's preference */
  theme: SeasonalTheme | undefined
  /** The theme to render, undefined when out of season or switched off by the user */
  activeTheme: SeasonalTheme | undefined
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

export const useSeasonalTheme = (): UseSeasonalTheme => {
  const theme = useMemo(() => resolveSeasonalTheme(getMode(), new Date()), [])
  const enabled = useSyncExternalStore(subscribe, () => !!theme && !isDisabledByUser(theme.id))

  const setEnabled = useCallback((value: boolean) => {
    if (theme) setDisabledByUser(theme.id, !value)
  }, [theme])

  return {
    theme,
    activeTheme: enabled ? theme : undefined,
    enabled,
    setEnabled
  }
}
