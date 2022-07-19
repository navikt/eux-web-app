import { Container, Content, Margin } from '@navikt/hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import { Alert, Link, Heading } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const UkjentSide: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <TopContainer title={t('app:page-title-unknown')}>
      <Container>
        <Margin />
        <Content>
          <Alert variant='warning'>
            <Heading size='medium'>
              {t('message:error-unknownPage-cantFindRoute', { pathname: window.location.pathname })}
            </Heading>
          </Alert>
          <p>{t('message:error-unknownPage-description')}</p>
          <Link
            href='/'
            aria-label={t('message:error-unknownPage-linkToRoot-ariaLabel')}
          >
            {t('message:error-unknownPage-linkToRoot')}
          </Link>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default UkjentSide
