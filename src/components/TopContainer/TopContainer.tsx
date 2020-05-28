import { clientClear, clientError } from 'actions/alert'
import classNames from 'classnames'
import Header from 'components/Header/Header'
import Version from 'components/Version/Version'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
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
  highContrast: boolean;
}

const mapState = (state: State): TopContainerSelector => ({
  serverErrorMessage: state.alert.serverErrorMessage,
  error: state.alert.error,
  highContrast: state.ui.highContrast
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children, fluid = true
}: TopContainerProps): JSX.Element => {
  const {
    serverErrorMessage, error, highContrast
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
      <main id='main' role='main' className={classNames(className, '_container', 'p-0', { 'container-fluid': fluid, highContrast: highContrast })}>
        {children}
      </main>
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
