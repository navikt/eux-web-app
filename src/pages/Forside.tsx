import TopContainer from 'components/TopContainer/TopContainer'
import Ui from 'eessi-pensjon-ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <TopContainer className='p-forside'>
      <Ui.Nav.Row className='m-0 pt-4'>
        <div className='col-sm-1' />
        <div className='col-sm-10 m-4'>
          <Ui.Nav.Lenkepanel
            className='slideAnimate'
            linkCreator={(props: any) => (<Link to='/opprett' {...props} />)}
            href='#'
          >
            {t('ui:menu-createCase')}
          </Ui.Nav.Lenkepanel>
          <Ui.Nav.Lenkepanel
            className='slideAnimate'
            style={{ animationDelay: '0.15s' }}
            linkCreator={(props: any) => (<Link to='/vedlegg' {...props} />)}
            href='#'
          >
            {t('ui:menu-addAttachment')}
          </Ui.Nav.Lenkepanel>
          <Ui.Nav.Lenkepanel
            className='slideAnimate'
            style={{ animationDelay: '0.3s' }}
            linkCreator={(props: any) => (<Link to='/svarpased' {...props} />)}
            href='#'
          >
            {t('ui:menu-svarpased')}
          </Ui.Nav.Lenkepanel>
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

export default Forside
