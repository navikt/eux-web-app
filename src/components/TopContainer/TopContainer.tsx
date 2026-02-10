import { alertReset, alertFailure } from 'actions/alert'
import BannerAlert from 'components/BannerAlert/BannerAlert'
import Header from 'components/Header/Header'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Version from 'components/Version/Version'
import { AlertVariant } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import {
  fadeIn,
  slideInFromBottom,
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from '@navikt/hoykontrast'
import Error from 'pages/Error'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppDispatch, useAppSelector } from 'store'
import { createGlobalStyle } from 'styled-components'
import styles from "./TopContainer.module.css"


const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  color: var(--a-text-default);
  background: var(--a-bg-subtle);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  --ac-button-secondary-bg: white;
}
.nolabel {
  margin-top: 2rem !important;
}

.nolabel2 {
  margin-top: 1.5rem !important;
}

.hide {
  position: absolute;
  margin-left: -10000px;
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

#joarkBrowser .navds-button--tertiary:hover, #attachmentsFromRina .navds-button--tertiary:hover {
  background-color: var(--a-surface-transparent);
}

#neessiModal div{
  user-select:text !important;
  cursor: default !important;
}
`

export interface TopContainerProps {
  className?: string
  children?: JSX.Element | Array<JSX.Element | null>
  backButton ?: boolean
  fluid?: boolean
  header?: string | JSX.Element
  onGoBackClick ?: () => void
  unsavedDoc ?: boolean
  title: string
}

export interface TopContainerSelector {
  bannerStatus: string | undefined
  bannerMessage: string | JSX.Element | undefined
  error: any | undefined
  expirationTime: number | undefined
  sessionEndsAt: number | undefined
}

const mapState = (state: State): TopContainerSelector => ({
  bannerStatus: state.alert.bannerStatus,
  bannerMessage: state.alert.bannerMessage,
  error: state.alert.error,
  expirationTime: state.app.expirationTime,
  sessionEndsAt: state.app.sessionEndsAt,
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className,
  backButton,
  onGoBackClick,
  unsavedDoc,
  children,
  title
}: TopContainerProps): JSX.Element => {
  const {
    bannerStatus, bannerMessage, error, expirationTime, sessionEndsAt
  }: TopContainerSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const onClear = (): void => {
    dispatch(alertReset())
  }

  if (_.isNil(window.onerror)) {
    window.onerror = (msg: string | Event) => {
      dispatch(alertFailure(msg as string))
    }
  }

  const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
    return (
      <Error error={error} resetErrorBoundary={resetErrorBoundary} />
    )
  }

  return (
    <div>
      <GlobalStyle />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Header
          title={title}
          backButton={backButton}
          onGoBackClick={onGoBackClick}
          unsavedDoc={unsavedDoc}
        />
        <BannerAlert
          message={bannerMessage}
          variant={bannerStatus as AlertVariant}
          error={error}
          onClose={onClear}
        />
        <main
          id='main'
          role='main'
          className={className}
        >
          {children}
        </main>
        <div className={styles.debugContainer}>
          <SessionMonitor
            expirationTime={expirationTime!}
            sessionEndsAt={sessionEndsAt!}
          />
          <Version />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default TopContainer
