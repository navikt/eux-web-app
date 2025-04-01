import { render } from '@testing-library/react'
import joarkBrowserItems from 'mocks/attachments/items'
import React from 'react'
import { stageSelector } from 'setupTests'
import SEDAttachmentModal, { SEDAttachmentModalProps } from './SEDAttachmentModal'

jest.mock('applications/Vedlegg/JoarkBrowser/JoarkBrowser', () => {
  return () => <div data-testid='mock-joarkbrowser' />
})

jest.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "abc" } },
  Document: ({ onLoadSuccess = (pdf = { numPages: 4 }) => pdf.numPages }) => {
    return <div>{onLoadSuccess({ numPages: 4 })}</div>;
  },
  Outline: null,
  Page: () => <div>def</div>,
}));

const defaultSelector = {
  clientErrorParam: undefined,
  stripeStatus: undefined,
  stripeMessage: undefined,
  bannerMessage: undefined,
  error: undefined
}

describe('components/SEDAttachmentModal', () => {
  let wrapper: any

  const initialMockProps: SEDAttachmentModalProps = {
    open: true,
    fnr: '123',
    onFinishedSelection: jest.fn(),
    onModalClose: jest.fn(),
    sedAttachments: joarkBrowserItems,
    tableId: 'test-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<SEDAttachmentModal {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-testid=\'c-sedattachmentmodal__joarkbrowser-id\']')).toBeTruthy()
  })

  it('Render: show alert inside modal if there is an error', () => {
    stageSelector(defaultSelector, {
      stripeStatus: 'error',
      stripeMessage: 'something'
    })
    wrapper = render(<SEDAttachmentModal {...initialMockProps} />)
    expect(wrapper.exists('[data-testid=\'mock-c-alert\']')).toBeTruthy()
  })
})
