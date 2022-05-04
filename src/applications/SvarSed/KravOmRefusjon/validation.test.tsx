import { Validation } from 'declarations/types'
import { useTranslation } from 'react-i18next'
import { validateKravOmRefusjon } from './validation'

describe('applications/SvarSed/KravOmRefusjon/validation', () => {
  const { t } = useTranslation()

  it('Empty form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKravOmRefusjon(validation, {
      kravOmRefusjon: '',
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeTruthy()

    expect(validation['test-mock-krav']?.feilmelding).toEqual('validation:noKrav')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
  })

  it('invalid form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKravOmRefusjon(validation, {
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
    expect(validation['test-mock-krav']?.feilmelding).toEqual('validation:textOverX')
    expect(validation.test?.feilmelding).toEqual('error')
    expect(validation['test-mock']?.feilmelding).toEqual('error')
  })

  it('valid form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKravOmRefusjon(validation, {
      kravOmRefusjon: 'kravOmRefusjon',
      namespace: 'test-mock',
      formalName: 'name'
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
