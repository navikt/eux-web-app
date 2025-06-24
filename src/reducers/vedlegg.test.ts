import * as types from 'constants/actionTypes'
import { Dokument } from 'declarations/types'
import vedleggReducer, { initialVedleggState, VedleggState } from './vedlegg'

describe('reducers/app', () => {

  it('VEDLEGG_DOKUMENT_REQUEST', () => {
    const payload = 'mockPayload'
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: [{ kode: 'bar' } as Dokument]
      }, {
        type: types.VEDLEGG_DOKUMENT_REQUEST,
        payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: undefined
    })
  })

  it('VEDLEGG_DOKUMENT_FAILURE', () => {
    const payload = 'mockPayload'
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: [{ kode: 'bar' } as Dokument]
      }, {
        type: types.VEDLEGG_DOKUMENT_FAILURE,
        payload
      })
    ).toEqual({
      ...initialVedleggState,
      dokument: null
    })
  })

  it('VEDLEGG_DOKUMENT_SUCCESS', () => {
    const payload = [{ kode: 'bar' } as Dokument]
    expect(
      vedleggReducer({
        ...initialVedleggState,
        dokument: undefined
      }, {
        type: types.VEDLEGG_DOKUMENT_SUCCESS,
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

  it('APP_RESET', () => {
    expect(
      vedleggReducer({} as VedleggState, {
        type: types.APP_RESET,
        payload: undefined
      })
    ).toEqual(initialVedleggState)
  })
})
