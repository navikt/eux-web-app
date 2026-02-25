import { alertReset, alertFailure } from 'actions/alert'
import BannerAlert from 'components/BannerAlert/BannerAlert'
import Header from 'components/Header/Header'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Version from 'components/Version/Version'
import { AlertVariant } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import Error from 'pages/Error'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppDispatch, useAppSelector } from 'store'
import styles from "./TopContainer.module.css"

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
