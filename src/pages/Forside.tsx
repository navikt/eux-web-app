import { Container, Content, Margin } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Lenkepanel from 'nav-frontend-lenkepanel'

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <>
            <Lenkepanel
              tittelProps='undertittel'
              className='slideAnimate'
              linkCreator={(props: any) => (<Link to='/opprett' {...props} />)}
              href='#'
            >
              {t('ui:menu-createCase')}
            </Lenkepanel>
            <Lenkepanel
              tittelProps='undertittel'
              className='slideAnimate'
              style={{ animationDelay: '0.15s' }}
              linkCreator={(props: any) => (<Link to='/vedlegg' {...props} />)}
              href='#'
            >
              {t('ui:menu-addAttachment')}
            </Lenkepanel>
            {window.location.hostname !== 'eux-helloeu-app-q2.nais.preprod.local' &&
             window.location.hostname !== 'eux-helloeu-app.nais.adeo.no' && (
              <Lenkepanel
                tittelProps='undertittel'
                className='slideAnimate'
                style={{ animationDelay: '0.3s' }}
                linkCreator={(props: any) => (<Link to='/svarpased' {...props} />)}
                href='#'
              >
                {t('ui:menu-svarpased')}
              </Lenkepanel>
            )}
          </>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
