import { setStatusParam } from 'actions/app'
import { querySaksnummerOrFnr, updateReplySed, setReplySed } from 'actions/svarsed'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import SEDSearch from 'pages/SvarSed/SEDSearch'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { STORAGE_SVARSED } from 'constants/storage'
import { useLocation } from 'react-router-dom'

export const SvarSedPage = (): JSX.Element => {
  const storageKey = STORAGE_SVARSED
  const [_mounted, setMounted] = useState<boolean>(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
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
      if (fnrParam) {
        setStatusParam('fnr', fnrParam)
      }
      if (rinasaksnummerParam || fnrParam) {
        setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam || undefined)
        dispatch(querySaksnummerOrFnr(rinasaksnummerParam || fnrParam || undefined))
      }
      setMounted(true)
    }
  }, [_mounted])

  return (
    <TopContainer title={t('app:page-title-svarsed')}>
      <SlidePage
        changeModeFunc={changeModeFunc}
        initialPage='A'
        initialDirection='none'
        divA1={(<SEDSearch changeMode={changeMode} />)}
        divA2={(
          <SideBarDiv>
            <LoadSave
              namespace='svarsed'
              storageKey={storageKey}
              changeMode={changeMode}
              setReplySed={setReplySed}
            />
          </SideBarDiv>
      )}
        divB1={(
          <SEDEdit
            storageKey={storageKey}
            changeMode={changeMode}
          />)}
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

export default SvarSedPage
