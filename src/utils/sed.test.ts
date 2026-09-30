import { usesTypedSedApi } from 'utils/sed'

describe('utils/sed', () => {
  describe('usesTypedSedApi', () => {
    it.each(['H001', 'H002', 'H003', 'H005', 'H006', 'H021', 'H065', 'H070', 'H120', 'U013', 'X002', 'X003', 'X004', 'X005', 'X006', 'X007'])(
      '%s uses the typed API', (sedType: string) => {
        expect(usesTypedSedApi(sedType)).toBe(true)
      })

    it.each(['F001', 'F002', 'F003', 'U002', 'S040', 'X001', 'X009', '', undefined, null])(
      '%s uses the legacy API', (sedType: string | null | undefined) => {
        expect(usesTypedSedApi(sedType)).toBe(false)
      })
  })
})
