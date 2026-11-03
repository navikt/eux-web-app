import * as types from 'constants/actionTypes'
import sakReducer, { initialSakState } from './sak'

describe('reducers/sak', () => {
  it('SAK_FAGSAKER_REQUEST', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState,
        fagsaker: []
      }, {
        type: types.SAK_FAGSAKER_REQUEST,
        payload
      })
    ).toEqual({
      ...initialSakState,
      fagsaker: undefined
    })
  })

  it('SAK_FAGSAKER_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState,
        fagsaker: []
      }, {
        type: types.SAK_FAGSAKER_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialSakState,
      fagsaker: payload
    })
  })

  it('SAK_FAGSAKER_FAILURE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        fagsaker: []
      }, {
        type: types.SAK_FAGSAKER_FAILURE,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      fagsaker: null
    })
  })

  it('SAK_INSTITUSJONER_SUCCESS', () => {
    const payload = 'mockPayload'
    const context = { buctype: 'UB_BUC_02', landkode: 'SWE', requestId: 'request-1' }
    const state = sakReducer(initialSakState, {
      type: types.SAK_INSTITUSJONER_REQUEST,
      context
    })
    expect(
      sakReducer(state, {
        type: types.SAK_INSTITUSJONER_SUCCESS,
        payload,
        context
      })
    ).toEqual({
      ...initialSakState,
      institusjonList: payload,
      institusjonRequests: {
        'UB_BUC_02:SWE': { requestId: 'request-1', loading: false, institusjoner: payload }
      }
    })
  })

  it('keeps institution results and loading separate for each country and BUC', () => {
    const sweden = { buctype: 'UB_BUC_02', landkode: 'SWE', requestId: 'sweden' }
    const denmark = { buctype: 'UB_BUC_02', landkode: 'DNK', requestId: 'denmark' }
    const otherBuc = { buctype: 'UB_BUC_01', landkode: 'DNK', requestId: 'other-buc' }
    let state = initialSakState
    for (const context of [sweden, denmark, otherBuc]) {
      state = sakReducer(state, { type: types.SAK_INSTITUSJONER_REQUEST, context })
    }
    state = sakReducer(state, {
      type: types.SAK_INSTITUSJONER_SUCCESS, context: denmark, payload: [{ institusjonsID: 'DK:1' }]
    })
    expect(state.institusjonRequests['UB_BUC_02:SWE']?.loading).toBe(true)
    expect(state.institusjonRequests['UB_BUC_01:DNK']?.loading).toBe(true)
    state = sakReducer(state, {
      type: types.SAK_INSTITUSJONER_SUCCESS, context: sweden, payload: [{ institusjonsID: 'SE:1' }]
    })
    expect(state.institusjonRequests['UB_BUC_02:DNK']?.institusjoner).toEqual([{ institusjonsID: 'DK:1' }])
    expect(state.institusjonRequests['UB_BUC_02:SWE']?.institusjoner).toEqual([{ institusjonsID: 'SE:1' }])
  })

  it('ignores superseded institution responses when returning to the same country', () => {
    const first = { buctype: 'UB_BUC_02', landkode: 'SWE', requestId: 'first' }
    const latest = { ...first, requestId: 'latest' }
    let state = sakReducer(initialSakState, { type: types.SAK_INSTITUSJONER_REQUEST, context: first })
    state = sakReducer(state, { type: types.SAK_INSTITUSJONER_REQUEST, context: latest })
    expect(sakReducer(state, {
      type: types.SAK_INSTITUSJONER_SUCCESS, context: first, payload: [{ institusjonsID: 'SE:old' }]
    })).toBe(state)
    state = sakReducer(state, {
      type: types.SAK_INSTITUSJONER_SUCCESS, context: latest, payload: [{ institusjonsID: 'SE:new' }]
    })
    expect(sakReducer(state, { type: types.SAK_INSTITUSJONER_FAILURE, context: first })).toBe(state)
    expect(state.institusjonRequests['UB_BUC_02:SWE']?.institusjoner).toEqual([{ institusjonsID: 'SE:new' }])
  })

  it('clears institution options when reloading and after failure', () => {
    const context = { buctype: 'UB_BUC_02', landkode: 'SWE', requestId: 'first' }
    let state = sakReducer(initialSakState, { type: types.SAK_INSTITUSJONER_REQUEST, context })
    state = sakReducer(state, {
      type: types.SAK_INSTITUSJONER_SUCCESS, context, payload: [{ institusjonsID: 'SE:1' }]
    })
    const retry = { ...context, requestId: 'retry' }
    state = sakReducer(state, { type: types.SAK_INSTITUSJONER_REQUEST, context: retry })
    expect(state.institusjonRequests['UB_BUC_02:SWE']).toEqual({
      requestId: 'retry', loading: true, institusjoner: undefined
    })
    state = sakReducer(state, { type: types.SAK_INSTITUSJONER_FAILURE, context: retry })
    expect(state.institusjonRequests['UB_BUC_02:SWE']).toEqual({
      requestId: 'retry', loading: false, institusjoner: undefined
    })
  })

  it('SAK_SEND_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_SEND_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialSakState,
      opprettetSak: payload
    })
  })

  it('APP_RESET', () => {
    expect(
      sakReducer({
        ...initialSakState,
        filloutinfo: {
          etternavn: 'etternavn',
          fornavn: 'fornavn',
          fdato: 'fdato',
          fnr: '123'
        }
      }, {
        type: types.APP_RESET,
        payload: {}
      })
    ).toEqual(initialSakState)
  })

  it('APP_RESET', () => {
    expect(
      sakReducer({
        ...initialSakState,
        fnr: '123'
      }, {
        type: types.APP_RESET
      })
    ).toEqual(initialSakState)
  })

  it('SAK_PROPERTY_SET', () => {
    expect(
      sakReducer(initialSakState,
        {
          type: types.SAK_PROPERTY_SET,
          payload: {
            key: 'foo',
            value: 'bar'
          }
        })
    ).toEqual({
      ...initialSakState,
      foo: 'bar'
    })
  })

  it('SAK_FAMILIERELASJONER_ADD', () => {
    expect(
      sakReducer({
        ...initialSakState,
        familierelasjonerPDL: [{ fnr: '1' }]
      }, {
        type: types.SAK_FAMILIERELASJONER_ADD,
        payload: { fnr: '2' }
      })
    ).toEqual({
      ...initialSakState,
      familierelasjoner: [{ fnr: '1' }, { fnr: '2' }]
    })
  })

  it('SAK_FAMILIERELASJONER_REMOVE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        familierelasjonerPDL: [{ fnr: '1' }, { fnr: '2' }]
      }, {
        type: types.SAK_FAMILIERELASJONER_REMOVE,
        payload: { fnr: '2' }
      })
    ).toEqual({
      ...initialSakState,
      familierelasjoner: [{ fnr: '1' }]
    })
  })
})
