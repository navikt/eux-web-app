import * as types from 'constants/actionTypes'
import sakReducer, { initialSakState } from './sak'

describe('reducers/sak', () => {
  it('SAK_ARBEIDSPERIODER_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer(initialSakState, {
        type: types.SAK_ARBEIDSPERIODER_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialSakState,
      arbeidsgivere: payload
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

  it('SAK_PERSON_RELATERT_SEARCH_FAILURE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        personRelatert: []
      }, {
        type: types.SAK_PERSON_RELATERT_SEARCH_FAILURE,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      personRelatert: null
    })
  })

  it('SAK_PERSON_RELATERT_SEARCH_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_PERSON_RELATERT_SEARCH_SUCCESS,
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

  it('SAK_SEND_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_SEND_SUCCESS,
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
      sakReducer({
        ...initialSakState,
        kjoenn: [{ term: 'kvinne', kode: 'K' }],
        person: '123'
      }, {
        type: types.APP_CLEAN_DATA,
        payload: {}
      })
    ).toEqual({
      ...initialSakState,
      kjoenn: [{ term: 'kvinne', kode: 'K' }]
    })
  })

  it('APP_CLEAN_DATA', () => {
    expect(
      sakReducer({
        ...initialSakState,
        fnr: '123'
      }, {
        type: types.APP_CLEAN_DATA
      })
    ).toEqual(initialSakState)
  })

  it('SAK_PERSON_RESET', () => {
    expect(
      sakReducer({
        ...initialSakState,
        fnr: '123'
      }, {
        type: types.SAK_PERSON_RESET
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

  it('SAK_ARBEIDSGIVER_ADD', () => {
    expect(
      sakReducer({
        ...initialSakState,
        arbeidsgiver: [1]
      }, {
        type: types.SAK_ARBEIDSGIVER_ADD,
        payload: 2
      })
    ).toEqual({
      ...initialSakState,
      arbeidsgiver: [1, 2]
    })
  })

  it('SAK_ARBEIDSGIVER_REMOVE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        arbeidsgiver: [1, 2]
      }, {
        type: types.SAK_ARBEIDSGIVER_REMOVE,
        payload: 2
      })
    ).toEqual({
      ...initialSakState,
      arbeidsgiver: [1]
    })
  })

  it('SAK_FAMILIERELASJONER_ADD', () => {
    expect(
      sakReducer({
        ...initialSakState,
        familierelasjoner: [{ fnr: 1 }]
      }, {
        type: types.SAK_FAMILIERELASJONER_ADD,
        payload: { fnr: 2 }
      })
    ).toEqual({
      ...initialSakState,
      familierelasjoner: [{ fnr: 1 }, { fnr: 2 }]
    })
  })

  it('SAK_FAMILIERELASJONER_REMOVE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        familierelasjoner: [{ fnr: 1 }, { fnr: 2 }]
      }, {
        type: types.SAK_FAMILIERELASJONER_REMOVE,
        payload: { fnr: 2 }
      })
    ).toEqual({
      ...initialSakState,
      familierelasjoner: [{ fnr: 1 }]
    })
  })
})
