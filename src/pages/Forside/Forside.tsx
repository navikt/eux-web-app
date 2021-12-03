import { State } from 'declarations/reducers'
import { Container, Content, Margin, VerticalSeparatorDiv } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LinkPanel } from '@navikt/ds-react'
import { FeatureToggles } from 'declarations/app'

interface ForsideSelector {
  featureToggles: FeatureToggles | null | undefined
}

const mapState = (state: State): ForsideSelector => ({
  featureToggles: state.app.featureToggles
})

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { featureToggles }: ForsideSelector = useSelector<State, ForsideSelector>(mapState)
  return (
    <TopContainer title={t('app:page-title-forside')}>
      <Container>
        <Margin />
        <Content style={{ minWidth: '800px' }}>
          <LinkPanel
            className='slideInFromLeft'
            href='#'
            onClick={() => navigate({ pathname: '/opprettsak', search: window.location.search })}
          >
            <LinkPanel.Title>{t('app:page-title-opprettsak')}</LinkPanel.Title>
          </LinkPanel>
          <VerticalSeparatorDiv />
          <LinkPanel
            className='slideInFromLeft'
            href='#'
            onClick={() => navigate({ pathname: '/vedlegg', search: window.location.search })}
            style={{ animationDelay: '0.05s' }}
          >
            <LinkPanel.Title>{t('app:page-title-vedlegg')}</LinkPanel.Title>
          </LinkPanel>
          <>
            <VerticalSeparatorDiv />
            <LinkPanel
              className='slideInFromLeft'
              href='#'
              onClick={() => navigate({ pathname: '/svarsed', search: window.location.search })}
              style={{ animationDelay: '0.1s' }}
            >
              <LinkPanel.Title>{t('app:page-title-svarsed')}</LinkPanel.Title>
            </LinkPanel>
          </>
          {featureToggles?.featurePdu1 && (
            <>
              <VerticalSeparatorDiv />
              <LinkPanel
                className='slideInFromLeft'
                href='#'
                onClick={() => navigate({ pathname: '/pdu1', search: window.location.search })}
                style={{ animationDelay: '0.1.5s' }}
              >
                <LinkPanel.Title>{t('app:page-title-pdu1')}</LinkPanel.Title>
              </LinkPanel>
            </>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
