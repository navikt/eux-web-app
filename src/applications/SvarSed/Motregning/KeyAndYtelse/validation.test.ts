import { KeyAndYtelse } from 'applications/SvarSed/Motregning/KeyAndYtelse/KeyAndYtelse'
import { Validation } from 'declarations/types'
import { validateKeyAndYtelse } from './validation'

describe('applications/SvarSed/Motregning/KeyAndYtelse/validation', () => {
  it('Empty form: failed validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKeyAndYtelse(validation, 'test-mock', {
      keyAndYtelse: {} as KeyAndYtelse,
      index: 99
    })
    expect(hasErrors).toBeTruthy()

    expect(validation['test-mock-keyandytelse[99]-key']?.feilmelding).toEqual('validation:noNavn')
    expect(validation['test-mock-keyandytelse[99]-ytelseNavn']?.feilmelding).toEqual('validation:noBetegnelsePåYtelse')
  })

  it('valid form: success validation', () => {
    const validation: Validation = {}
    const hasErrors: boolean = validateKeyAndYtelse(validation, 'test-mock', {
      keyAndYtelse: {
        fullKey: 'key',
        ytelseNavn: 'ytelseNavn'
      } as KeyAndYtelse
    })
    expect(hasErrors).toBeFalsy()
    expect(validation).toEqual({})
  })
})
