import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import ExpandingPanel, { ExpandingPanelDiv, ExpandingPanelProps } from './ExpandingPanel'

describe('components/ExpandingPanel/ExpandingPanel', () => {
  let wrapper: ReactWrapper

  const initialMockProps: ExpandingPanelProps = {
    ariaTittel: 'mockAriaTittel',
    border: true,
    collapseProps: {
      id: 'mockId'
    },
    children: <div />,
    heading: <h2>heading</h2>,
    highContrast: false,
    onClose: jest.fn(),
    onOpen: jest.fn(),
    open: false,
    renderContentWhenClosed: false
  }

  beforeEach(() => {
    wrapper = mount(<ExpandingPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(ExpandingPanelDiv)).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'c-expandingpanel__head-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'c-expandingpanel__body-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'c-expandingpanel__button-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'c-expandingpanel__content-id\']')).toBeTruthy()
  })

  it('Handling: opens when clicked', () => {
    expect(wrapper.exists('.ekspanderbartPanel--apen')).toBeFalsy()
    expect(wrapper.exists('.ekspanderbartPanel--lukket')).toBeTruthy()
    wrapper.find('.ekspanderbartPanel__knapp').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.exists('.ekspanderbartPanel--lukket')).toBeFalsy()
    expect(wrapper.exists('.ekspanderbartPanel--apen')).toBeTruthy()
  })
})
