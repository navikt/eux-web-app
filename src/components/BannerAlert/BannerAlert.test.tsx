import { AlertError, AlertVariant } from 'declarations/components'
import { screen, fireEvent, render } from '@testing-library/react'
import React from 'react'
import BannerAlert, { BannerAlertProps } from './BannerAlert'

describe('components/BannerAlert/BannerAlert', () => {

  const initialMockProps: BannerAlertProps = {
    variant: 'success',
    message: 'mockErrorMessage',
    error: undefined,
    onClose: jest.fn()
  }

  it('Render: match snapshot', () => {
    render(<BannerAlert {...initialMockProps} />)
    expect(screen.getByTestId('c-BannerAlert')).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    render(<BannerAlert {...initialMockProps} />)
    expect(screen.getByTestId('c-BannerAlert')).toBeInTheDocument()
  })

  it('Render: has proper HTML structure with error message', () => {
    render(<BannerAlert {...initialMockProps} error='mockError' />)
    expect(screen.getByTestId('c-BannerAlert')).toHaveTextContent('mockErrorMessage: mockError')
  })

  it('Render: has proper HTML structure as client in OK type', () => {
    const {container} = render(<BannerAlert {...initialMockProps} />)
    expect(container.querySelector('.navds-alert--success')).toBeInTheDocument()
  })

  it('Render: has proper HTML structure as client in WARNING type', () => {
    const {container} = render(<BannerAlert {...initialMockProps} variant='warning' />)
    expect(container.querySelector('.navds-alert--warning')).toBeInTheDocument()
  })

  it('Render: has proper HTML structure as client in ERROR type', () => {
    const {container} = render(<BannerAlert {...initialMockProps} variant='error' />)
    expect(container.querySelector('.navds-alert--error')).toBeInTheDocument()
  })

  it('Render: Pretty prints a error message', () => {
    const error: AlertError = {
      status: 'error' as AlertVariant,
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    const {container} = render(<BannerAlert {...initialMockProps} error={error} />)
    expect(screen.getByTestId('c-BannerAlert')).toHaveTextContent('mockErrorMessage: message - error - uuid')
  })

  it('Render: Pretty prints a string error', () => {
    const error: string = 'error'
    const {container}  = render(<BannerAlert {...initialMockProps} error={error} />)
    expect(screen.getByTestId('c-BannerAlert')).toHaveTextContent('mockErrorMessage: error')
  })

  it('Handling: close button clears alert', () => {
    (initialMockProps.onClose as jest.Mock).mockReset()
    render(<BannerAlert {...initialMockProps} variant='error' />)
    fireEvent.click(screen.getByTestId('c-BannerAlert__CloseIcon'))
    expect(initialMockProps.onClose).toHaveBeenCalled()
  })
})
