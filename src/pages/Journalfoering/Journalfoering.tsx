import React, {useEffect} from "react";
import TopContainer from "../../components/TopContainer/TopContainer";
import SakBanner from "../../applications/SvarSed/Sak/SakBanner";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import {Sak} from "../../declarations/types";
import Saksopplysninger from "applications/SvarSed/Saksopplysninger/Saksopplysninger";
import _ from "lodash";
import WaitingPanel from "../../components/WaitingPanel/WaitingPanel";
import {querySaks} from "../../actions/svarsed";
import JournalfoerPanel from "./JournalfoerPanel";
import InnhentMerInfoPanel from "./InnhentMerInfoPanel";
import FeilregistrerJournalposterPanel from "./FeilregistrerJournalposterPanel";
import {appReset} from "../../actions/app";
import {Box, HGrid, Page, VStack} from "@navikt/ds-react"
import styles from './Journalfoering.module.css'

export interface JournalfoeringProps {

}

interface JournalfoeringSelector {
  currentSak: Sak | undefined
}

const mapState = (state: State) => ({
  currentSak: state.svarsed.currentSak,
})

export const Journalfoering: React.FC<JournalfoeringProps> = ({}: JournalfoeringProps): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { sakId } = useParams()
  const { currentSak }: JournalfoeringSelector = useAppSelector(mapState)

  const goBack = () => {
    const params: URLSearchParams = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const search = '?refresh=true' + (q ? '&q=' + q : '')

    navigate({
      pathname: '/svarsed/view/sak/' + currentSak?.sakId,
      search
    })
  }

  const gotoFrontpage = () => {
    dispatch(appReset())
    navigate({
      pathname: '/',
    })
  }

  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;

    // reload, so it reflects changes made in potential SED save/send
    if (!currentSak && sakId) {
      dispatch(querySaks(sakId, 'refresh', false, signal))
    }

    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [])

  if (_.isUndefined(currentSak)) {
    return <WaitingPanel />
  }

  return (
    <Page className={styles.page}>
      <TopContainer backButton={true} onGoBackClick={goBack} title={"Journalføring"}>
        <SakBanner />
        <Page.Block width="2xl" gutters as="main">
          <HGrid columns="2fr 1fr" gap="4" paddingBlock="12">
            <VStack gap="4">
              <JournalfoerPanel sak={currentSak} gotoSak={goBack} gotoFrontpage={gotoFrontpage}/>
              <InnhentMerInfoPanel sak={currentSak} gotoSak={goBack} gotoFrontpage={gotoFrontpage}/>
              <FeilregistrerJournalposterPanel sak={currentSak} gotoSak={goBack} gotoFrontpage={gotoFrontpage}/>
            </VStack>
            <Box>
              <Saksopplysninger sak={currentSak} />
            </Box>
          </HGrid>
        </Page.Block>
      </TopContainer>
    </Page>
  )
}

export default Journalfoering
