import * as types from 'constants/actionTypes'
import { H002Sed } from 'declarations/h002'
import { H001Sed } from 'declarations/h001'
import { ReplySed } from 'declarations/sed'
import svarsedReducer, { initialSvarsedState } from './svarsed'

describe('reducers/svarsed', () => {
  const replySed = {
    sedType: 'H002',
    sedVersjon: '4.4',
    bruker: {
      personInfo: { fornavn: 'Ola' },
      negativtSvar: [
        { informasjon: 'first', grunn: 'first grunn' },
        { informasjon: 'second', dokument: 'second doc' }
      ],
      vedlegg: { type: ['søknad'], andreDokumenter: ['other'] },
      ytterligereInfo: 'comment'
    }
  } as unknown as ReplySed

  it('SVARSED_REPLYSED_UPDATE on a nested list entry keeps the other entries and nested data', () => {
    const state = svarsedReducer({ ...initialSvarsedState, replySed }, {
      type: types.SVARSED_REPLYSED_UPDATE,
      payload: { needle: 'bruker.negativtSvar[0].dokument', value: 'new doc' }
    })
    expect((state.replySed as H002Sed).bruker.negativtSvar).toEqual([
      { informasjon: 'first', grunn: 'first grunn', dokument: 'new doc' },
      { informasjon: 'second', dokument: 'second doc' }
    ])
    expect((state.replySed as H002Sed).bruker.vedlegg).toEqual({ type: ['søknad'], andreDokumenter: ['other'] })
    expect((state.replySed as H002Sed).bruker.personInfo).toEqual({ fornavn: 'Ola' })
    expect(state.replySedChanged).toBe(true)
    // does not mutate the previous state
    expect((replySed as H002Sed).bruker.negativtSvar?.[0]).not.toHaveProperty('dokument')
  })

  it('SVARSED_REPLYSED_UPDATE creates nested bruker paths when missing', () => {
    const state = svarsedReducer({
      ...initialSvarsedState,
      replySed: { sedType: 'H001', sedVersjon: '4.4', bruker: { personInfo: {} } } as unknown as ReplySed
    }, {
      type: types.SVARSED_REPLYSED_UPDATE,
      payload: { needle: 'bruker.anmodning.adresseTyper', value: ['bosted', 'kontakt'] }
    })
    expect((state.replySed as H001Sed).bruker.anmodning).toEqual({ adresseTyper: ['bosted', 'kontakt'] })
  })

  it('SVARSED_SED_UPDATE_SUCCESS for H001 allows to resend, typed or not', () => {
    const state = svarsedReducer({ ...initialSvarsedState, sedSendResponse: { success: 'true' } }, {
      type: types.SVARSED_SED_UPDATE_SUCCESS,
      payload: { sedId: '1' },
      context: { sedType: 'H001' }
    })
    expect(state.sedSendResponse).toBeUndefined()
  })
})
