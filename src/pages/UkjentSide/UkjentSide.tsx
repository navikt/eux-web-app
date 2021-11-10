import { Container, Content, Margin } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Systemtittel } from 'nav-frontend-typografi'
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
          <Alertstripe type='advarsel'>
            <Systemtittel>
              {t('message:error-unknownPage-cantFindRoute', { pathname: location.pathname })}
            </Systemtittel>
          </Alertstripe>
          <p>{t('message:error-unknownPage-description')}</p>
          <Lenke href='/' ariaLabel={t('message:error-unknownPage-linkToRoot-ariaLabel')}>
            {t('message:error-unknownPage-linkToRoot')}
          </Lenke>
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
