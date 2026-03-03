/// <reference types="vite-plugin-svgr/client" />
import { State } from 'declarations/reducers'
import TopContainer from 'components/TopContainer/TopContainer'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {Box, Heading, HStack, Link, VStack} from '@navikt/ds-react'
import { FeatureToggles } from 'declarations/app'
import {useAppDispatch, useAppSelector} from 'store'
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
import styles from './Forside.module.css'

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
      dispatch(querySaks(_query, 'new', false, signal, true))
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
      <VStack gap="space-80" paddingBlock={"space-0 space-48"}>
        <div className={styles.logoDiv}>
          {getLogo(saksbehandler)}
        </div>
        <HStack justify="center">
          <Box minWidth="800px">
            <VStack gap="space-0">
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
            </VStack>
          </Box>
        </HStack>
      </VStack>
      <Box className={styles.whiteContainer} padding="space-48">
        <HStack justify="center">
          <Box className={styles.content}>
            <VStack gap="space-24" className={styles.contentArea}>
              <HStack gap="space-0" justify="center">
                <Link className={styles.styledLink} onClick={() => navigate({ pathname: '/svarsed/new', search: window.location.search })}>
                  <div className={styles.square}>
                    <OpprettSak className={styles.opprettSakIcon}/>
                    {t('app:page-title-opprettnysak')}
                  </div>
                </Link>
                <Link className={styles.styledLink} onClick={() => navigate({ pathname: '/vedlegg', search: window.location.search })}>
                  <div className={styles.square}>
                    <Binders className={styles.bindersIcon}/>
                    {t('app:page-title-vedlegg')}
                  </div>
                </Link>
                {featureToggles?.featurePdu1 && (
                  <Link className={styles.styledLink} onClick={() => navigate({ pathname: '/pdu1/search', search: window.location.search })}>
                    <div className={styles.square}>
                      <Dokument className={styles.dokumentIcon}/>
                      {t('app:page-title-sed-pdu1')}
                    </div>
                  </Link>
                )}
              </HStack>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </TopContainer>
  );
}

export default Forside
