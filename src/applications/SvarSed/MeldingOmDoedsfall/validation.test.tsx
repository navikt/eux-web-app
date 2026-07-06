import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateMeldingOmDoedsfall } from './validation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

describe('applications/SvarSed/MeldingOmDoedsfall/validation', () => {
  it('Empty form: failed validation (doedsdato + doedssted required)', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateMeldingOmDoedsfall(validation, 'test-mock', {
      replySed: { sedType: 'H070', sedVersjon: '4.4' } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-doedsdato']?.feilmelding).toEqual('validation:noDoedsdato')
    expect(validation['test-mock-doedssted-land']?.feilmelding).toEqual('validation:noAddressCountry')
    expect(validation['test-mock-doedssted-by']?.feilmelding).toEqual('validation:noAddressCity')
  })

  it('Invalid doedsdato format: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateMeldingOmDoedsfall(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        doedsfall: {
          doedsdato: 'notadate',
          doedssted: { by: 'Oslo', landkode: 'NOR' }
        }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-doedsdato']?.feilmelding).toEqual('validation:invalidDateFormat')
  })

  it('Valid form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateMeldingOmDoedsfall(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        doedsfall: {
          doedsdato: '2024-01-15',
          doedssted: { by: 'Oslo', landkode: 'NOR' }
        }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
