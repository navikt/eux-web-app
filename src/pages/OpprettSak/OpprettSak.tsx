import { updateReplySed } from 'actions/svarsed'
import CreateSak from 'applications/OpprettSak/CreateSak/CreateSak'
import SakSidebar from 'applications/OpprettSak/SakSidebar/SakSidebar'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const OpprettSakPage = (): JSX.Element => {
  const { t } = useTranslation()
  const changeModeFunc = React.useRef<ChangeModeFunction>(null)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
    }
  }

  return (
    <TopContainer title={t('app:page-title-opprettsak')}>
      <SlidePage
        withSidebar
        sidebarWidth={30}
        changeModeFunc={changeModeFunc}
        initialPage='A'
        initialDirection='none'
        divA1={(<CreateSak changeMode={changeMode} />)}
        divB1={(<SEDEdit changeMode={changeMode} />)}
        divA2={(
          <SideBarDiv>
            <SakSidebar />
          </SideBarDiv>
        )}
        divB2={(
          <SideBarDiv>
            <SEDDetails
              updateReplySed={updateReplySed}
            />
          </SideBarDiv>
        )}
      />
    </TopContainer>
  )
}

export default OpprettSakPage

/*

 */
