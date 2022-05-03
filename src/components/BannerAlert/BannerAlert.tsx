import { ErrorFilled } from '@navikt/ds-icons'
import classNames from 'classnames'
import { fadeIn, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { AlertError, AlertVariant } from 'declarations/components'
import _ from 'lodash'
import { Alert } from '@navikt/ds-react'
import React from 'react'
import styled from 'styled-components'
import PT from 'prop-types'
import { AlertErrorPropType } from 'declarations/components.pt'

export const AlertDiv = styled(Alert)`
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  border-radius: 0px !important;
  border: 0px !important;
  .navds-alert__wrapper {
    display: flex !important;
  }
`
export const CloseIcon = styled(ErrorFilled)`
  cursor: pointer;
`

export interface BannerAlertProps {
  className ?: string
  error?: AlertError | string
  message?: JSX.Element | string
  onClose?: () => void
  variant: AlertVariant | undefined
  style ?: any
}

export const BannerAlert: React.FC<BannerAlertProps> = ({
  className, error, message, onClose, variant, style = {}
}: BannerAlertProps): JSX.Element | null => {
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
      data-testid='c-BannerAlert'
      className={classNames('status-' + variant, className)}
      style={style}
      role='alert'
      variant={variant}
    >
      {_message}
      {onClose && (
        <div>
          <HorizontalSeparatorDiv />
          <CloseIcon
            height='24'
            width='24'
            data-testid='c-BannerAlert__CloseIcon'
            onClick={onCloseIconClicked}
          />
        </div>
      )}
    </AlertDiv>
  )
}

BannerAlert.propTypes = {
  className: PT.string,
  error: PT.oneOfType([AlertErrorPropType, PT.string]),
  message: PT.oneOfType([PT.string, PT.element]),
  onClose: PT.func,
  variant: PT.oneOf(['info', 'success', 'error', 'warning'])
}

export default BannerAlert
