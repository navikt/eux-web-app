import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import ExpandingPanel, { ExpandingPanelProps } from './ExpandingPanel'

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
    onClick: jest.fn(),
    open: false,
    renderContentWhenClosed: false
  }

  beforeEach(() => {
    wrapper = mount(<ExpandingPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.find('.c-expandingpanel')).toBeTruthy()
    expect(wrapper.find('.ekspanderbartPanel__hode')).toBeTruthy()
    expect(wrapper.find('.ekspanderbartPanel__flex-wrapper')).toBeTruthy()
    expect(wrapper.find('.ekspanderbartPanel__knapp')).toBeTruthy()
    expect(wrapper.find('article.ekspanderbartPanel__innhold')).toBeTruthy()
  })

  it('Opens', () => {
    expect(wrapper.exists('.ekspanderbartPanel--apen')).toBeFalsy()
    expect(wrapper.exists('.ekspanderbartPanel--lukket')).toBeTruthy()
    wrapper.find('.ekspanderbartPanel__knapp').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.exists('.ekspanderbartPanel--lukket')).toBeFalsy()
    expect(wrapper.exists('.ekspanderbartPanel--apen')).toBeTruthy()
  })
})
