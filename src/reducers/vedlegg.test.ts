import * as types from 'constants/actionTypes'
import { Dokument } from 'declarations/types'
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
        payload
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
        dokument: [{ kode: 'bar' } as Dokument]
      }, {
        type: types.VEDLEGG_DOKUMENT_GET_REQUEST,
        payload
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
        dokument: [{ kode: 'bar' } as Dokument]
      }, {
        type: types.VEDLEGG_DOKUMENT_GET_FAILURE,
        payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: null
    })
  })

  it('VEDLEGG_DOKUMENT_GET_SUCCESS', () => {
    const payload = [{ kode: 'bar' } as Dokument]
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: undefined
      }, {
        type: types.VEDLEGG_DOKUMENT_GET_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: payload
    })
  })

  it('VEDLEGG_PROPERTY_SET', () => {
    expect(
      vedleggReducer({
        ...initialVedleggState
      }, {
        type: types.VEDLEGG_PROPERTY_SET,
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

  it('APP_CLEAN', () => {
    expect(
      vedleggReducer({} as VedleggState, {
        type: types.APP_CLEAN,
        payload: undefined
      })
    ).toEqual(initialVedleggState)
  })
})
