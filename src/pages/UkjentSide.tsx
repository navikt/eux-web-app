import TopContainer from 'components/TopContainer/TopContainer'
import PT from 'prop-types'
import React from 'react'
import Ui from 'eessi-pensjon-ui'
import { useTranslation } from 'react-i18next'

export interface UkjentSideProps {
  location: Location
}

const UkjentSide: React.FC<UkjentSideProps> = ({ location }: UkjentSideProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <TopContainer className='p-ukjentSide'>
      <Ui.Nav.Row>
        <div className='col-sm-1' />
        <div className='col-sm-10 m-4'>
          <Ui.Nav.AlertStripe type='advarsel'>
            <Ui.Nav.Systemtittel>
              {t('ui:error-unknownPage-cantFindRoute', { pathname: location.pathname })}
            </Ui.Nav.Systemtittel>
          </Ui.Nav.AlertStripe>
          <p>{t('ui:error-unknownPage-description')}</p>
          <Ui.Nav.Lenke href='/' ariaLabel={t('ui:error-unknownPage-linkToRoot-ariaLabel')}>
            {t('ui:error-unknownPage-linkToRoot')}
          </Ui.Nav.Lenke>
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

UkjentSide.propTypes = {
  location: PT.any.isRequired
}

export default UkjentSide
