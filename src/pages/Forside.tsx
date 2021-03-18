import { Container, Content, Margin, VerticalSeparatorDiv } from 'nav-hoykontrast'
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
          <div style={{minWidth: '800px'}}>
            <Lenkepanel
              className='slideAnimate'
              href='#'
              linkCreator={(props: any) => (<Link to='/opprett' {...props} />)}
              tittelProps='undertittel'
            >
              {t('ui:indexpage-createCase')}
            </Lenkepanel>
            <VerticalSeparatorDiv />
            <Lenkepanel
              className='slideAnimate'
              href='#'
              linkCreator={(props: any) => (<Link to='/vedlegg' {...props} />)}
              style={{ animationDelay: '0.15s' }}
              tittelProps='undertittel'
            >
              {t('ui:indexpage-addAttachment')}
            </Lenkepanel>
            <VerticalSeparatorDiv />
            <Lenkepanel
              className='slideAnimate'
              href='#'
              linkCreator={(props: any) => (<Link to='/svarpased' {...props} />)}
              style={{ animationDelay: '0.3s' }}
              tittelProps='undertittel'
            >
              {t('ui:indexpage-svarSed')}
            </Lenkepanel>

          </div>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
