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
  PileDiv, slideInFromBottom,
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import Error from 'pages/Error'
import PT from 'prop-types'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppDispatch, useAppSelector } from 'store'
import styled, { createGlobalStyle } from 'styled-components'
import * as Sentry from '@sentry/browser'
import 'react-pdf/dist/Page/TextLayer.css'; //Needed for text copy/paste from @navikt/forhandsvisningsfil (react-pdf)

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
}

const mapState = (state: State): TopContainerSelector => ({
  bannerStatus: state.alert.bannerStatus,
  bannerMessage: state.alert.bannerMessage,
  error: state.alert.error,
  expirationTime: state.app.expirationTime,
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
    bannerStatus, bannerMessage, error, expirationTime
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
    Sentry.captureEvent({
      message: error.message,
      extra: {
        error
      },
      level: 'error'
    })
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
        <Main
          id='main'
          role='main'
          className={className}
        >
          {children}
        </Main>
        <VerticalSeparatorDiv size='3' />
        <Debug>
          <SessionMonitor
            expirationTime={expirationTime!}
          />
          <Version />
        </Debug>
      </ErrorBoundary>
    </div>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any
}

export default TopContainer
