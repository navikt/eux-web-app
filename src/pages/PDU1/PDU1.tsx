import { setPdu1, updatePdu1 } from 'actions/pdu1'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PDU1Edit from './PDU1Edit'
import PDU1Search from './PDU1Search'

export const PDU1Page = (): JSX.Element => {
  const { t } = useTranslation()
  const changeModeFunc = React.useRef<ChangeModeFunction>(null)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
    }
  }

  return (
    <TopContainer title={t('app:page-title-pdu1')}>
      <SlidePage
        changeModeFunc={changeModeFunc}
        initialPage='A'
        initialDirection='none'
        divA1={(
          <PDU1Search
            changeMode={changeMode}
          />
        )}
        divA2={(
          <SideBarDiv>
            <LoadSave
              namespace='pdu1'
              changeMode={changeMode}
              setReplySed={setPdu1}
            />
          </SideBarDiv>
        )}
        divB1={(
          <PDU1Edit
            changeMode={changeMode}
          />
        )}
        divB2={(
          <SideBarDiv>
            <SEDDetails
              updateReplySed={updatePdu1}
            />
          </SideBarDiv>
        )}
      />
    </TopContainer>
  )
}

export default PDU1Page
