import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateSEDEdit } from 'pages/SvarSed/mainValidation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

const getReplySed = (sedType: string, bruker: object, root: object = {}): ReplySed => ({
  sedType,
  sedVersjon: '4.4',
  bruker: { personInfo: { fornavn: 'Ola', etternavn: 'Nordmann' }, ...bruker },
  ...root
} as unknown as ReplySed)

const validate = (replySed: ReplySed): Validation => {
  const validation: Validation = {}
  jest.spyOn(console, 'log').mockImplementation(() => undefined)
  validateSEDEdit(validation, '', { replySed })
  return validation
}

const tooLong = 'a'.repeat(501)

describe('pages/SvarSed/mainValidation - H001/H002', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('H001: validates the additional information on bruker.ytterligereInfo', () => {
    const validation = validate(getReplySed('H001', { ytterligereInfo: tooLong }))
    expect(validation['svarsed-bruker-ytterligereinfobruker-ytterligereInfo']?.feilmelding).toContain('validation:textOverX')
  })

  it('H001: validates anmodning dokumentasjon on bruker.anmodning', () => {
    const validation = validate(getReplySed('H001', {
      anmodning: { dokumentasjon: { informasjon: 'a'.repeat(256), dokument: 'a'.repeat(256), sed: 'a'.repeat(66) } }
    }))
    expect(validation['svarsed-bruker-anmodning-informasjon']?.feilmelding).toContain('validation:textOverX')
    expect(validation['svarsed-bruker-anmodning-dokument']?.feilmelding).toContain('validation:textOverX')
    expect(validation['svarsed-bruker-anmodning-sed']?.feilmelding).toContain('validation:textOverX')
  })
  
  it('H001: does not use the shared root level comment check', () => {
    const validation = validate(getReplySed('H001', {}, { ytterligereInfo: tooLong }))
    expect(validation['editor-ytterligereInfo']).toBeUndefined()
  })

  it('H002: validates the additional information on bruker.ytterligereInfo', () => {
    const validation = validate(getReplySed('H002', { ytterligereInfo: tooLong }))
    expect(validation['svarsed-bruker-ytterligereinfobruker-ytterligereInfo']?.feilmelding).toContain('validation:textOverX')
    expect(validation['editor-ytterligereInfo']).toBeUndefined()
  })

  it('H002: ignores a root level comment', () => {
    const validation = validate(getReplySed('H002', {}, { ytterligereInfo: tooLong }))
    expect(validation['editor-ytterligereInfo']).toBeUndefined()
  })

  it('H002: validates positive and negative answers on bruker', () => {
    const positive = validate(getReplySed('H002', { positivtSvar: { informasjon: tooLong } }))
    expect(positive['svarsed-bruker-svarpåforespørsel-informasjon']?.feilmelding).toContain('validation:textOverX')

    const negative = validate(getReplySed('H002', { negativtSvar: [{ grunn: tooLong }] }))
    expect(negative['svarsed-bruker-svarpåforespørsel-grunn']?.feilmelding).toContain('validation:textOverX')
  })

  it('other SEDs keep validating the root level comment', () => {
    const validation = validate(getReplySed('H003', {}, { ytterligereInfo: tooLong }))
    expect(validation['editor-ytterligereInfo']?.feilmelding).toEqual('validation:textOverX')
  })
})
