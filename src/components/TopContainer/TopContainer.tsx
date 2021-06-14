import { clientClear, clientError } from 'actions/alert'
import { closeModal } from 'actions/ui'
import classNames from 'classnames'
import Alert from 'components/Alert/Alert'
import Header from 'components/Header/Header'
import Modal from 'components/Modal/Modal'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Version from 'components/Version/Version'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import NavHighContrast, {
  fadeIn,
  PileDiv, slideInFromBottom,
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
  themeKeys
} from 'nav-hoykontrast'
import Error from 'pages/Error'
import PT from 'prop-types'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  color: ${({ theme } : any) => theme[themeKeys.MAIN_FONT_COLOR]};
  background: ${({ theme } : any) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Source Sans Pro', Arial, sans-serif;
}
#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.nolabel {
  margin-top: 1.8rem;
}
.fadeIn {
  opacity: 0;
  animation: ${fadeIn} 0.25s forwards;
}
.slideInFromLeft {
  opacity: 0;
  transform: translateX(-20px);
  animation: ${slideInFromLeft(20)} 0.3s forwards;
}
.slideInFromRight {
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight(20)} 0.3s forwards;
}
.slideInFromTop {
  opacity: 0;
  transform: translateY(-20px);
  animation: ${slideInFromTop(20)} 0.3s forwards;
}
.slideInFromBottom {
  opacity: 0;
  transform: translateY(20px);
  animation: ${slideInFromBottom(20)} 0.3s forwards;
}
`
const Main = styled(PileDiv)`
  padding: 0px;
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

  const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <Error error={error} resetErrorBoundary={resetErrorBoundary} />
  )

  return (
    <NavHighContrast highContrast={highContrast}>
      <GlobalStyle />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Header
          highContrast={highContrast}
        />
        <Alert
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
