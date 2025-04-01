import { getJoarkItemPreview, listJoarkItems } from 'actions/attachments'
import { JoarkPoster } from 'declarations/attachments'
import { render } from '@testing-library/react'
import React from 'react'
import mockJoark from 'mocks/attachments/joark'
import mockJoarkProcessed from 'mocks/attachments/joarkAsItems'
import { stageSelector } from 'setupTests'
import { JoarkBrowser, JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'
import TableSorter from '@navikt/tabell'
import _ from 'lodash'

jest.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "abc" } },
  Document: ({ onLoadSuccess = (pdf = { numPages: 4 }) => pdf.numPages }) => {
    return <div>{onLoadSuccess({ numPages: 4 })}</div>;
  },
  Outline: null,
  Page: () => <div>def</div>,
}));

const files: Array<JoarkPoster> = _.cloneDeep(mockJoark.data.dokumentoversiktBruker.journalposter)

const defaultSelector: JoarkBrowserSelector = {
  list: files,
  gettingJoarkList: false,
  gettingJoarkFile: false,
  previewFileRaw: undefined
}

describe('components/JoarkBrowser/JoarkBrowser', () => {
  let wrapper: any

  const initialMockProps: JoarkBrowserProps = {
    existingItems: [],
    fnr: '123',
    onRowSelectChange: jest.fn(),
    onPreviewFile: jest.fn(),
    mode: 'view',
    tableId: 'test-table-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<JoarkBrowser {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: loading', () => {
    stageSelector(defaultSelector, { loadingJoarkList: true })
    wrapper = render(<JoarkBrowser {...initialMockProps} />)
    expect(wrapper.find('WaitingPanel')).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-testid=\'joarkBrowser\']')).toBeTruthy()
    expect(wrapper.exists(TableSorter)).toBeTruthy()
  })

  it('UseEffect: list Joark files', () => {
    stageSelector(defaultSelector, { list: undefined })
    wrapper = render(<JoarkBrowser {...initialMockProps} />)
    expect(listJoarkItems).toHaveBeenCalledWith(initialMockProps.fnr)
  })

  it('UseEffect: when new preview file is available, trigger it', () => {
    const mockFile = {
      name: 'file.txt',
      dokumentInfoId: '123',
      journalpostId: '123',
      variant: 'foo',
      content: {
        base64: '1232341234234'
      }
    }
    stageSelector(defaultSelector, { previewFile: mockFile })
    wrapper = render(<JoarkBrowser {...initialMockProps} />)
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
    stageSelector(defaultSelector, {})
  })

  it('Handling: calls onRowSelectChange when selecting a row', () => {
    (initialMockProps.onRowSelectChange as jest.Mock).mockReset()
    wrapper = render(<JoarkBrowser {...initialMockProps} mode='select' />)
    wrapper.find('#c-tableSorter__row-checkbox-id-joark-group-1-joarkbrowser-test-table-id').hostNodes().simulate('change', { target: { checked: true } })

    expect(initialMockProps.onRowSelectChange).toHaveBeenCalledWith(mockJoarkProcessed)
  })

  it('Handling: calls onPreviewItem', () => {
    (getJoarkItemPreview as jest.Mock).mockReset()
    wrapper = render(<JoarkBrowser {...initialMockProps} mode='select' />)
    wrapper.find('#c-tablesorter__preview-button-458208506-475715315').hostNodes().simulate('click')
    expect(getJoarkItemPreview).toHaveBeenCalledWith(expect.objectContaining({
      date: new Date('2019-10-01T03:11:34.000Z'),
      disabled: false,
      dokumentInfoId: '475715315',
      hasSubrows: false,
      journalpostId: '458208506',
      key: '458208506-475715315-ARKIV-false',
      selected: false,
      tema: 'AAP',
      title: 'Vedtak om arbeidsavklaringspenger',
      type: 'joark',
      variant: {
        filnavn: null,
        variantformat: 'ARKIV'
      },
      visible: true
    }))
  })
})
