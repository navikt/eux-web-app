import { SavingAttachmentsJob } from 'declarations/attachments'
import { render } from '@testing-library/react'
import ProgressBar from 'components/ProgressBar/ProgressBar'
import React from 'react'
import { stageSelector } from 'setupTests'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'
import joarkBrowserItems from 'mocks/attachments/items'

const defaultSelector = {
  savingAttachmentsJob: {
    total: joarkBrowserItems,
    saved: [],
    saving: undefined,
    remaining: joarkBrowserItems
  }
}

describe('components/SEDAttachmentSender/SEDAttachmentSender', () => {
  let wrapper: any
  const initialMockProps: SEDAttachmentSenderProps = {
    attachmentsError: false,
    className: 'mock-sedAttachmentSender',
    initialStatus: 'inprogress',
    onCancel: jest.fn(),
    onFinished: jest.fn(),
    onSaved: jest.fn(),
    payload: {
      rinaId: '456',
      rinaDokumentId: '789'
    },
    sendAttachmentToSed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<SEDAttachmentSender {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-testid=\'c-sedAttachmentSender__div-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-testid=\'c-sedAttachmentSender__progress-bar-id\']')).toBeTruthy()
    expect(wrapper.find(ProgressBar).props().status).toEqual(initialMockProps.initialStatus)
  })

  it('Handling: cancel button pressed', () => {
    (initialMockProps.onCancel as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'c-sedAttachmentSender__cancel-button-id\']').hostNodes().simulate('click')
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
    wrapper = render(<SEDAttachmentSender {...initialMockProps} />)
    expect(wrapper.find(ProgressBar).props().status).toEqual('done')
    expect(initialMockProps.onSaved).toHaveBeenCalledWith(mockSavingAttachmentJob)
    expect(initialMockProps.onFinished).toHaveBeenCalled()
  })
})
