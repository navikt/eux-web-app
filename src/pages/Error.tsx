import Convert from 'ansi-to-html'
import classNames from 'classnames'
import TopContainer from 'components/TopContainer/TopContainer'
import {Accordion, BodyLong, Page, VStack} from '@navikt/ds-react'
import React  from 'react'
import { useTranslation } from 'react-i18next'
import StackTracey from 'stacktracey'
import styles from './Error.module.css'

const convert = new Convert({
  newline: true,
  escapeXML: true,
  fg: '#000'
})

export interface ErrorProps {
  error?: any;
  resetErrorBoundary ?: any
}

export const Error = ({ error }: ErrorProps) => {
  const { t } = useTranslation()
  const title = t('message:error-page-title')
  const description = t('message:error-page-description')
  const footer = t('message:error-page-footer')

  const stack = new StackTracey(error).withSources()
  const msg = convert.toHtml(error.message)

  return (
    <Page>
      <TopContainer title={title} className={classNames('p-error')}>
        <Page.Block width="2xl" as="main">
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
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
            <VStack gap="2">
              <div className={styles.line}/>
              <BodyLong>
                {footer}
              </BodyLong>
            </VStack>
          )}
        </Page.Block>
      </TopContainer>
    </Page>
  )
}

export default Error
