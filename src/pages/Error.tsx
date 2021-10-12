import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import PT from 'prop-types'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import StackTracey from 'stacktracey'
import styled from 'styled-components'
import { standardLogger } from 'metrics/loggers'
import Convert from 'ansi-to-html'

const convert = new Convert({
  newline: true,
  escapeXML: true,
  fg: '#000'
})

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Description = styled.div`
  width: 80%;
  margin: 1rem;
  text-align: center;
`
const Title = styled(Undertittel)`
  margin: 1.5rem;
`
const Panel = styled(ExpandingPanel)`
  border: 1px solid gray;
  min-width: 50%;
`
const Line = styled.div`
  width: 60%;
  margin: 1rem;
  min-height: 0.25rem;
  border-bottom: 1px solid #78706A;
`

export interface ErrorProps {
  error?: any;
  resetErrorBoundary ?: any
}

export const Error = ({ error }: ErrorProps) => {
  const { t } = useTranslation()
  const title = t('message:error-page-title')
  const description = t('message:error-page-description')
  const footer = t('message:error-page-footer')

  useEffect(() => {
    standardLogger('.errorpage.view')
  }, [])

  const stack = new StackTracey(error).withSources()
  const msg = convert.toHtml(error.message)

  return (
    <TopContainer className={classNames('p-error')}>
      <Content>
        <Title>
          {title}
        </Title>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
        {error && (
          <Panel
            open
            data-test-id='p-error__content-error-id'
            className={classNames('p-error__content-error', 's-border')}
            heading={t('message:error-header')}
          >
            <>
              <div style={{ whiteSpace: 'break-spaces' }} dangerouslySetInnerHTML={{ __html: msg }} />
              {stack.items?.map((e: any, i) => (
                <div key={'' + i}>{e?.beforeParse}</div>
              ))}
            </>
          </Panel>
        )}
        {footer && (
          <>
            <Line />
            <VerticalSeparatorDiv size='0.5' />
            <Normaltekst>
              {footer}
            </Normaltekst>
          </>
        )}
      </Content>
    </TopContainer>
  )
}

Error.propTypes = {
  error: PT.any
}

export default Error
