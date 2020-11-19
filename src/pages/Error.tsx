import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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

export interface ErrorPageSelector {
  highContrast: boolean
}

const mapState = (state: State): ErrorPageSelector => ({
  highContrast: state.ui.highContrast
})

export interface ErrorProps {
  error?: any;
}

export const Error = ({ error }: ErrorProps) => {
  const { t } = useTranslation()
  const title = t('ui:error-page-title')
  const description = t('ui:error-page-description')
  const footer = t('ui:error-page-footer')
  const { highContrast } = useSelector<State, ErrorPageSelector>(mapState)

  return (
    <TopContainer className={classNames('p-error')}>
      <Content>
        <Title>
          {title}
        </Title>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
        {error && (
          <Panel
            highContrast={highContrast}
            data-test-id='p-error__content-error-id'
            className={classNames('p-error__content-error', 's-border')}
            heading={t('ui:error-header')}
          >
            <div dangerouslySetInnerHTML={{ __html: '<pre>' + error.stack + '</pre>' }} />
          </Panel>
        )}
        {footer && (
          <>
            <Line />
            <VerticalSeparatorDiv data-size='0.5' />
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
