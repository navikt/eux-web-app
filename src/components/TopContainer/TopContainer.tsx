import { clientClear, clientError } from 'actions/alert'
import { closeModal } from 'actions/ui'
import classNames from 'classnames'
import Header from 'components/Header/Header'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Version from 'components/Version/Version'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import useErrorBoundary from 'use-error-boundary'
import Error from 'pages/Error'
import './TopContainer.css'

export interface TopContainerProps {
  className?: string;
  children?: JSX.Element | Array<JSX.Element | null>;
  fluid?: boolean;
  header?: string | JSX.Element;
}

export interface TopContainerSelector {
  serverErrorMessage: string | undefined;
  error: any | undefined;
  expirationTime: Date | undefined;
  highContrast: boolean;
  modal: ModalContent | undefined;
}

const mapState = (state: State): TopContainerSelector => ({
  serverErrorMessage: state.alert.serverErrorMessage,
  error: state.alert.error,
  expirationTime: state.app.expirationTime,
  highContrast: state.ui.highContrast,
  modal: state.ui.modal
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children, fluid = true
}: TopContainerProps): JSX.Element => {
  const {
    serverErrorMessage, error, expirationTime, highContrast, modal
  }: TopContainerSelector = useSelector<State, TopContainerSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { ErrorBoundary } = useErrorBoundary()

  const onClear = (): void => {
    dispatch(clientClear())
  }

  const getServerErrorMessage = (): string | undefined => {
    return serverErrorMessage ? t(serverErrorMessage) : undefined
  }

  if (_.isNil(window.onerror)) {
    window.onerror = (msg) => {
      dispatch(clientError({ error: msg }))
    }
  }

  const handleModalClose = (): void => {
    dispatch(closeModal())
  }

  return (
    <ErrorBoundary
      renderError={({ error }: any) => <Error error={error} />}
    >
      <Header className={classNames({ highContrast: highContrast })} />
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
      <main id='main' role='main' className={classNames(className, '_container', 'p-0', { 'container-fluid': fluid, highContrast: highContrast })}>
        {children}
      </main>
      <SessionMonitor
        expirationTime={expirationTime!}
      />
      <Version />
    </ErrorBoundary>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any
}

export default TopContainer
