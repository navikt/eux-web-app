import * as attachmentsActions from 'actions/attachments'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from 'js-fetch-api'
import mockPreview from 'mocks/attachments/preview'
import mockItems from 'mocks/attachments/items'

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

  it('listJoarkItems()', () => {
    const mockUserId = '123'
    attachmentsActions.listJoarkItems(mockUserId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_LIST_REQUEST,
        success: types.JOARK_LIST_SUCCESS,
        failure: types.JOARK_LIST_FAILURE
      },
      url: sprintf(urls.API_JOARK_LIST_URL, { userId: mockUserId })
    }))
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

  it('setJoarkItemPreview()', () => {
    const generatedResult = attachmentsActions.setJoarkItemPreview(mockItems[0])
    expect(generatedResult).toMatchObject({
      type: types.JOARK_PREVIEW_SET,
      payload: mockItems[0]
    })
  })

  it('getMockedPayload() in localhost, test environment will not used mocked values', () => {
    const generatedResult = mockPreview()
    expect(generatedResult).toEqual(undefined)
  })

  it('getMockedPayload() in localhost, non-test environment will use mocked values for local development', () => {
    jest.resetModules()
    jest.mock('constants/environment', () => {
      return { IS_TEST: false }
    })
    const newMockPreviewfile = require('mocks/joark/preview').default
    const generatedResult = newMockPreviewfile()
    expect(generatedResult).toHaveProperty('fileName')
    expect(generatedResult).toHaveProperty('contentType', 'application/pdf')
    expect(generatedResult).toHaveProperty('filInnhold')
  })
})
