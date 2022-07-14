import { State } from 'declarations/reducers'
import { Container, Content, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LinkPanel } from '@navikt/ds-react'
import { FeatureToggles } from 'declarations/app'
import { useAppSelector } from 'store'
import styled from 'styled-components'

interface ForsideSelector {
  featureToggles: FeatureToggles | null | undefined
}

const mapState = (state: State): ForsideSelector => ({
  featureToggles: state.app.featureToggles
})

const MyLinkPanel = styled(LinkPanel)`
  cursor: pointer;
`

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { featureToggles }: ForsideSelector = useAppSelector(mapState)
  return (
    <TopContainer title={t('app:page-title-forside')}>
      <Container>
        <Margin />
        <Content style={{ minWidth: '800px' }}>
          <MyLinkPanel
            onClick={() => navigate({ pathname: '/svarsed/new', search: window.location.search })}
          >
            <LinkPanel.Title>{t('app:page-title-opprettsak')}</LinkPanel.Title>
          </MyLinkPanel>
          <VerticalSeparatorDiv />
          <MyLinkPanel
            onClick={() => navigate({ pathname: '/vedlegg', search: window.location.search })}
          >
            <LinkPanel.Title>{t('app:page-title-vedlegg')}</LinkPanel.Title>
          </MyLinkPanel>
          <>
            <VerticalSeparatorDiv />
            <MyLinkPanel
              onClick={() => navigate({ pathname: '/svarsed/search', search: window.location.search })}
            >
              <LinkPanel.Title>{t('app:page-title-svarsed')}</LinkPanel.Title>
            </MyLinkPanel>
          </>
          {featureToggles?.featurePdu1 && (
            <>
              <VerticalSeparatorDiv />
              <MyLinkPanel
                onClick={() => navigate({ pathname: '/pdu1/search', search: window.location.search })}
              >
                <LinkPanel.Title>{t('app:page-title-pdu1')}</LinkPanel.Title>
              </MyLinkPanel>
            </>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
