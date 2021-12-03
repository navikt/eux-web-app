import { ErrorFilled } from '@navikt/ds-icons'
import classNames from 'classnames'
import { fadeIn } from 'nav-hoykontrast'
import { AlertError, AlertVariant } from 'declarations/components'
import { AlertErrorPropType } from 'declarations/components.pt'
import _ from 'lodash'
import { Alert } from '@navikt/ds-react'
import PT from 'prop-types'
import styled from 'styled-components'

export const AlertDiv = styled(Alert)`
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
export const CloseIcon = styled(ErrorFilled)`
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
  variant: AlertVariant | undefined
  style ?: any
}

export const AlertFC: React.FC<AlertProps> = ({
                                                className, error, message, onClose, variant, style = {}
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
    return errorMessage.join(' - ')
  }

  if (!_message || !variant) {
    return null
  }

  if (!_.isEmpty(error)) {
    _message += ': ' + printError(error!)
  }

  return (
    <AlertDiv
      className={classNames(
        'status-' + variant,
        className
      )}
      style={style}
      role='alert'
      variant={variant}
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

AlertFC.propTypes = {
  className: PT.string,
  error: PT.oneOfType([AlertErrorPropType, PT.string]),
  message: PT.oneOfType([PT.string, PT.element]),
  onClose: PT.func,
  variant: PT.oneOf(['info', 'success', 'error', 'warning'])
}

export default AlertFC
