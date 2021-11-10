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
  return (
    <TopContainer title={t('app:page-title-forside')}>
      <Container>
        <Margin />
        <Content style={{ minWidth: '800px' }}>
          <Lenkepanel
            className='slideInFromLeft'
            href='#'
            linkCreator={(props: any) => (<Link to='/opprettsak' {...props} />)}
            tittelProps='undertittel'
          >
            {t('app:page-title-opprettsak')}
          </Lenkepanel>
          <VerticalSeparatorDiv />
          <Lenkepanel
            className='slideInFromLeft'
            href='#'
            linkCreator={(props: any) => (<Link to='/vedlegg' {...props} />)}
            style={{ animationDelay: '0.1s' }}
            tittelProps='undertittel'
          >
            {t('app:page-title-vedlegg')}
          </Lenkepanel>
          {featureToggles?.featureSvarsed && (
            <>
              <VerticalSeparatorDiv />
              <Lenkepanel
                className='slideInFromLeft'
                href='#'
                linkCreator={(props: any) => (<Link to='/svarsed' {...props} />)}
                style={{ animationDelay: '0.2s' }}
                tittelProps='undertittel'
              >
                {t('app:page-title-svarsed')}
              </Lenkepanel>
            </>
          )}
          {featureToggles?.featurePdu1 && (
            <>
              <VerticalSeparatorDiv />
              <Lenkepanel
                className='slideInFromLeft'
                href='#'
                linkCreator={(props: any) => (<Link to='/pdu1' {...props} />)}
                style={{ animationDelay: '0.3s' }}
                tittelProps='undertittel'
              >
                {t('app:page-title-pdu1')}
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
