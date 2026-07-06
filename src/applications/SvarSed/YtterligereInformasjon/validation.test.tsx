import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateYtterligereInformasjon } from './validation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

describe('applications/SvarSed/YtterligereInformasjon/validation', () => {
  it('Text over 500 chars: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInformasjon(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        ytterligereInfo: 'a'.repeat(501)
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-ytterligereInfo']?.feilmelding).toEqual('validation:textOverX')
  })

  it('Empty form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInformasjon(validation, 'test-mock', {
      replySed: { sedType: 'H070', sedVersjon: '4.4' } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })

  it('Valid text: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateYtterligereInformasjon(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        ytterligereInfo: 'Ytterligere informasjon om dødsfallet'
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
