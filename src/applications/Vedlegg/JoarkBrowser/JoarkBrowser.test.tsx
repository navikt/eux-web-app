import { getJoarkItemPreview, listJoarkItems } from 'actions/joark'
import { JoarkPoster } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockJoark from 'mocks/joark/joark'
import mockJoarkProcessed from 'mocks/joark/joarkAsItems'
import { stageSelector } from 'setupTests'
import { JoarkBrowser, JoarkBrowserProps, JoarkBrowserSelector } from './JoarkBrowser'
import TableSorter from 'tabell'
import _ from 'lodash'

jest.mock('actions/joark', () => ({
  getJoarkItemPreview: jest.fn(),
  listJoarkItems: jest.fn()
}))

const files: Array<JoarkPoster> = _.cloneDeep(mockJoark.data.dokumentoversiktBruker.journalposter)

const defaultSelector: JoarkBrowserSelector = {
  aktoerId: '123',
  list: files,
  loadingJoarkList: false,
  loadingJoarkPreviewFile: false,
  previewFile: undefined
}

describe('components/JoarkBrowser/JoarkBrowser', () => {
  let wrapper: ReactWrapper

  const initialMockProps: JoarkBrowserProps = {
    existingItems: [],
    highContrast: false,
    onRowSelectChange: jest.fn(),
    onPreviewFile: jest.fn(),
    onRowViewDelete: jest.fn(),
    mode: 'view',
    tableId: 'test-table-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
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
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(wrapper.find('WaitingPanel')).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'joarkBrowser\']')).toBeTruthy()
    expect(wrapper.exists(TableSorter)).toBeTruthy()
  })

  it('UseEffect: list Joark files', () => {
    stageSelector(defaultSelector, { list: undefined })
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(listJoarkItems).toHaveBeenCalledWith(defaultSelector.aktoerId)
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
    wrapper = mount(<JoarkBrowser {...initialMockProps} />)
    expect(initialMockProps.onPreviewFile).toHaveBeenCalledWith(mockFile)
    stageSelector(defaultSelector, {})
  })

  it('Handling: calls onRowSelectChange when selecting a row', () => {
    (initialMockProps.onRowSelectChange as jest.Mock).mockReset()
    wrapper = mount(<JoarkBrowser {...initialMockProps} mode='select' />)
    wrapper.find('#c-tableSorter__row-checkbox-id-joark-group-1-joarkbrowser-test-table-id').hostNodes().simulate('change', { target: { checked: true } })

    expect(initialMockProps.onRowSelectChange).toHaveBeenCalledWith(mockJoarkProcessed)
  })

  it('Handling: calls onPreviewItem', () => {
    (getJoarkItemPreview as jest.Mock).mockReset()
    wrapper = mount(<JoarkBrowser {...initialMockProps} mode='select' />)
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
