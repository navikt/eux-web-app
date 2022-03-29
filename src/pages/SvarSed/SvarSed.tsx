import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import { querySaksnummerOrFnr, setReplySed, updateReplySed } from 'actions/svarsed'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import SEDSearch from 'pages/SvarSed/SEDSearch'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export const SvarSedPage = (): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const [_currentPage, _setCurrentPage] = useState<string>('A')
  const [_currentSak, _setCurrentSak] = useState<any>(undefined)
  const changeModeFunc = React.useRef<ChangeModeFunction>(null)
  const params: URLSearchParams = new URLSearchParams(location.search)
  const entries: Array<LocalStorageEntry<ReplySed>> | null | undefined =
    useSelector<State, Array<LocalStorageEntry<ReplySed>> | null | undefined>(state => state.localStorage.svarsed.entries)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
      _setCurrentPage(newPage)
    }
  }

  const onGoBackClick = () => {
    if (_currentPage ===  'B') {
      changeMode('A', 'back')
      dispatch(resetCurrentEntry('svarsed'))
      document.dispatchEvent(new CustomEvent('tilbake', {detail: {}}))
    }
    if (_currentPage ===  'A' && _currentSak !== undefined) {
       _setCurrentSak(undefined)
    }
  }

  useEffect(() => {
    const rinasaksnummerParam: string | null = params.get('rinasaksnummer')
    const fnrParam: string | null = params.get('fnr')
    if (fnrParam) {
      setStatusParam('fnr', fnrParam)
    }
    if (rinasaksnummerParam || fnrParam) {
      setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam || undefined)
      dispatch(querySaksnummerOrFnr(rinasaksnummerParam || fnrParam || undefined))
    }
  }, [])

  useEffect(() => {
    if (!mounted) {
      // Load PDU1 from localStorage if I see a GET param - used for token renew
      // I have to wait until localStorage is loaded
      if (entries !== undefined) {
        const name: string | null = params.get('name')
        if (name) {
          const entry: LocalStorageEntry<ReplySed> | undefined =
            _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.name === name)
          if (entry) {
            dispatch(setCurrentEntry('svarsed', entry))
            dispatch(setReplySed(entry.content))
            changeMode('B', 'forward')
            dispatch(alertSuccess(t('message:success-svarsed-reloaded-after-token', { name })))
          }
        }
        setMounted(true)
      }
    }
  }, [entries])

  return (
    <TopContainer
      backButton={_currentPage === 'B' || (_currentPage === 'A' && _currentSak !== undefined)}
      onGoBackClick={onGoBackClick}
      title={t('app:page-title-svarsed')}
    >
      <>
        {_currentSak !== undefined && (
          <div>
            sdfsddsfsfdsfd
          </div>
        )}
        <SlidePage
          changeModeFunc={changeModeFunc}
          initialPage='A'
          initialDirection='none'
          divA1={(
            <SEDSearch
              changeMode={changeMode}
              currentSak={_currentSak}
              setCurrentSak={_setCurrentSak}
            />
          )}
          divA2={(
            <SideBarDiv>
              <LoadSave
                namespace='svarsed'
                changeMode={changeMode}
                setReplySed={setReplySed}
              />
            </SideBarDiv>
        )}
          divB1={(
            <SEDEdit/>
          )}
          divB2={(
            <SideBarDiv>
              <SEDDetails
                updateReplySed={updateReplySed}
              />
            </SideBarDiv>
        )}
        />
      </>
    </TopContainer>
  )
}

export default SvarSedPage
