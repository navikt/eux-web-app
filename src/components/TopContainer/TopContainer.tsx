import { clientClear, clientError } from 'actions/alert'
import { closeModal } from 'actions/ui'
import classNames from 'classnames'
import Header from 'components/Header/Header'
import Modal from 'components/Modal/Modal'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Version from 'components/Version/Version'
import { State } from 'declarations/reducers'
import { ModalContent } from 'declarations/components'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import useErrorBoundary from 'use-error-boundary'
import Alert from 'components/Alert/Alert'
import Error from 'pages/Error'

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

const Main = styled.main`
  padding: 0px;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`
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
      <Header
        className={classNames({ highContrast: highContrast })}
      />
      <Alert
        type='server'
        message={getServerErrorMessage()}
        error={error}
        onClose={onClear}
      />
      {modal !== undefined && (
        <Modal
          appElement={(document.getElementById('main') || document.body)}
          modal={modal}
          onModalClose={handleModalClose}
        />
      )}
      <Main
        id='main'
        role='main'
        className={classNames(className, { highContrast: highContrast })}
      >
        {children}
      </Main>
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
