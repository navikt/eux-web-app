import Convert from 'ansi-to-html'
import classNames from 'classnames'
import TopContainer from 'components/TopContainer/TopContainer'
import { standardLogger } from 'metrics/loggers'
import { Accordion, BodyLong } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import StackTracey from 'stacktracey'
import styled from 'styled-components'

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
    standardLogger('errorpage.view')
  }, [])

  const stack = new StackTracey(error).withSources()
  const msg = convert.toHtml(error.message)

  return (
    <TopContainer title={title} className={classNames('p-error')}>
      <Content>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
        {error && (
          <Accordion>
            <Accordion.Item defaultOpen>
              <Accordion.Header>{t('message:error-header')}</Accordion.Header>
              <Accordion.Content>
                <div style={{ whiteSpace: 'break-spaces' }} dangerouslySetInnerHTML={{ __html: msg }} />
                {stack.items?.map((e: any, i) => (
                  <div key={'' + i}>{e?.beforeParse}</div>
                ))}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        )}
        {footer && (
          <>
            <Line />
            <VerticalSeparatorDiv size='0.5' />
            <BodyLong>
              {footer}
            </BodyLong>
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
