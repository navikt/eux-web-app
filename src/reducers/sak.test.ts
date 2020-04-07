import * as types from 'constants/actionTypes'
import sakReducer, { initialSakState, SakState } from './sak'

describe('reducers/sak', () => {
  it('SAK_ARBEIDSFORHOLD_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer(initialSakState, {
        type: types.SAK_ARBEIDSFORHOLD_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      arbeidsforhold: payload
    })
  })

  it('SAK_FAGSAKER_GET_REQUEST', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState,
        fagsaker: []
      }, {
        type: types.SAK_FAGSAKER_GET_REQUEST,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      fagsaker: undefined
    })
  })

  it('SAK_FAGSAKER_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState,
        fagsaker: []
      }, {
        type: types.SAK_FAGSAKER_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      fagsaker: payload
    })
  })

  it('SAK_FAGSAKER_GET_FAILURE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        fagsaker: []
      }, {
        type: types.SAK_FAGSAKER_GET_FAILURE,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      fagsaker: null
    })
  })

  it('SAK_INSTITUSJONER_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_INSTITUSJONER_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      institusjoner: payload
    })
  })

  it('SAK_LANDKODER_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_LANDKODER_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      landkoder: payload
    })
  })

  it('SAK_PERSON_GET_FAILURE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        person: []
      }, {
        type: types.SAK_PERSON_GET_FAILURE,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      person: null
    })
  })

  it('SAK_PERSON_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_PERSON_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      person: payload
    })
  })

  it('SAK_PERSON_RELATERT_GET_FAILURE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        personRelatert: []
      }, {
        type: types.SAK_PERSON_RELATERT_GET_FAILURE,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      personRelatert: null
    })
  })

  it('SAK_PERSON_RELATERT_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_PERSON_RELATERT_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      personRelatert: payload
    })
  })

  it('SAK_PERSON_RESET', () => {
    expect(
      sakReducer({
        ...initialSakState,
        person: []
      }, {
        type: types.SAK_PERSON_RESET,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      person: undefined
    })
  })

  it('SAK_PERSON_RELATERT_RESET', () => {
    expect(
      sakReducer({
        ...initialSakState,
        personRelatert: []
      }, {
        type: types.SAK_PERSON_RELATERT_RESET,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      personRelatert: undefined
    })
  })

  it('SAK_SEND_POST_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_SEND_POST_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      opprettetSak: payload
    })
  })

  it('SAK_PRELOAD', () => {
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_PRELOAD,
        payload: { foo: 'bar' }
      })
    ).toEqual({
      ...initialSakState,
      foo: 'bar'
    })
  })

  it('APP_CLEAN_DATA', () => {
    expect(
      sakReducer({} as SakState, {
        type: types.APP_CLEAN_DATA,
        payload: {}
      })
    ).toEqual(initialSakState)
  })
})
