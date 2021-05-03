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
import NavHighContrast, { themeKeys } from 'nav-hoykontrast'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import useErrorBoundary from 'use-error-boundary'
import Alert from 'components/Alert/Alert'
import Error from 'pages/Error'

const Main = styled.main`
  padding: 0px;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  color: ${({ theme } : any) => theme[themeKeys.MAIN_FONT_COLOR]};
  background-color: ${({ theme } : any) => theme.type === 'themeHighContrast' ? theme[themeKeys.MAIN_BACKGROUND_COLOR] : 'whitesmoke'};
`

const Debug = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  color: #3e3832;
  overflow: hidden;
  margin: 0.5rem;
  padding: 0em 0.5em;
  z-index: 99999;
`
export interface TopContainerProps {
  className?: string
  children?: JSX.Element | Array<JSX.Element | null>
  fluid?: boolean
  header?: string | JSX.Element
}

export interface TopContainerSelector {
  serverErrorMessage: string | undefined
  error: any | undefined
  expirationTime: Date | undefined
  highContrast: boolean
  modal: ModalContent | undefined
}

const mapState = (state: State): TopContainerSelector => ({
  serverErrorMessage: state.alert.serverErrorMessage,
  error: state.alert.error,
  expirationTime: state.app.expirationTime,
  highContrast: state.ui.highContrast,
  modal: state.ui.modal
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children
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
    <NavHighContrast highContrast={highContrast}>
      <ErrorBoundary
        renderError={({ error }: any) => <Error error={error} />}
      >
        <Header
          highContrast={highContrast}
        />
        <Alert
          type='server'
          message={getServerErrorMessage()}
          error={error}
          onClose={onClear}
        />
        {modal !== undefined && (
          <Modal
            highContrast={highContrast}
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
        <Debug>
          <SessionMonitor
            expirationTime={expirationTime!}
          />
          <Version />
        </Debug>
      </ErrorBoundary>
    </NavHighContrast>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any
}

export default TopContainer
