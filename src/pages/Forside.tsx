import { State } from 'declarations/reducers'
import { Container, Content, Margin, VerticalSeparatorDiv } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Lenkepanel from 'nav-frontend-lenkepanel'
import { FeatureToggles } from 'declarations/app'

interface ForsideSelector {
  featureToggles: FeatureToggles | null | undefined
}

const mapState = (state: State): ForsideSelector => ({
  featureToggles: state.app.featureToggles
})

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const { featureToggles }: ForsideSelector = useSelector<State, ForsideSelector>(mapState)
  console.log('featureToggles')
  console.log(featureToggles)
  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content style={{ minWidth: '800px' }}>
          <Lenkepanel
            className='slideInFromLeft'
            href='#'
            linkCreator={(props: any) => (<Link to='/opprett' {...props} />)}
            tittelProps='undertittel'
          >
            {t('app:indexpage-createCase')}
          </Lenkepanel>
          <VerticalSeparatorDiv />
          <Lenkepanel
            className='slideInFromLeft'
            href='#'
            linkCreator={(props: any) => (<Link to='/vedlegg' {...props} />)}
            style={{ animationDelay: '0.15s' }}
            tittelProps='undertittel'
          >
            {t('app:indexpage-addAttachment')}
          </Lenkepanel>
          {featureToggles?.featureSvarsed && (
             <>
               <VerticalSeparatorDiv />
              <Lenkepanel
                className='slideInFromLeft'
                href='#'
                linkCreator={(props: any) => (<Link to='/svarpased' {...props} />)}
                style={{ animationDelay: '0.3s' }}
                tittelProps='undertittel'
              >
                {t('app:indexpage-svarSed')}
              </Lenkepanel>
            </>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
