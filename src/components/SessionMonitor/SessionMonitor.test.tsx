import { openModal } from 'actions/ui'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import SessionMonitor, { SessionMonitorProps } from './SessionMonitor'

jest.mock('actions/ui', () => ({
  openModal: jest.fn(),
  closeModal: jest.fn()
}))

describe('components/SessionMonitor/SessionMonitor', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SessionMonitorProps = {
    expirationTime: new Date(2020, 1, 1)
  }

  it('Renders', () => {
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:24:10')
    wrapper = mount(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={9900}
        sessionExpiredReload={1000}
        {...initialMockProps}
      />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('SessionMonitor will trigger a openModal when session is almost expiring', async () => {
    // expires in 5 seconds - will check every 0.5s - warnings start at 9.9s - reload only happens under 1s
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:24:05')
    wrapper = mount(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={9900}
        sessionExpiredReload={1000}
        {...initialMockProps}
      />)
    expect(openModal).not.toHaveBeenCalled()
    return new Promise(resolve => {
      setTimeout(() => {
        expect(openModal).toHaveBeenCalled()
        resolve(true)
      }, 1000)
    })
  })

  it('SessionMonitor will trigger a openModal when session expired', async () => {
    // expires in 1 seconds - will check every 0.5s - warnings start at 0.9s - reload happens under 10s
    (window.location.reload as jest.Mock).mockReset()
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:23:59')
    wrapper = mount(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={900}
        sessionExpiredReload={10000}
        {...initialMockProps}
      />)
    return new Promise(resolve => {
      setTimeout(() => {
        expect(window.location.reload).toHaveBeenCalled();
        (window.location.reload as jest.Mock).mockRestore()
        resolve(true)
      }, 1000)
    })
  })
})
