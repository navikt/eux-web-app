
import { Validation } from 'declarations/types'
import { useTranslation } from 'react-i18next'
import { validateKontoopplysning } from './validation'

describe('applications/SvarSed/Formaal/Kontoopplysning/validation', () => {
  const { t } = useTranslation()

  it('Empty form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '', id: '', navn: ''
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-begrunnelse']?.feilmelding).toEqual('validation:noBegrunnelseTil')
    expect(validation['test-mock-id']?.feilmelding).toEqual('validation:noInstitusjonensIdTil')
    expect(validation['test-mock-navn']?.feilmelding).toEqual('validation:noInstitusjonensNavnTil')
    expect(validation['test-mock-kontotype']?.feilmelding).toEqual('validation:noKontotype')
    expect(validation.test?.feilmelding).toEqual('notnull')
    expect(validation['test-mock']?.feilmelding).toEqual('notnull')
  })

  it('invalid form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '123',
        id: '123@abc',
        navn: '123@abc',
        kontoOrdinaer: {
          bankensNavn: '123@abc',
          kontonummer: '123@abc',
          swift: '123@abc',
          adresse: {
            land: '123@abc', region: '123@abc', by: '123@abc', bygning: '123@abc', postnummer: '123@abc', gate: '123@abc', type: 'annet'
          }
        }
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-begrunnelse']?.feilmelding).toEqual('validation:textOver500Til')
    expect(validation.test?.feilmelding).toEqual('notnull')
    expect(validation['test-mock']?.feilmelding).toEqual('notnull')
  })

  it('valid form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: 'begrunnelse',
        id: 'id',
        navn: 'navn',
        kontoOrdinaer: {
          bankensNavn: 'bankensNavn',
          kontonummer: '123',
          swift: '123',
          adresse: {
            land: 'NO', region: 'region', by: 'by', bygning: 'bygning', postnummer: '123', gate: 'gate', type: 'bosted'
          }
        }
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
