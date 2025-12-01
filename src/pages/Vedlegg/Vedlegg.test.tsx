import { render } from '@testing-library/react'
import React from 'react'
import { stageSelector } from 'setupTests'
import Vedlegg, { VedleggSelector } from './Vedlegg'

jest.mock('react-router-dom', () => ({
  Link: () => (<div className='mock-link' />)
}))

jest.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "abc" } },
  Document: ({ onLoadSuccess = (pdf = { numPages: 4 }) => pdf.numPages }) => {
    return <div>{onLoadSuccess({ numPages: 4 })}</div>;
  },
  Outline: null,
  Page: () => <div>def</div>,
}));

describe('pages/Vedlegg', () => {
  let wrapper: any

  const defaultSelector: VedleggSelector = {
    alertType: undefined,
    alertMessage: undefined,
    vedleggResponse: undefined,
    rinasaksnummer: undefined,
    rinadokumentID: undefined,
    validation: {}
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = render(<Vedlegg />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('HTML structure', () => {
    expect(wrapper.exists('.vedlegg')).toBeTruthy()
  })
})
