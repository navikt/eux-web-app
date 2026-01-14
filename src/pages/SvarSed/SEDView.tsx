import { querySaks } from 'actions/svarsed'
import SEDPanel from 'applications/SvarSed/Sak/SEDPanel'
import Sakshandlinger from 'applications/SvarSed/Sakshandlinger/Sakshandlinger'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { Sak, Sed } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import { useNavigate } from 'react-router-dom'
import SedUnderJournalfoeringEllerUkjentStatus from "../../applications/Journalfoering/SedUnderJournalfoeringEllerUkjentStatus/SedUnderJournalfoeringEllerUkjentStatus";
import RelaterteRinaSaker from "../../applications/Journalfoering/RelaterteRinaSaker/RelaterteRinaSaker";
import IkkeJournalfoerteSed from "../../applications/Journalfoering/IkkeJournalfoerteSed/IkkeJournalfoerteSed";
import JournalfoeringsOpplysninger from "../../applications/SvarSed/JournalfoeringsOpplysninger/JornalfoeringsOpplysninger";
import {Box, HGrid, Page, VStack} from "@navikt/ds-react";

interface SEDViewSelector {
  currentSak: Sak | undefined
  deletedSed: Boolean | undefined | null
  fagsakUpdated: boolean | undefined
  queryingSaks: boolean
  refreshingSaks: boolean
  bucer: Array<string> | undefined | null
}

const mapState = (state: State) => ({
  currentSak: state.svarsed.currentSak,
  deletedSed: state.svarsed.deletedSed,
  fagsakUpdated: state.svarsed.fagsakUpdated,
  queryingSaks: state.loading.queryingSaks,
  refreshingSaks: state.loading.refreshingSaks,
  bucer: state.app.saksbehandlerBucer
})

const SEDView = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { sakId } = useParams()
  const { currentSak, deletedSed, fagsakUpdated, queryingSaks, refreshingSaks, bucer }: SEDViewSelector = useAppSelector(mapState)
  const deletedSak = useAppSelector(state => state.svarsed.deletedSak)
  const navigate = useNavigate()

  let seds: Array<Sed> | undefined
  if (currentSak) {
    seds = _.cloneDeep(currentSak.sedListe)
  }

  useEffect(() => {
    if (deletedSak) {
      navigate({
        pathname: '/'
      })
    }
  }, [deletedSak])

  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;

    // reload, so it reflects changes made in potential SED save/send
    if (currentSak) {
      const params: URLSearchParams = new URLSearchParams(window.location.search)
      if (params.get('refresh') === 'true') {
        dispatch(querySaks(currentSak?.sakId, 'refresh', false, signal))
      }
    } else {
      if (sakId) {
        dispatch(querySaks(sakId, 'refresh', false, signal))
      }
    }
    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [])

  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;

    if (deletedSed && currentSak) {
      dispatch(querySaks(currentSak?.sakId, 'refresh', false, signal))
    }

    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [deletedSed])


  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;

    if (fagsakUpdated && currentSak) {
      dispatch(querySaks(currentSak?.sakId, 'refresh', false, signal))
    }

    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [fagsakUpdated])



  const arrayToTree = (arr:any, parent = undefined) =>{
    let newArr = []
    if(arr){
      newArr = arr.filter((item:any) => item.sedIdParent == parent)
        .map((child:any) => ({ ...child, children: arrayToTree(arr,
            child.sedId) }));
    }
    return newArr
  }

  const getSedPanels = (sedArray:Array<Sed>, addMargin:boolean = false) => {
    return sedArray.sort((a: Sed, b: Sed) => (
      moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
    )).map((sed: Sed) => (
      <div key={'sed-' + sed.sedId} style={addMargin ? { marginLeft: '4rem' } : {}}>
        <VStack gap="4">
          <SEDPanel
            currentSak={currentSak!}
            sed={sed}
          />
          {sed.children ? getSedPanels(sed.children, true) : undefined}
        </VStack>
      </div>
    ))
  }

  if (_.isUndefined(currentSak)) {
    return <WaitingPanel />
  }

  return (
    <>
      {queryingSaks && !refreshingSaks &&
        <Box padding="4">
          <WaitingPanel/>
        </Box>
      }
      <Page.Block width="2xl">
        <HGrid columns="1fr 2fr 1fr" gap="12" paddingBlock="12" paddingInline="4" align="start">
          <Sakshandlinger sak={currentSak} />
          <VStack gap="4">
            {getSedPanels(arrayToTree(seds))}
          </VStack>
          <VStack gap="4">
            <Saksopplysninger sak={currentSak} />
            {(!currentSak.ikkeJournalfoerteSed || currentSak.ikkeJournalfoerteSed.length === 0) &&
              <JournalfoeringsOpplysninger sak={currentSak} />
            }
            {currentSak.ikkeJournalfoerteSed && currentSak.ikkeJournalfoerteSed.length > 0 &&
              <IkkeJournalfoerteSed sak={currentSak} bucer={bucer}/>
            }
            {!_.isEmpty(currentSak.sedUnderJournalfoeringEllerUkjentStatus) &&
              <SedUnderJournalfoeringEllerUkjentStatus sak={currentSak}/>
            }
            {currentSak.relaterteRinasakIder && currentSak.relaterteRinasakIder.length > 0 &&
              <RelaterteRinaSaker sak={currentSak} />
            }
          </VStack>
        </HGrid>
      </Page.Block>
    </>
  )
}

export default SEDView
