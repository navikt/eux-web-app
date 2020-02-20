import { clientClear, clientError } from 'actions/alert'
import { closeModal, toggleHighContrast } from 'actions/ui'
import classNames from 'classnames'
import Header from 'components/Header/Header'
import Ui from 'eessi-pensjon-ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import './TopContainer.css'

export interface TopContainerProps {
  className?: string;
  children?: JSX.Element | Array<JSX.Element | null>;
  fluid?: boolean;
  header?: string | JSX.Element;
}

export interface TopContainerSelector {
  clientErrorStatus: string | undefined;
  clientErrorMessage: string | undefined;
  serverErrorMessage: string | undefined;
  error: any | undefined;
  modal: ModalContent | undefined;
  highContrast: boolean;
}

const mapState = (state: State): TopContainerSelector => ({
  clientErrorStatus: state.alert.clientErrorStatus,
  clientErrorMessage: state.alert.clientErrorMessage,
  serverErrorMessage: state.alert.serverErrorMessage,
  error: state.alert.error,
  modal: state.ui.modal,
  highContrast: state.ui.highContrast
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children, fluid = true, header
}: TopContainerProps): JSX.Element => {
  const {
    clientErrorMessage, clientErrorStatus, serverErrorMessage, error, modal, highContrast
  } = useSelector(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const handleModalClose = (): void => {
    dispatch(closeModal())
  }

  const onClear = (): void => {
    dispatch(clientClear())
  }

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  const getClientErrorMessage = (): string | null => {
    if (!clientErrorMessage) {
      return null
    }
    const separatorIndex: number = clientErrorMessage.lastIndexOf('|')
    let message: string
    if (separatorIndex >= 0) {
      message = t(clientErrorMessage.substring(0, separatorIndex)) + ': ' + clientErrorMessage.substring(separatorIndex + 1)
    } else {
      message = t(clientErrorMessage)
    }
    return message
  }

  const getServerErrorMessage = (): string | undefined => {
    return serverErrorMessage ? t(serverErrorMessage) : undefined
  }

  if (_.isNil(window.onerror)) {
    window.onerror = (msg) => {
      dispatch(clientError({ error: msg }))
    }
  }

  return (
    <>
      <Header className={classNames({ highContrast: highContrast })}>
        {header ? (
          <Ui.Banner
            header={header}
            onHighContrastClicked={handleHighContrastToggle}
            labelHighContrast={t('ui:highContrast')}
          />) : null}
        <Ui.Alert
          type='client'
          message={getClientErrorMessage()}
          status={clientErrorStatus}
          error={error}
          onClose={onClear}
        />
        <Ui.Alert
          type='server'
          message={getServerErrorMessage()}
          error={error}
          onClose={onClear}
        />
        {modal !== undefined ? (
          <Ui.Modal
            appElement={(document.getElementById('main') || document.body)}
            modal={modal}
            onModalClose={handleModalClose}
          />
        ) : null}
      </Header>
      <main id='main' role='main' className={classNames(className, '_container', 'p-0', { 'container-fluid': fluid, highContrast: highContrast })}>
        {children}
      </main>
    </>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any
}

export default TopContainer
