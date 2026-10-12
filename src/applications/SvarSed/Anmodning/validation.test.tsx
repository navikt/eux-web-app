import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateAnmodning } from './validation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

const getReplySed = (anmodning: object | undefined): ReplySed => ({
  sedType: 'H001',
  sedVersjon: '4.4',
  bruker: { personInfo: {}, anmodning }
} as unknown as ReplySed)

describe('applications/SvarSed/Anmodning/validation', () => {
  it('Empty form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateAnmodning(validation, 'test-mock', { replySed: getReplySed(undefined) })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })

  it('Valid form at bruker.anmodning.dokumentasjon: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateAnmodning(validation, 'test-mock', {
      replySed: getReplySed({
        dokumentasjon: { informasjon: 'a'.repeat(255), dokument: 'a'.repeat(255), sed: 'a'.repeat(65) }
      })
    })
    expect(hasErrors).toBeFalsy()
  })

  it('Too long texts at bruker.anmodning.dokumentasjon: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateAnmodning(validation, 'test-mock', {
      replySed: getReplySed({
        dokumentasjon: { informasjon: 'a'.repeat(256), dokument: 'a'.repeat(256), sed: 'a'.repeat(66) }
      })
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-informasjon']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-dokument']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-sed']?.feilmelding).toEqual('validation:textOverX')
  })

  it('Legacy root level anmodning is not validated', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateAnmodning(validation, 'test-mock', {
      replySed: {
        sedType: 'H001',
        sedVersjon: '4.4',
        bruker: { personInfo: {} },
        anmodning: { dokumentasjon: { informasjon: 'a'.repeat(256) } }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
  })
})
