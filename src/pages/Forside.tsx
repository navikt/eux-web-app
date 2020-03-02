import * as uiActions from 'actions/ui'
import TopContainer from 'components/TopContainer/TopContainer'
import Ui from 'eessi-pensjon-ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const toggleHighContrast = (): void => {
    dispatch(uiActions.toggleHighContrast())
  }

  return (
    <TopContainer className='p-forside'>
      <Ui.Banner
        style={{ backgroundColor: 'lightblue' }}
        onHighContrastClicked={toggleHighContrast}
        header={(
          <Ui.Nav.Systemtittel className='mb-4'>
            {t('ui:app-title')}
          </Ui.Nav.Systemtittel>
        )}
      />
      <Ui.Nav.Row>
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
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

export default Forside
