import christmas from './christmas/christmas'
import { SeasonalTheme, SeasonalThemeMode } from './types'

/**
 * Global switch for seasonal themes.
 * 'auto' = follow the calendar, 'off' = always normal mode, or a theme id to force it.
 * Can be overridden per browser for previewing with the URL param `?sesongtema=<id|off|auto>`.
 */
export const SEASONAL_THEME_MODE: SeasonalThemeMode = 'auto'

/**
 * All available seasonal themes. To add a new one (Halloween, Easter, …), create a folder
 * next to `christmas/` with its theme definition and add it here. If seasons overlap,
 * the first match wins, so put the more specific (shorter) seasons first.
 */
export const SEASONAL_THEMES: Array<SeasonalTheme> = [
  christmas
]
