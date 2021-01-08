import { AlertErrorPropType } from 'declarations/components.pt'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import classNames from 'classnames'
import { fadeIn } from 'nav-hoykontrast'
import { AlertError, AlertStatus } from 'declarations/components'
import _ from 'lodash'
import AlertStripe, { AlertStripeType } from 'nav-frontend-alertstriper'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'

type AlertStatusClasses = {[status in AlertStatus]: AlertStripeType}

type AlertType = 'client' | 'server'

const AlertDiv = styled(AlertStripe)`
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards;
  position: relative;

  .alertstripe__tekst {
     flex: auto !important; /* because IE11 */
     margin: auto 0;
     max-width: 100vw;
     display: flex;
     justify-content: space-between;
  }
  .fixed {
    position: fixed;
    top: 0.25rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .closeIcon {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    cursor: pointer;
  }
  .type-server {
    border-radius: 0px !important;
    border: 0px !important;
    .alertstripe__tekst {
      display: flex !important;
      justify-content: space-between;
      max-width: none !important;
    }
  }
`

export const CloseIcon = styled(FilledRemoveCircle)`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  cursor: pointer;
`

export interface AlertProps {
  className ?: string
  error?: AlertError | string
  fixed?: boolean
  message?: JSX.Element | string
  onClose?: () => void
  status?: AlertStatus
  type?: AlertType
}

export const errorTypes: AlertStatusClasses = {
  OK: 'suksess',
  ERROR: 'feil',
  WARNING: 'advarsel'
}

export const Alert: React.FC<AlertProps> = ({
  className, error, fixed, message, onClose, status = 'ERROR', type
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
    /* if (error.status) {
      errorMessage.push(error.status)
    } */
    if (error.message) {
      errorMessage.push(error.message)
    }
    if (error.error) {
      errorMessage.push(error.error)
    }
    if (error.uuid) {
      errorMessage.push(error.uuid)
    }
    return errorMessage.join(' - ')
  }

  if (!_message) {
    return null
  }

  if (!_.includes(['client', 'server'], type)) {
    console.error('Invalid alert type: ' + type)
    return null
  }

  if (!_.includes(Object.keys(errorTypes), status)) {
    console.error('Invalid alert status: ' + status)
    return null
  }

  if (!_.isEmpty(error)) {
    _message += ': ' + printError(error!)
  }

  const _fixed: boolean = _.isNil(fixed) ? type === 'client' : fixed
  return (
    <AlertDiv
      className={classNames(
        'type-' + type,
        'status-' + status,
        className,
        { fixed: _fixed }
      )}
      role='alert'
      type={errorTypes[status]}
    >
      {_message}
      {onClose && (
        <CloseIcon
          data-test-id='c-alert__close-icon'
          onClick={onCloseIconClicked}
        />
      )}
    </AlertDiv>
  )
}

Alert.propTypes = {
  className: PT.string,
  error: PT.oneOfType([AlertErrorPropType, PT.string]),
  fixed: PT.bool,
  message: PT.oneOfType([PT.string, PT.element]),
  onClose: PT.func,
  status: PT.oneOf(['OK', 'ERROR', 'WARNING']),
  type: PT.oneOf(['client', 'server'])
}

Alert.displayName = 'Alert'
export default Alert
