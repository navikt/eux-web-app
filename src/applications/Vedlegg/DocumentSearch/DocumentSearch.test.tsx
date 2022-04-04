
import { render } from '@testing-library/react'
import React from 'react'
import { stageSelector } from 'setupTests'
import DocumentSearch, { DocumentSearchProps, DocumentSearchSelector } from './DocumentSearch'

describe('components/DocumentSearch/DocumentSearch', () => {
  let wrapper: any
  const initialMockProps: DocumentSearchProps = {
    parentNamespace: 'test',
    className: 'mockClassname',
    resetValidation: jest.fn(),
    validation: {}
  }

  const defaultSelector: DocumentSearchSelector = {
    dokument: undefined,
    gettingDokument: false,
    rinasaksnummer: 'undefined',
    rinadokumentID: undefined
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = render(<DocumentSearch {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: HTML structure', () => {
    expect(wrapper.exists('div.dokumentsok')).toBeTruthy()
  })
})
