import { ComponentType } from 'react'

export interface MonthDay {
  /** 1–12 */
  month: number
  day: number
}

/**
 * Inclusive date range repeating every year. `to` may be earlier in the year than `from`
 * to wrap new year. For moveable feasts (e.g. Easter), use a function as season instead.
 */
export interface SeasonRange {
  from: MonthDay
  to: MonthDay
}

/**
 * A seasonal look for the frontpage.
 *
 * `className` is applied to the frontpage root and should only set `--seasonal-*`
 * CSS custom properties (see Forside.module.css for the supported ones), so that
 * normal mode stays completely untouched when no theme is active.
 * The optional slot components let a theme add its own decorations.
 */
export interface SeasonalTheme {
  id: string
  /** i18n key for the theme name, used in the on/off toggle, e.g. "julepynt" */
  nameKey: string
  /** When the theme is active in 'auto' mode */
  season: SeasonRange | ((date: Date) => boolean)
  className: string
  /** Rendered once as a non-interactive layer behind the page header, on all pages */
  HeaderDecorations?: ComponentType
  /** Rendered right after the "nEESSI" title in the page header */
  HeaderTitleDecoration?: ComponentType
  /** Absolutely positioned, non-interactive layer behind the frontpage hero (search area) */
  HeroDecorations?: ComponentType
  /** Rendered inside the logo wrapper, e.g. a glow or a hat */
  LogoDecoration?: ComponentType
  /** Rendered right below the logo */
  Greeting?: ComponentType
}

/**
 * 'auto' picks the theme whose season contains today's date,
 * 'off' disables seasonal themes, or force a theme by id.
 */
export type SeasonalThemeMode = 'auto' | 'off' | string
