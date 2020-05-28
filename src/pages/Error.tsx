import classNames from 'classnames'
import TopContainer from 'components/TopContainer/TopContainer'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './Error.css'

export interface ErrorProps {
  error?: any;
}

export const Error = ({ error }: ErrorProps) => {
  const { t } = useTranslation()
  const title = t('ui:error-page-title')
  const description = t('ui:error-page-description')
  const footer = t('ui:error-page-footer')

  return (
    <TopContainer className={classNames('p-error')}>
      <div className='p-error__content'>
        <Ui.Nav.Undertittel className='title m-5'>
          {title}
        </Ui.Nav.Undertittel>
        <div className='description' dangerouslySetInnerHTML={{ __html: description }} />
        {error && (
          <Ui.ExpandingPanel
            id='p-error__content-error-id'
            className={classNames('p-error__content-error', 's-border')}
            heading={t('ui:error-header')}
            style={{ minWidth: '50%' }}
          >
            <div className='error' dangerouslySetInnerHTML={{ __html: '<pre>' + error.stack + '</pre>' }} />
          </Ui.ExpandingPanel>
        )}
        {footer && (
          <>
            <div className='line' />
            <Ui.Nav.Normaltekst className='mt-2 footer'>
              {footer}
            </Ui.Nav.Normaltekst>
          </>
        )}
      </div>
    </TopContainer>
  )
}

Error.propTypes = {
  error: PT.any
}

export default Error
