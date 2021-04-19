import { mount, ReactWrapper } from 'enzyme'
import joarkBrowserItems from 'mocks/joark/items'
import React from 'react'
import { stageSelector } from 'setupTests'
import SEDAttachmentModal, { SEDAttachmentModalProps } from './SEDAttachmentModal'

jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div data-test-id='mock-joarkbrowser' />
})

jest.mock('components/Alert/Alert', () => {
  return () => <div data-test-id='mock-c-alert' />
})

const defaultSelector = {
  clientErrorParam: undefined,
  clientErrorStatus: undefined,
  clientErrorMessage: undefined,
  serverErrorMessage: undefined,
  error: undefined
}

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  let wrapper: ReactWrapper

  const initialMockProps: SEDAttachmentModalProps = {
    highContrast: false,
    onFinishedSelection: jest.fn(),
    onModalClose: jest.fn(),
    sedAttachments: joarkBrowserItems,
    tableId: 'test-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<SEDAttachmentModal {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedattachmentmodal__joarkbrowser-id\']')).toBeTruthy()
  })

  it('Render: show alert inside modal if there is an error', () => {
    stageSelector(defaultSelector, {
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'something'
    })
    wrapper = mount(<SEDAttachmentModal {...initialMockProps} />)
    expect(wrapper.exists('[data-test-id=\'mock-c-alert\']')).toBeTruthy()
  })
})
