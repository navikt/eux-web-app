import * as attachmentsActions from 'actions/attachments'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { JoarkBrowserItem, SEDAttachmentPayloadWithFile } from 'declarations/attachments'
import { call as originalCall } from 'js-fetch-api'
import mockItems from 'mocks/attachments/items'
import { Action } from 'redux'

const sprintf = require('sprintf-js').sprintf
jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/attachments', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('createSavingAttachmentJob()', () => {
    const joarkBrowserItems: Array<JoarkBrowserItem> = []
    const generatedResult: Action = attachmentsActions.createSavingAttachmentJob(joarkBrowserItems)
    expect(generatedResult)
      .toMatchObject({
        type: types.ATTACHMENT_SAVINGATTACHMENTJOB_SET,
        payload: joarkBrowserItems
      })
  })

  it('getJoarkItemPreview()', () => {
    attachmentsActions.getJoarkItemPreview(mockItems[0])
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_PREVIEW_REQUEST,
        success: types.JOARK_PREVIEW_SUCCESS,
        failure: types.JOARK_PREVIEW_FAILURE
      },
      context: mockItems[0],
      url: sprintf(urls.API_JOARK_GET_URL, {
        dokumentInfoId: mockItems[0].dokumentInfoId,
        journalpostId: mockItems[0].journalpostId,
        variantformat: mockItems[0].variant!.variantformat
      })
    }))
  })

  it('listJoarkItems()', () => {
    const mockFnr = '123'
    attachmentsActions.listJoarkItems(mockFnr)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_LIST_REQUEST,
        success: types.JOARK_LIST_SUCCESS,
        failure: types.JOARK_LIST_FAILURE
      },
      url: sprintf(urls.API_JOARK_LIST_URL, { fnr: mockFnr })
    }))
  })

  it('sendAttachmentToSed()', () => {
    const params: SEDAttachmentPayloadWithFile = {
      fnr: 'fnr',
      journalpostId: '1',
      dokumentInfoId: '2',
      variantformat: 'variant',
      filnavn: 'filnavn',
      rinaId: '123',
      rinaDokumentId: '456'
    }
    const joarkBrowserItem = {
      hasSubrows: false,
      type: 'joark',
      journalpostId: '1',
      dokumentInfoId: '2',
      variant: 'variant',
      title: 'title',
      tema: 'tema',
      date: new Date(1970, 1, 1)
    }
    attachmentsActions.sendAttachmentToSed(params, joarkBrowserItem)
    expect(call).toBeCalledWith(expect.objectContaining({
      method: 'PUT',
      type: {
        request: types.ATTACHMENT_SEND_REQUEST,
        success: types.ATTACHMENT_SEND_SUCCESS,
        failure: types.ATTACHMENT_SEND_FAILURE
      },
      context: {
        params: params,
        joarkBrowserItem: joarkBrowserItem
      },
      url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params)
    }))
  })

  it('setJoarkItemPreview()', () => {
    const generatedResult = attachmentsActions.setJoarkItemPreview(mockItems[0])
    expect(generatedResult).toMatchObject({
      type: types.JOARK_PREVIEW_SET,
      payload: mockItems[0]
    })
  })

  it('resetSedAttachments()', () => {
    const generatedResult = attachmentsActions.resetSedAttachments()
    expect(generatedResult).toMatchObject({
      type:types.ATTACHMENT_RESET
    })
  })
})
