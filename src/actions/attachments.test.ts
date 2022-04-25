import * as attachmentsActions from 'actions/attachments'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { JoarkBrowserItem, JoarkFileVariant, SEDAttachmentPayloadWithFile } from 'declarations/attachments'
import { call as originalCall } from '@navikt/fetch'
import mockItems from 'mocks/attachments/items'

const sprintf = require('sprintf-js').sprintf
jest.mock('@navikt/fetch', () => ({
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
    expect(attachmentsActions.createSavingAttachmentJob(joarkBrowserItems))
      .toMatchObject({
        type: types.ATTACHMENT_SAVINGATTACHMENTJOB_SET,
        payload: joarkBrowserItems
      })
  })

  it('getJoarkItemPreview()', () => {
    attachmentsActions.getJoarkItemPreview(mockItems[0])
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.ATTACHMENT_PREVIEW_REQUEST,
        success: types.ATTACHMENT_PREVIEW_SUCCESS,
        failure: types.ATTACHMENT_PREVIEW_FAILURE
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
    const fnr = '123'
    attachmentsActions.listJoarkItems(fnr)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.ATTACHMENT_LIST_REQUEST,
        success: types.ATTACHMENT_LIST_SUCCESS,
        failure: types.ATTACHMENT_LIST_FAILURE
      },
      url: sprintf(urls.API_ATTACHMENT_LIST_URL, { fnr })
    }))
  })

  it('resetSedAttachments()', () => {
    expect(attachmentsActions.resetSedAttachments()).toMatchObject({
      type: types.ATTACHMENT_RESET
    })
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
      key: '1',
      variant: 'variant' as unknown as JoarkFileVariant,
      title: 'title',
      tema: 'tema',
      date: new Date(1970, 1, 1)
    }
    attachmentsActions.sendAttachmentToSed(params, joarkBrowserItem)
    expect(call).toBeCalledWith(expect.objectContaining({
      method: 'POST',
      type: {
        request: types.ATTACHMENT_SEND_REQUEST,
        success: types.ATTACHMENT_SEND_SUCCESS,
        failure: types.ATTACHMENT_SEND_FAILURE
      },
      context: {
        params,
        joarkBrowserItem
      },
      url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params)
    }))
  })

  it('setJoarkItemPreview()', () => {
    expect(attachmentsActions.setJoarkItemPreview(mockItems[0])).toMatchObject({
      type: types.ATTACHMENT_PREVIEW_SET,
      payload: mockItems[0]
    })
  })
})
