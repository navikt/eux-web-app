import { XMarkOctagonFillIcon } from '@navikt/aksel-icons'
import classNames from 'classnames'
import { AlertError, AlertVariant } from 'declarations/components'
import _ from 'lodash'
import { Alert } from '@navikt/ds-react'
import React from 'react'
import styles from './BannerAlert.module.css'

export interface BannerAlertProps {
  className ?: string
  error?: AlertError | string
  message?: JSX.Element | string
  onClose?: () => void
  variant: AlertVariant
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
    <Alert
      className={classNames(styles.bannerAlert, 'status-' + variant, className)}
      style={style}
      role='alert'
      variant={variant}
    >
      {_message}
      {onClose && (
        <XMarkOctagonFillIcon
          className={styles.closeIcon}
          fontSize="1.5rem"
          data-testid='c-alert--close-icon'
          onClick={onCloseIconClicked}
        />
      )}
    </Alert>
  )
}

export default BannerAlert
