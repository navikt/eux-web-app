import { State } from 'declarations/reducers'
import {Container, Content, Margin, VerticalSeparatorDiv} from '@navikt/hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {BodyLong, Heading, Link} from '@navikt/ds-react'
import { FeatureToggles } from 'declarations/app'
import {useAppDispatch, useAppSelector} from 'store'
import styled from 'styled-components'
import {ReactComponent as OpprettSak} from 'assets/icons/OpprettSak.svg'
import {ReactComponent as Dokument} from 'assets/icons/Dokument.svg'
import {ReactComponent as Binders} from 'assets/icons/Binders.svg'
import SEDQuery from "../../applications/SvarSed/SEDQuery/SEDQuery";
import {appReset} from "../../actions/app";
import {loadReplySed, querySaks, setCurrentSak} from "../../actions/svarsed";
import * as types from "../../constants/actionTypes";
import {Sak, Saks} from "../../declarations/types";
import LoadSave from "../../components/LoadSave/LoadSave";
import {ReplySed} from "../../declarations/sed";
import {PDU1} from "../../declarations/pd";
import {loadPdu1} from "../../actions/pdu1";

interface ForsideSelector {
  featureToggles: FeatureToggles | null | undefined
  queryingSaks: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  saks: Saks | null | undefined
}

const mapState = (state: State): ForsideSelector => ({
  featureToggles: state.app.featureToggles,
  queryingSaks: state.loading.queryingSaks,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  saks: state.svarsed.saks
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

const Forside: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const { featureToggles, queryingSaks, alertMessage, alertType, saks}: ForsideSelector = useAppSelector(mapState)
  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const [_query, _setQuery] = useState<string | null>(params.get('q'))
  const [_queryType, _setQueryType] = useState<string | undefined>(undefined)
  const [_hasLocalReplySeds, _setHasLocalReplySeds] = useState<boolean>(false)
  const [_hasLocaPDU1, _setHasLocalPDU1] = useState<boolean>(false)
  const currentSak: Sak | undefined = useAppSelector(state => state.svarsed.currentSak)


  useEffect(() => {
    if(currentSak){
      dispatch(setCurrentSak(undefined))
    }
  }, [])

  useEffect(() => {
    if (saks?.length === 1 && _queryType === 'saksnummer') {
      dispatch(setCurrentSak(saks[0]))
      navigate({
        pathname: '/svarsed/view/sak/' + saks[0].sakId,
        search: _query ? '?q=' + _query : ''
      })
    } else if (saks && saks.length > 1) {
      navigate({
        pathname: '/svarsed/search',
        search: _query ? '?q=' + _query : ''
      })
    }
  }, [saks])

  let controller:AbortController = new AbortController()

  useEffect(() =>{  
    return () => {
      if(controller){
        controller.abort();
      }
    }
  },[])

  return (
    <TopContainer title={t('app:page-title-forside')}>
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
                dispatch(querySaks(q, 'new', false, controller.signal))
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
      <Container>
        <Margin/>
        <Content style={{ minWidth: '800px' }}>
          <ContentArea>
            {(_hasLocalReplySeds || _hasLocaPDU1) &&
              <BodyLong>
                {t('label:lokalt-lagrede-x', { x: t('label:svarsed') })}
              </BodyLong>
            }
            <LoadSave<ReplySed>
              setHasEntries={_setHasLocalReplySeds}
              namespace='svarsed'
              loadReplySed={loadReplySed}
            />
            <LoadSave<PDU1>
              setHasEntries={_setHasLocalPDU1}
              namespace='pdu1'
              loadReplySed={loadPdu1}
            />
          </ContentArea>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Forside
