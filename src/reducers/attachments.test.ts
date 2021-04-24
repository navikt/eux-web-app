import * as types from 'constants/actionTypes'
import mockJoarkRaw from 'mocks/attachments/joark'
import joarkReducer, { initialJoarkState } from './attachments'

describe('reducers/joark', () => {
  it('JOARK_LIST_SUCCESS', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: types.JOARK_LIST_SUCCESS,
        payload: mockJoarkRaw
      })
    ).toEqual({
      ...initialJoarkState,
      list: mockJoarkRaw.data.dokumentoversiktBruker.journalposter
    })
  })

  it('JOARK_PREVIEW_SET', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: types.JOARK_PREVIEW_SET,
        payload: 'something'
      })
    ).toEqual({
      ...initialJoarkState,
      previewFile: 'something'
    })
  })

  it('JOARK_PREVIEW_SUCCESS', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: types.JOARK_PREVIEW_SUCCESS,
        context: {
          journalpostId: 'mockjournalpostId',
          tilleggsopplysninger: 'mocktilleggsopplysninger',
          tittel: 'mocktittel2',
          tema: 'mocktema2',
          dokumentInfoId: 'mockdokumentInfoId2',
          datoOpprettet: '2020-12-17T03:24:00',
          variant: 'mockVariant'
        },
        payload: {
          fileName: 'mockName',
          filInnhold: 'mockContent',
          contentType: 'mockContentType'
        }
      })
    ).toEqual({
      ...initialJoarkState,
      previewFile: {
        journalpostId: 'mockjournalpostId',
        tilleggsopplysninger: 'mocktilleggsopplysninger',
        tittel: 'mocktittel2',
        tema: 'mocktema2',
        dokumentInfoId: 'mockdokumentInfoId2',
        datoOpprettet: '2020-12-17T03:24:00',
        variant: 'mockVariant',
        name: 'mockName',
        size: 11,
        mimetype: 'mockContentType',
        content: {
          base64: 'mockContent'
        }
      }
    })
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: 'UNKNOWN_ACTION',
        payload: undefined
      })
    ).toEqual(initialJoarkState)
  })
})
