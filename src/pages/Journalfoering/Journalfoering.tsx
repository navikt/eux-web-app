import React, {useEffect} from "react";
import TopContainer from "../../components/TopContainer/TopContainer";
import SakBanner from "../../applications/SvarSed/Sak/SakBanner";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import {Sak} from "../../declarations/types";
import {Content, Margin, Container, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Saksopplysninger from "applications/SvarSed/Saksopplysninger/Saksopplysninger";
import _ from "lodash";
import WaitingPanel from "../../components/WaitingPanel/WaitingPanel";
import {querySaks} from "../../actions/svarsed";
import JournalfoerPanel from "./JournalfoerPanel";
import InnhentMerInfoPanel from "./InnhentMerInfoPanel";
import FeilregistrerJournalposterPanel from "./FeilregistrerJournalposterPanel";
import {appReset} from "../../actions/app";

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
    // reload, so it reflects changes made in potential SED save/send
    if (!currentSak && sakId) {
      dispatch(querySaks(sakId, 'refresh'))
    }
  }, [])

  if (_.isUndefined(currentSak)) {
    return <WaitingPanel />
  }

  return (
    <TopContainer backButton={true} onGoBackClick={goBack} title={"Journalføring"}>
      <SakBanner />
      <Container>
        <Margin />
        <Content style={{ flex: 6}}>
          <JournalfoerPanel sak={currentSak} gotoSak={goBack} gotoFrontpage={gotoFrontpage}/>
          <VerticalSeparatorDiv />
          <InnhentMerInfoPanel sak={currentSak} gotoSak={goBack} gotoFrontpage={gotoFrontpage}/>
          <VerticalSeparatorDiv />
          <FeilregistrerJournalposterPanel sak={currentSak} gotoSak={goBack} gotoFrontpage={gotoFrontpage}/>
        </Content>
        <Content style={{ flex: 2 }}>
          <Saksopplysninger sak={currentSak} />
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Journalfoering
