import { State } from 'declarations/reducers'
import { Container, Content, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {Link, LinkPanel} from '@navikt/ds-react'
import { FeatureToggles } from 'declarations/app'
import {useAppDispatch, useAppSelector} from 'store'
import styled from 'styled-components'
import {ReactComponent as OpprettSak} from 'assets/icons/OpprettSak.svg'
import {ReactComponent as Dokument} from 'assets/icons/Dokument.svg'
import {ReactComponent as Binders} from 'assets/icons/Binders.svg'
import SEDQuery from "../../applications/SvarSed/SEDQuery/SEDQuery";
import {appReset} from "../../actions/app";
import {querySaks} from "../../actions/svarsed";
import * as types from "../../constants/actionTypes";

interface ForsideSelector {
  featureToggles: FeatureToggles | null | undefined
  queryingSaks: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
}

const mapState = (state: State): ForsideSelector => ({
  featureToggles: state.app.featureToggles,
  queryingSaks: state.loading.queryingSaks,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type
})

const MyLinkPanel = styled(LinkPanel)`
  cursor: pointer;
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Squares = styled.div`
  display: flex;
  justify-content: center;
`

const Square = styled.div`
    width: 150px;
    height: 150px;
    margin: 0 1rem 0 1rem;
    background: #FFFFFF;
    border-radius: 5px;
    border: 2px solid #0067C5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const BindersIcon = styled(Binders)`
  width: 50px;
  height: 50px;
`

const DokumentIcon = styled(Dokument)`
  width: 50px;
  height: 50px;
`
const OpprettSakIcon = styled(OpprettSak)`
  width: 50px;
  height: 50px;
`

const StyledLink = styled(Link)`
  cursor: pointer;
  color: #000000;
  font-weight: bold;
  &:active{
      color: #000000;
      background-color: transparent;
  };
`


const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const { featureToggles, queryingSaks, alertMessage, alertType}: ForsideSelector = useAppSelector(mapState)

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

          <VerticalSeparatorDiv size='2' />
          <VerticalSeparatorDiv />
          <ContentArea>
          <SEDQuery
            parentNamespace="sedsearch"
            initialQuery=""
            onQueryChanged={() => {
              dispatch(appReset())
            }}
            onQuerySubmit={(q: string) => {
              dispatch(querySaks(q, 'new'))
            }}
            querying={queryingSaks}
            error={!!alertMessage && alertType && [types.SVARSED_SAKS_FAILURE].indexOf(alertType) >= 0 ? alertMessage : undefined}
          />
          <Squares>
            <StyledLink onClick={() => navigate({ pathname: '/svarsed/new', search: window.location.search })}>
              <Square>
                <OpprettSakIcon/>
                Opprett ny sak
              </Square>
            </StyledLink>
            <StyledLink onClick={() => navigate({ pathname: '/vedlegg', search: window.location.search })}>
              <Square>
                <BindersIcon/>
                Legg til vedlegg
              </Square>
            </StyledLink>
            {featureToggles?.featurePdu1 && (
              <StyledLink onClick={() => navigate({ pathname: '/pdu1/search', search: window.location.search })}>
                <Square>
                  <DokumentIcon/>
                  SED PD U1
                </Square>
              </StyledLink>
            )}
          </Squares>
          </ContentArea>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
