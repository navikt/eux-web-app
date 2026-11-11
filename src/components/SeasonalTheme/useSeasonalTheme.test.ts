import { act, renderHook } from '@testing-library/react'
import { resolveSeasonalTheme, useSeasonalTheme } from './useSeasonalTheme'
import { SeasonalTheme } from './types'

const theme = (id: string, season: SeasonalTheme['season']): SeasonalTheme => ({ id, nameKey: id, className: id, season })

const halloween = theme('halloween', { from: { month: 10, day: 25 }, to: { month: 10, day: 31 } })
const christmas = theme('christmas', { from: { month: 12, day: 1 }, to: { month: 1, day: 6 } })
const easter2027 = theme('easter', (date: Date) => date.getFullYear() === 2027 && date.getMonth() === 2 && date.getDate() === 28)
const themes = [halloween, christmas, easter2027]

describe('resolveSeasonalTheme', () => {
  it('picks the theme in season, including seasons wrapping new year', () => {
    expect(resolveSeasonalTheme('auto', new Date(2026, 9, 31), themes)).toBe(halloween)
    expect(resolveSeasonalTheme('auto', new Date(2026, 11, 1), themes)).toBe(christmas)
    expect(resolveSeasonalTheme('auto', new Date(2027, 0, 6), themes)).toBe(christmas)
    expect(resolveSeasonalTheme('auto', new Date(2027, 2, 28), themes)).toBe(easter2027)
  })

  it('returns nothing out of season', () => {
    expect(resolveSeasonalTheme('auto', new Date(2026, 10, 30), themes)).toBeUndefined()
    expect(resolveSeasonalTheme('auto', new Date(2027, 0, 7), themes)).toBeUndefined()
  })

  it('respects off and forced modes', () => {
    expect(resolveSeasonalTheme('off', new Date(2026, 11, 24), themes)).toBeUndefined()
    expect(resolveSeasonalTheme('christmas', new Date(2026, 6, 1), themes)).toBe(christmas)
    expect(resolveSeasonalTheme('unknown', new Date(2026, 11, 24), themes)).toBeUndefined()
  })
})

describe('useSeasonalTheme', () => {
  afterEach(() => {
    window.localStorage.clear()
    // clears the in-memory preview
    window.history.replaceState(null, '', '/?sesongtema=auto')
    renderHook(() => useSeasonalTheme())
    window.history.replaceState(null, '', '/')
  })

  it('shares the on/off choice between components (header and frontpage) and remembers it', () => {
    window.history.replaceState(null, '', '/?sesongtema=christmas')
    const header = renderHook(() => useSeasonalTheme())
    const frontpage = renderHook(() => useSeasonalTheme())
    expect(header.result.current.activeTheme?.id).toBe('christmas')

    act(() => frontpage.result.current.setEnabled(false))
    expect(header.result.current.activeTheme).toBeUndefined()
    expect(frontpage.result.current.theme?.id).toBe('christmas')

    // the preview from the URL survives navigation, the choice survives reloads
    window.history.replaceState(null, '', '/vedlegg')
    const otherPage = renderHook(() => useSeasonalTheme())
    expect(otherPage.result.current.theme?.id).toBe('christmas')
    expect(otherPage.result.current.enabled).toBe(false)
  })

  it('shows no theme out of season when no preview is given in the URL', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 11))
    const { result } = renderHook(() => useSeasonalTheme())
    expect(result.current.activeTheme).toBeUndefined()
    jest.useRealTimers()
  })
})
