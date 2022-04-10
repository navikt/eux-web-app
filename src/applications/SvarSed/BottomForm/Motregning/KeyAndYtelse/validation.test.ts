import { KeyAndYtelse } from 'applications/SvarSed/BottomForm/Motregning/KeyAndYtelse/KeyAndYtelse'
import { Validation } from 'declarations/types'
import { useTranslation } from 'react-i18next'
import { validateKeyAndYtelse } from './validation'

describe('applications/SvarSed/BottomForm/Motregning/KeyAndYtelse/validation', () => {
  const { t } = useTranslation()

  it('Empty form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKeyAndYtelse(validation, t, {
      keyAndYtelse: {} as KeyAndYtelse,
      index: 99,
      namespace: 'test-mock'
    })
    expect(hasErrors).toBeTruthy()

    expect(validation['test-mock-keyandytelse[99]-key']?.feilmelding).toEqual('validation:noNavn')
    expect(validation['test-mock-keyandytelse[99]-ytelseNavn']?.feilmelding).toEqual('validation:noBetegnelsePåYtelse')
  })

  it('valid form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKeyAndYtelse(validation, t, {
      keyAndYtelse: {
        fullKey: 'key',
        ytelseNavn: 'ytelseNavn'
      } as KeyAndYtelse,
      namespace: 'test-mock'
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
