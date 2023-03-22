import React from "react";
import TopContainer from "../../components/TopContainer/TopContainer";
import SakBanner from "../../applications/SvarSed/Sak/SakBanner";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import {Sak} from "../../declarations/types";

export interface JournalFoeringProps {

}

interface JournalFoeringSelector {
  currentSak: Sak | undefined
}

const mapState = (state: State) => ({
  currentSak: state.svarsed.currentSak,
})

export const JournalFoering: React.FC<JournalFoeringProps> = ({}: JournalFoeringProps): JSX.Element => {
  const navigate = useNavigate()
  const { currentSak }: JournalFoeringSelector = useAppSelector(mapState)

  const goBack = () => {
    const params: URLSearchParams = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const search = '?refresh=true' + (q ? '&q=' + q : '')

    navigate({
      pathname: '/svarsed/view/sak/' + currentSak?.sakId,
      search
    })
  }


  return (
    <TopContainer backButton={true} onGoBackClick={goBack} title={"Journalføring"}>
      <SakBanner />
    </TopContainer>
  )
}

export default JournalFoering
