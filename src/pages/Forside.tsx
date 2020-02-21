import React, { useEffect, useState } from 'react'
import Ui from 'eessi-pensjon-ui'
import TopContainer from 'components/TopContainer/TopContainer'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as sakActions from 'actions/sak'

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted) {
      dispatch(sakActions.preload())
      dispatch(sakActions.getSaksbehandler())
      dispatch(sakActions.getServerinfo())
      setMounted(true)
    }
  }, [mounted, dispatch])

  return (
    <TopContainer className="p-forside">
      <Ui.Nav.Row>
        <div className='col-sm-1' />
        <div className='col-sm-10 m-4'>
          <Ui.Nav.Systemtittel className='mb-4'>{t('ui:app-title')}</Ui.Nav.Systemtittel>
          <Ui.Nav.Lenkepanel href="/opprett">{t('ui:menu-createCase')}</Ui.Nav.Lenkepanel>
          <Ui.Nav.Lenkepanel href="/vedlegg">{t('ui:menu-addAttachment')}</Ui.Nav.Lenkepanel>
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

export default Forside
