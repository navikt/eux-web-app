import RemoveCircle from 'assets/icons/RemoveCircle'
import classNames from 'classnames'
import { AlertError, AlertStatus } from 'declarations/components'
import { AlertErrorPropType } from 'declarations/components.pt'
import _ from 'lodash'
import AlertStripe, { AlertStripeType } from 'nav-frontend-alertstriper'
import { fadeIn } from 'nav-hoykontrast'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'

type AlertStatusClasses = {[status in AlertStatus]: AlertStripeType}

export const AlertDiv = styled(AlertStripe)`
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  border-radius: 0px !important;
  border: 0px !important;
  .alertstripe__tekst {
    display: flex !important;
    justify-content: space-between;
    max-width: none !important;
  }
`
export const CloseIcon = styled(RemoveCircle)`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  cursor: pointer;
`

export interface AlertProps {
  className ?: string
  error?: AlertError | string
  message?: JSX.Element | string
  onClose?: () => void
  status?: AlertStatus
}

export const errorTypes: AlertStatusClasses = {
  OK: 'suksess',
  ERROR: 'feil',
  WARNING: 'advarsel'
}

export const Alert: React.FC<AlertProps> = ({
  className, error, message, onClose, status = 'ERROR'
}: AlertProps): JSX.Element | null => {
  let _message: JSX.Element | string | undefined = message

  const onCloseIconClicked = (): void => {
    if (_.isFunction(onClose)) {
      onClose()
    }
  }

  const printError = (error: AlertError | string): string => {
    const errorMessage: Array<JSX.Element | string> = []
    if (_.isString(error)) {
      return error
    }
    if (error.message) {
      errorMessage.push(error.message)
    }
    if (error.error) {
      errorMessage.push(error.error)
    }
    if (error.uuid) {
      errorMessage.push(error.uuid)
    }
    return errorMessage?.join(' - ') ?? '-'
  }

  if (!_message) {
    return null
  }

  if (!_.includes(Object.keys(errorTypes), status)) {
    console.error('Invalid alert status: ' + status)
    return null
  }

  if (!_.isEmpty(error)) {
    _message += ': ' + printError(error!)
  }

  return (
    <AlertDiv
      className={classNames(
        'status-' + status,
        className
      )}
      role='alert'
      type={errorTypes[status]}
    >
      {_message}
      {onClose && (
        <CloseIcon
          data-test-id='alert__close-icon'
          onClick={onCloseIconClicked}
        />
      )}
    </AlertDiv>
  )
}

Alert.propTypes = {
  className: PT.string,
  error: PT.oneOfType([AlertErrorPropType, PT.string]),
  message: PT.oneOfType([PT.string, PT.element]),
  onClose: PT.func,
  status: PT.oneOf(['OK', 'ERROR', 'WARNING'])
}

Alert.displayName = 'Alert'
export default Alert
