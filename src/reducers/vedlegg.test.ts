import * as types from 'constants/actionTypes'
import vedleggReducer, { initialVedleggState, VedleggState } from './vedlegg'

describe('reducers/app', () => {
  it('VEDLEGG_POST_SUCCESS', () => {
    const payload = {
      filnavn: 'filnavn',
      vedleggID: '123',
      url: 'url'
    }
    expect(
      vedleggReducer({
        ...initialVedleggState
      }, {
        type: types.VEDLEGG_POST_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialVedleggState,
      vedlegg: payload
    })
  })

  it('VEDLEGG_DOKUMENT_GET_REQUEST', () => {
    const payload = 'mockPayload'
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: ''
      }, {
        type: types.VEDLEGG_DOKUMENT_GET_REQUEST,
        payload: payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: undefined
    })
  })

  it('VEDLEGG_DOKUMENT_GET_FAILURE', () => {
    const payload = 'mockPayload'
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: ''
      }, {
        type: types.VEDLEGG_DOKUMENT_GET_FAILURE,
        payload: payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: null
    })
  })

  it('VEDLEGG_DOKUMENT_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: ''
      }, {
        type: types.VEDLEGG_DOKUMENT_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: payload
    })
  })

  it('VEDLEGG_VALUE_SET', () => {
    expect(
      vedleggReducer({
        ...initialVedleggState
      }, {
        type: types.VEDLEGG_VALUE_SET,
        payload: {
          key: 'foo',
          value: 'bar'
        }
      })
    ).toEqual({
      ...initialVedleggState,
      foo: 'bar'
    })
  })

  it('APP_CLEAN_DATA', () => {
    expect(
      vedleggReducer({} as VedleggState, {
        type: types.APP_CLEAN_DATA,
        payload: undefined
      })
    ).toEqual(initialVedleggState)
  })
})
