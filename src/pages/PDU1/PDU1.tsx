import { setStatusParam } from 'actions/app'
import * as svarsedActions from 'actions/svarsed'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import PDU1Edit from './PDU1Edit'
import PDU1Search from './PDU1Search'
import { STORAGE_PDU1 } from 'constants/storage'
import { useLocation } from 'react-router-dom'

export const PDU1Page = (): JSX.Element => {
  const [_mounted, setMounted] = useState<boolean>(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const storageKey = STORAGE_PDU1

  const changeModeFunc = React.useRef<ChangeModeFunction>(null)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
    }
  }

  useEffect(() => {
    if (!_mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummerParam: string | null = params.get('rinasaksnummer')

      const fnrParam: string | null = params.get('fnr')
      if (rinasaksnummerParam || fnrParam) {
        setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam || undefined)
        dispatch(svarsedActions.querySaksnummerOrFnr(rinasaksnummerParam || fnrParam || undefined))
      }
      setMounted(true)
    }
  }, [_mounted])

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
              storageKey={storageKey}
              changeMode={changeMode}
            />
          </SideBarDiv>
        )}
        divB1={(
          <PDU1Edit
            storageKey={storageKey}
            changeMode={changeMode}
          />
        )}
        divB2={(
          <SideBarDiv>
            <SEDDetails />
          </SideBarDiv>
        )}
      />
    </TopContainer>
  )
}

export default PDU1Page
