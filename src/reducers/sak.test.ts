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
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_INSTITUSJONER_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialSakState,
      institusjoner: payload
    })
  })

  it('SAK_LANDKODER_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      sakReducer({
        ...initialSakState
      }, {
        type: types.SAK_LANDKODER_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialSakState,
      landkoder: payload
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

  it('SAK_ARBEIDSPERIODER_ADD', () => {
    expect(
      sakReducer({
        ...initialSakState,
        arbeidsperioder: [{
          fraDato: '1',
          tilDato: '1',
          fraInntektsregisteret: 'ja',
          fraArbeidsgiverregisteret: 'ja',
          arbeidsgiversOrgnr: '123',
          arbeidsgiversNavn: 'abc'
        }]
      }, {
        type: types.SAK_ARBEIDSPERIODER_ADD,
        payload: {
          fraDato: '2',
          tilDato: '2',
          fraInntektsregisteret: 'ja',
          fraArbeidsgiverregisteret: 'ja',
          arbeidsgiversOrgnr: '456',
          arbeidsgiversNavn: 'def'
        }
      })
    ).toEqual({
      ...initialSakState,
      arbeidsperioder: [{
        fraDato: '1',
        tilDato: '1',
        fraInntektsregisteret: 'ja',
        fraArbeidsgiverregisteret: 'ja',
        arbeidsgiversOrgnr: '123',
        arbeidsgiversNavn: 'abc'
      }, {
        fraDato: '2',
        tilDato: '2',
        fraInntektsregisteret: 'ja',
        fraArbeidsgiverregisteret: 'ja',
        arbeidsgiversOrgnr: '456',
        arbeidsgiversNavn: 'def'
      }]
    })
  })

  it('SAK_ARBEIDSPERIODER_REMOVE', () => {
    expect(
      sakReducer({
        ...initialSakState,
        arbeidsperioder: [{
          fraDato: '1',
          tilDato: '1',
          fraInntektsregisteret: 'ja',
          fraArbeidsgiverregisteret: 'ja',
          arbeidsgiversOrgnr: '123',
          arbeidsgiversNavn: 'abc'
        }, {
          fraDato: '2',
          tilDato: '2',
          fraInntektsregisteret: 'ja',
          fraArbeidsgiverregisteret: 'ja',
          arbeidsgiversOrgnr: '456',
          arbeidsgiversNavn: 'def'
        }]
      }, {
        type: types.SAK_ARBEIDSPERIODER_REMOVE,
        payload: {
          fraDato: '2',
          tilDato: '2',
          fraInntektsregisteret: 'ja',
          fraArbeidsgiverregisteret: 'ja',
          arbeidsgiversOrgnr: '456',
          arbeidsgiversNavn: 'def'
        }
      })
    ).toEqual({
      ...initialSakState,
      arbeidsperioder: [{
        fraDato: '1',
        tilDato: '1',
        fraInntektsregisteret: 'ja',
        fraArbeidsgiverregisteret: 'ja',
        arbeidsgiversOrgnr: '123',
        arbeidsgiversNavn: 'abc'
      }]
    })
  })

  it('SAK_FAMILIERELASJONER_ADD', () => {
    expect(
      sakReducer({
        ...initialSakState,
        familierelasjoner: [{ fnr: '1' }]
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
        familierelasjoner: [{ fnr: '1' }, { fnr: '2' }]
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
