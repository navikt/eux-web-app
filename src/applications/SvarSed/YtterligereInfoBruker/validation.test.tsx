import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateYtterligereInfoBruker } from './validation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

describe('applications/SvarSed/YtterligereInfoBruker/validation', () => {
  it('Empty form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInfoBruker(validation, 'test-mock', {
      replySed: { sedType: 'H001', sedVersjon: '4.4', bruker: { personInfo: {} } } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })

  it('Additional information over 500 characters on bruker: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInfoBruker(validation, 'test-mock', {
      replySed: {
        sedType: 'H001',
        sedVersjon: '4.4',
        bruker: { personInfo: {}, ytterligereInfo: 'a'.repeat(501) }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-ytterligereInfo']?.feilmelding).toEqual('validation:textOverX')
  })

  it('Legacy root level ytterligereInfo is not validated', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInfoBruker(validation, 'test-mock', {
      replySed: {
        sedType: 'H001',
        sedVersjon: '4.4',
        bruker: { personInfo: {} },
        ytterligereInfo: 'a'.repeat(501)
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
  })

  it('Valid additional information on bruker: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInfoBruker(validation, 'test-mock', {
      replySed: {
        sedType: 'H001',
        sedVersjon: '4.4',
        bruker: { personInfo: {}, ytterligereInfo: 'a'.repeat(500) }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
  })

  it('H002: additional information over 500 characters on bruker: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInfoBruker(validation, 'test-mock', {
      replySed: {
        sedType: 'H002',
        sedVersjon: '4.4',
        bruker: { personInfo: {}, ytterligereInfo: 'a'.repeat(501) }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-ytterligereInfo']?.feilmelding).toEqual('validation:textOverX')
  })
})
