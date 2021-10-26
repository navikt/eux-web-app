import { Validation } from 'declarations/types'
import { useTranslation } from 'react-i18next'
import { validateKravOmRefusjon } from './validation'

describe('applications/SvarSed/Formaal/KravOmRefusjon/validation', () => {
  const { t } = useTranslation()

  it('Empty form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKravOmRefusjon(validation, t, {
      kravOmRefusjon: '',
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()

    expect(validation['test-mock-krav']?.feilmelding).toEqual('validation:noKravTil')
    expect(validation.test?.feilmelding).toEqual('notnull')
    expect(validation['test-mock']?.feilmelding).toEqual('notnull')
  })

  it('invalid form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKravOmRefusjon(validation, t, {
      kravOmRefusjon: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
        '123',
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-krav']?.feilmelding).toEqual('validation:textOver500Til')
    expect(validation.test?.feilmelding).toEqual('notnull')
    expect(validation['test-mock']?.feilmelding).toEqual('notnull')
  })

  it('valid form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKravOmRefusjon(validation, t, {
      kravOmRefusjon: 'kravOmRefusjon',
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
