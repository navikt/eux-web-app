
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import DocumentSearch, { DocumentSearchProps, DocumentSearchSelector } from './DocumentSearch'

describe('components/DocumentSearch/DocumentSearch', () => {
  let wrapper: ReactWrapper
  const initialMockProps: DocumentSearchProps = {
    parentNamespace: 'test',
    className: 'mockClassname',
    onDocumentFound: jest.fn(),
    onRinaSaksnummerChanged: jest.fn(),
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
    wrapper = mount(<DocumentSearch {...initialMockProps} />)
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
