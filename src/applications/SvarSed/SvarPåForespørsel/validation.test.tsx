import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getSvarType, validateSvarPåForespørsel } from './validation'

jest.mock('i18n', () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}))

const getReplySed = (bruker: object): ReplySed => ({
  sedType: 'H002',
  sedVersjon: '4.4',
  bruker: { personInfo: {}, ...bruker }
} as unknown as ReplySed)

describe('applications/SvarSed/SvarPåForespørsel/validation', () => {
  describe('getSvarType', () => {
    it('No answer', () => {
      expect(getSvarType(getReplySed({}))).toBeUndefined()
      expect(getSvarType(getReplySed({ positivtSvar: {}, negativtSvar: [] }))).toBeUndefined()
      expect(getSvarType(getReplySed({ negativtSvar: [{ informasjon: '' }] }))).toBeUndefined()
      expect(getSvarType(undefined)).toBeUndefined()
    })

    it('Positive answer on bruker.positivtSvar', () => {
      expect(getSvarType(getReplySed({ positivtSvar: { sed: 'H001' } }))).toEqual('positivt')
    })

    it('Negative answer in bruker.negativtSvar list', () => {
      expect(getSvarType(getReplySed({ negativtSvar: [{ grunn: 'because' }] }))).toEqual('negativt')
      expect(getSvarType(getReplySed({ negativtSvar: [{}, { dokument: 'doc' }] }))).toEqual('negativt')
    })

    it('Positive answer wins when both exist', () => {
      expect(getSvarType(getReplySed({
        positivtSvar: { informasjon: 'info' },
        negativtSvar: [{ grunn: 'because' }]
      }))).toEqual('positivt')
    })

    it('Legacy root level answers are ignored', () => {
      expect(getSvarType({
        sedType: 'H002', sedVersjon: '4.4', bruker: { personInfo: {} }, positivtSvar: { informasjon: 'info' }
      } as unknown as ReplySed)).toBeUndefined()
    })
  })

  it('Empty form: success validation', () => {
    const validation: Validation = {}
    expect(validateSvarPåForespørsel(validation, 'test-mock', { replySed: getReplySed({}) })).toBeFalsy()
    expect(validation).toEqual({})
  })

  it('Valid positive answer: success validation', () => {
    const validation: Validation = {}
    const hasErrors = validateSvarPåForespørsel(validation, 'test-mock', {
      replySed: getReplySed({
        positivtSvar: { informasjon: 'a'.repeat(500), dokument: 'a'.repeat(255), sed: 'a'.repeat(65) }
      })
    })
    expect(hasErrors).toBeFalsy()
  })

  it('Too long positive answer: failed validation', () => {
    const validation: Validation = {}
    const hasErrors = validateSvarPåForespørsel(validation, 'test-mock', {
      replySed: getReplySed({
        positivtSvar: { informasjon: 'a'.repeat(501), dokument: 'a'.repeat(256), sed: 'a'.repeat(66) }
      })
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-informasjon']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-dokument']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-sed']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-grunn']).toBeUndefined()
  })

  it('Valid negative answer: success validation', () => {
    const validation: Validation = {}
    const hasErrors = validateSvarPåForespørsel(validation, 'test-mock', {
      replySed: getReplySed({
        negativtSvar: [{ informasjon: 'a'.repeat(500), dokument: 'a'.repeat(255), sed: 'a'.repeat(65), grunn: 'a'.repeat(500) }]
      })
    })
    expect(hasErrors).toBeFalsy()
  })

  it('Too long first negative answer: failed validation', () => {
    const validation: Validation = {}
    const hasErrors = validateSvarPåForespørsel(validation, 'test-mock', {
      replySed: getReplySed({
        negativtSvar: [{ informasjon: 'a'.repeat(501), dokument: 'a'.repeat(256), sed: 'a'.repeat(66), grunn: 'a'.repeat(501) }]
      })
    })
    expect(hasErrors).toBeTruthy()
    expect(validation['test-mock-informasjon']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-dokument']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-sed']?.feilmelding).toEqual('validation:textOverX')
    expect(validation['test-mock-grunn']?.feilmelding).toEqual('validation:textOverX')
  })

  it('Only the edited (first) negative answer is validated', () => {
    const validation: Validation = {}
    const hasErrors = validateSvarPåForespørsel(validation, 'test-mock', {
      replySed: getReplySed({
        negativtSvar: [{ grunn: 'ok' }, { grunn: 'a'.repeat(501) }]
      })
    })
    expect(hasErrors).toBeFalsy()
  })
})
