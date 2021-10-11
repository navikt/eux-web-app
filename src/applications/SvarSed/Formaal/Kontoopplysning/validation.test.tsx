
import { Validation } from 'declarations/types'
import { useTranslation } from 'react-i18next'
import { validateKontoopplysning } from './validation'

describe('applications/SvarSed/Formaal/Kontoopplysning/validation', () => {
  let {t} = useTranslation()

  it('Empty form: failed validation', () => {

    let validation: Validation = {}
    let hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '', id: '', kontoOrdinaer: {
          sepaKonto: undefined, iban: '', adresse: {
            land: '', region: '', by: '', bygning: '', postnummer: '', gate: '', type: undefined
          }, bankensNavn: '', kontonummer: '', swift: ''
        }, navn: ''
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()

    expect(validation['test-mock-begrunnelse']?.feilmelding).toEqual('message:validation-noBegrunnelseTil')
    expect(validation['test-mock-id']?.feilmelding).toEqual('message:validation-noInstitusjonensIdTil')
    expect(validation['test-mock-navn']?.feilmelding).toEqual('message:validation-noInstitusjonensNavnTil')
    expect(validation['test-mock-kontoOrdinaer-sepaKonto']?.feilmelding).toEqual('message:validation-noSepaKontoTil')
    expect(validation['test-mock-kontoOrdinaer-iban']?.feilmelding).toEqual('message:validation-noIbanTil')
    expect(validation['test-mock-kontoOrdinaer-swift']?.feilmelding).toEqual('message:validation-noSwiftTil')
    expect(validation['test']?.feilmelding).toEqual('notnull')
    expect(validation['test-mock']?.feilmelding).toEqual('notnull')
  })

  it('invalid form: failed validation', () => {
    let validation: Validation = {}
    let hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
          '123',
        id: '123@abc', kontoOrdinaer: {
          sepaKonto: 'ja', iban: '123@abc', adresse: {
            land: '123@abc', region: '123@abc', by: '123@abc', bygning: '123@abc', postnummer: '123@abc', gate: '123@abc', type: 'annet'
          }, bankensNavn: '123@abc', kontonummer: '123@abc', swift: '123@abc'
        }, navn: '123@abc'
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-begrunnelse']?.feilmelding).toEqual('message:validation-textOver500Til')
    expect(validation['test']?.feilmelding).toEqual('notnull')
    expect(validation['test-mock']?.feilmelding).toEqual('notnull')
  })

  it('valid form: success validation', () => {

    let validation: Validation = {}
    let hasErrors: boolean = validateKontoopplysning(validation, t, {
      uti: {
        begrunnelse: 'begrunnelse', id: 'id', kontoOrdinaer: {
          sepaKonto: 'ja', iban: '123', adresse: {
            land: 'NO', region: 'region', by: 'by', bygning: 'bygning', postnummer: '123', gate: 'gate', type: 'bosted'
          }, bankensNavn: 'bankensNavn', kontonummer: '123', swift: '123'
        }, navn: 'navn'
      },
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
