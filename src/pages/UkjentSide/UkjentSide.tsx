import { Container, Content, Margin } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import { Alert, Link, Heading } from '@navikt/ds-react'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const UkjentSide: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const location = useLocation()
  return (
    <TopContainer title={t('app:page-title-unknown')}>
      <Container>
        <Margin />
        <Content>
          <Alert variant='warning'>
            <Heading size='medium'>
              {t('message:error-unknownPage-cantFindRoute', { pathname: location.pathname })}
            </Heading>
          </Alert>
          <p>{t('message:error-unknownPage-description')}</p>
          <Link
            href='/'
            ariaLabel={t('message:error-unknownPage-linkToRoot-ariaLabel')}
          >
            {t('message:error-unknownPage-linkToRoot')}
          </Link>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

UkjentSide.propTypes = {
  location: PT.any.isRequired
}

export default UkjentSide
