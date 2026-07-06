import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateVedlagtDokumentasjon } from './validation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

describe('applications/SvarSed/VedlagtDokumentasjon/validation', () => {
  it("'Annet' selected but annetDokument empty: failed validation", () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateVedlagtDokumentasjon(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        doedsfall: {
          forhaandsdefinerteDokumenter: ['annet']
        }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-annetDokument']?.feilmelding).toEqual('validation:noAnnetDokument')
  })

  it('annetDokument over 255 chars: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateVedlagtDokumentasjon(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        doedsfall: {
          forhaandsdefinerteDokumenter: ['annet'],
          annetDokument: 'a'.repeat(256)
        }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-annetDokument']?.feilmelding).toEqual('validation:textOverX')
  })

  it('Valid form (no annet): success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateVedlagtDokumentasjon(validation, 'test-mock', {
      replySed: {
        sedType: 'H070',
        sedVersjon: '4.4',
        doedsfall: {
          forhaandsdefinerteDokumenter: ['dødsattest']
        }
      } as unknown as ReplySed
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
