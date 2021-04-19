import { SavingAttachmentsJob } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import ProgressBar from 'fremdriftslinje'
import React from 'react'
import { stageSelector } from 'setupTests'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'
import joarkBrowserItems from 'mocks/joark/items'

const defaultSelector = {
  savingAttachmentsJob: {
    total: joarkBrowserItems,
    saved: [],
    saving: undefined,
    remaining: joarkBrowserItems
  }
}

describe('applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentSenderProps = {
    attachmentsError: false,
    className: 'mock-sedAttachmentSender',
    initialStatus: 'inprogress',
    onCancel: jest.fn(),
    onFinished: jest.fn(),
    onSaved: jest.fn(),
    payload: {
      aktoerId: '123',
      rinaId: '456',
      rinaDokumentId: '789'
    },
    sendAttachmentToSed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<SEDAttachmentSender {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedAttachmentSender__div-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedAttachmentSender__progress-bar-id\']')).toBeTruthy()
    expect(wrapper.find(ProgressBar).props().status).toEqual(initialMockProps.initialStatus)
  })

  it('Handling: cancel button pressed', () => {
    (initialMockProps.onCancel as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'a-buc-c-sedAttachmentSender__cancel-button-id\']').hostNodes().simulate('click')
    expect(initialMockProps.onCancel).toHaveBeenCalled()
  })

  it('Handling: finished when no more items', () => {
    const mockSavingAttachmentJob: SavingAttachmentsJob = {
      total: joarkBrowserItems,
      saved: joarkBrowserItems,
      saving: undefined,
      remaining: []
    }
    stageSelector(defaultSelector, {
      savingAttachmentsJob: mockSavingAttachmentJob
    })
    wrapper = mount(<SEDAttachmentSender {...initialMockProps} />)
    expect(wrapper.find(ProgressBar).props().status).toEqual('done')
    expect(initialMockProps.onSaved).toHaveBeenCalledWith(mockSavingAttachmentJob)
    expect(initialMockProps.onFinished).toHaveBeenCalled()
  })
})
