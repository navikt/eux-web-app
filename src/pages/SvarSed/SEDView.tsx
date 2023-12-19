import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FullWidthDiv,
  Margin,
  PileDiv,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
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
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import SedUnderJournalfoeringEllerUkjentStatus from "../../applications/Journalfoering/SedUnderJournalfoeringEllerUkjentStatus/SedUnderJournalfoeringEllerUkjentStatus";
import RelaterteRinaSaker from "../../applications/Journalfoering/RelaterteRinaSaker/RelaterteRinaSaker";
import IkkeJournalfoerteSed from "../../applications/Journalfoering/IkkeJournalfoerteSed/IkkeJournalfoerteSed";
import {Alert} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";

export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`
export const MyRadioPanelGroup = styled(RadioPanelGroup)`
  .navds-radio-buttons {
    margin-top: 0rem !important;
  }
`

interface SEDViewSelector {
  currentSak: Sak | undefined
  deletedSed: Boolean | undefined | null
  queryingSaks: boolean
  refreshingSaks: boolean
}

const mapState = (state: State) => ({
  currentSak: state.svarsed.currentSak,
  deletedSed: state.svarsed.deletedSed,
  queryingSaks: state.loading.queryingSaks,
  refreshingSaks: state.loading.refreshingSaks
})

const SEDView = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { sakId } = useParams()
  const { currentSak, deletedSed,queryingSaks, refreshingSaks }: SEDViewSelector = useAppSelector(mapState)
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
    if (deletedSed && currentSak) {
      dispatch(querySaks(currentSak?.sakId, 'refresh'))
    }
  }, [deletedSed])



  const arrayToTree = (arr:any, parent = undefined) =>{
    let newArr = []
    if(arr){
      newArr = arr.filter((item:any) => item.sedIdParent === parent)
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
        <SEDPanel
          currentSak={currentSak!}
          sed={sed}
        />
        <VerticalSeparatorDiv />
        {sed.children ? getSedPanels(sed.children, true) : undefined}
      </div>
    ))
  }

  if (_.isUndefined(currentSak)) {
    return <WaitingPanel />
  }

  return (
    <>
      {queryingSaks && !refreshingSaks &&
        <>
          <VerticalSeparatorDiv/>
          <WaitingPanel/>
        </>
      }
      <Container>
        <Margin />
        <Content style={{ flex: 6}}>
          <PileStartDiv>
            <FullWidthDiv>
              <AlignStartRow>
                <Column style={{marginRight: "1.5rem"}}>
                  <Sakshandlinger sak={currentSak} />
                </Column>
                <Column flex='2' style={{marginLeft: "1.5rem"}}>
                  <MyRadioPanelGroup>
                    {getSedPanels(arrayToTree(seds))}
                  </MyRadioPanelGroup>
                </Column>
              </AlignStartRow>
            </FullWidthDiv>
          </PileStartDiv>
        </Content>
        <Content style={{ flex: 2 }}>
          <Saksopplysninger sak={currentSak} />
          {currentSak.ikkeJournalfoerteSed && currentSak.ikkeJournalfoerteSed.length > 0 &&
            <>
              <VerticalSeparatorDiv />
              <IkkeJournalfoerteSed sak={currentSak}/>
            </>
          }
          {currentSak.ikkeJournalfoerteSedListFailed &&
            <>
              <VerticalSeparatorDiv />
              <Alert variant="error">
                {t('journalfoering:kunne-ikke-hente-liste')}
              </Alert>
            </>
          }
          {currentSak.sedUnderJournalfoeringEllerUkjentStatus && !currentSak.ikkeJournalfoerteSedListFailed &&
            <>
              <VerticalSeparatorDiv />
              <SedUnderJournalfoeringEllerUkjentStatus sak={currentSak}/>
            </>
          }
          {currentSak.relaterteRinasakIder && currentSak.relaterteRinasakIder.length > 0 &&
            <>
              <VerticalSeparatorDiv />
              <RelaterteRinaSaker sak={currentSak} />
            </>
          }
        </Content>
        <Margin />
      </Container>
    </>
  )
}

export default SEDView
