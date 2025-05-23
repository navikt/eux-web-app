/// <reference types="vite-plugin-svgr/client" />
import { State } from 'declarations/reducers'
import {Container, Content, Margin, VerticalSeparatorDiv} from '@navikt/hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {Heading, Link} from '@navikt/ds-react'
import { FeatureToggles } from 'declarations/app'
import {useAppDispatch, useAppSelector} from 'store'
import styled from 'styled-components'
import OpprettSak from 'assets/icons/OpprettSak.svg?react'
import Dokument from 'assets/icons/Dokument.svg?react'
import Binders from 'assets/icons/Binders.svg?react'
import SEDQuery from "../../applications/SvarSed/SEDQuery/SEDQuery";
import {appReset} from "../../actions/app";
import {querySaks, setCurrentSak} from "../../actions/svarsed";
import * as types from "../../constants/actionTypes";
import {Sak, Saks, Saksbehandler} from "../../declarations/types";
import NEESSILogo from 'assets/logos/nEESSI';
import BrannLogo from "assets/logos/brann.png"

interface ForsideSelector {
  featureToggles: FeatureToggles | null | undefined
  queryingSaks: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  saks: Saks | null | undefined
  saksbehandler: Saksbehandler | undefined
}

const mapState = (state: State): ForsideSelector => ({
  featureToggles: state.app.featureToggles,
  queryingSaks: state.loading.queryingSaks,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  saks: state.svarsed.saks,
  saksbehandler: state.app.saksbehandler,
})

const WhiteContainer = styled(Container)`
  background-color: #ffffff
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

const LogoDiv = styled.div`
  display: flex;
  margin-top: 3rem;
  margin-bottom: -3rem;
`

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const { saksbehandler, featureToggles, queryingSaks, alertMessage, alertType, saks}: ForsideSelector = useAppSelector(mapState)
  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const [_query, _setQuery] = useState<string | null>(params.get('q'))
  const [_queryType, _setQueryType] = useState<string | undefined>(undefined)
  const currentSak: Sak | undefined = useAppSelector(state => state.svarsed.currentSak)

  const getLogo = (saksbehandler: Saksbehandler | undefined) => {
    if (saksbehandler && saksbehandler.brukernavn && (saksbehandler.brukernavn === "Z992666" || saksbehandler.brukernavn === "A142467")) {
      return (
        <img width="150" src={BrannLogo} alt="Brann"/>
      )
    }
    return (<NEESSILogo/>)
  }

  useEffect(() => {
    if (currentSak) {
      dispatch(setCurrentSak(undefined))
    }
  }, [])

  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;

    if(_query){
      dispatch(querySaks(_query, 'new', false, signal))
    }

    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [_query])

  useEffect(() => {
    if (saks?.length === 1 && _queryType === 'saksnummer') {
      dispatch(setCurrentSak(saks[0]))
      navigate({
        pathname: '/svarsed/view/sak/' + saks[0].sakId,
        search: _query ? '?q=' + _query : ''
      })
    } else if (saks) {
      navigate({
        pathname: '/svarsed/search',
        search: _query ? '?q=' + _query : ''
      })
    }
  }, [saks])

  return (
    <TopContainer title={t('app:page-title-forside')}>
      <LogoDiv>
        <Margin />
        {getLogo(saksbehandler)}
        <Margin />
      </LogoDiv>
      <Container>
        <Margin />
        <Content style={{ minWidth: '800px' }}>
          <ContentArea>
            <VerticalSeparatorDiv size="2"/>
            <Heading size='medium'>
              {t('app:page-title-svarsed-search')}
            </Heading>
            <SEDQuery
              frontpage={true}
              parentNamespace="sedsearch"
              initialQuery=""
              onQueryChanged={(queryType: string) => {
                dispatch(appReset())
                _setQueryType(queryType)
              }}
              onQuerySubmit={(q: string) => {
                _setQuery(q)
              }}
              querying={queryingSaks}
              error={!!alertMessage && alertType && [types.SVARSED_SAKS_FAILURE].indexOf(alertType) >= 0 ? alertMessage : undefined}
            />
          </ContentArea>
        </Content>
        <Margin/>
      </Container>
      <WhiteContainer>
        <Margin/>
        <Content style={{ minWidth: '800px' }}>
          <ContentArea>
            <VerticalSeparatorDiv size="3"/>
            <Squares>
              <StyledLink onClick={() => navigate({ pathname: '/svarsed/new', search: window.location.search })}>
                <Square>
                  <OpprettSakIcon/>
                  {t('app:page-title-opprettnysak')}
                </Square>
              </StyledLink>
              <StyledLink onClick={() => navigate({ pathname: '/vedlegg', search: window.location.search })}>
                <Square>
                  <BindersIcon/>
                  {t('app:page-title-vedlegg')}
                </Square>
              </StyledLink>
              {featureToggles?.featurePdu1 && (
                <StyledLink onClick={() => navigate({ pathname: '/pdu1/search', search: window.location.search })}>
                  <Square>
                    <DokumentIcon/>
                    {t('app:page-title-sed-pdu1')}
                  </Square>
                </StyledLink>
              )}
            </Squares>
            <VerticalSeparatorDiv size="3"/>
          </ContentArea>
        </Content>
        <Margin/>
      </WhiteContainer>
    </TopContainer>
  )
}

export default Forside
