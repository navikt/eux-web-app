
import { Validation } from 'declarations/types'
import { useTranslation } from 'react-i18next'
import { validateKontoopplysning } from './validation'

describe('applications/SvarSed/Kontoopplysning/validation', () => {
  const { t } = useTranslation()
  /*
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
    expect(validation['test-mock-kontotype']?.feilmelding).toEqual('validation:noKontotypeTil')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
  })

  it('invalid form: failed validation - too big begrunnelse', () => {
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
    expect(validation['test-mock-begrunnelse']?.feilmelding).toEqual('validation:textOverXTil')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
  })

  it('invalid form: invalid kontoOrdinaer swift', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '123',
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
    expect(validation['test-mock-kontoOrdinaer-swift']?.feilmelding).toEqual('validation:invalidSwiftTil')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
  })

  it('invalid form: invalid kontoSepa IBAN', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '123',
        id: '123@abc',
        navn: '123@abc',
        kontoSepa: {
          iban: 'NO123',
          swift: 'ABCDEFGH',
        }
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-kontoSepa-iban']?.feilmelding).toEqual('validation:invalidIbanTil')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
  })
*/
  it('invalid form: invalid kontoSepa swift', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '123',
        id: '123@abc',
        navn: '123@abc',
        kontoSepa: {
          iban: 'NO123456789101112',
          swift: 'ABC'
        }
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-kontoSepa-swift']?.feilmelding).toEqual('validation:invalidSwift')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
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
          swift: 'ABCDEFGH',
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
