import { Container, Content, Margin } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface UkjentSideProps {
  location: Location
}

const UkjentSide: React.FC<UkjentSideProps> = ({ location }: UkjentSideProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <TopContainer>
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
