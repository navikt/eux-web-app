import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import { fetchPdu1, setPdu1, updatePdu1 } from 'actions/pdu1'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import SlidePage, { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import PDU1Edit from './PDU1Edit'
import PDU1Search from './PDU1Search'

export const PDU1Page = (): JSX.Element => {
  const { t } = useTranslation()
  const changeModeFunc = React.useRef<ChangeModeFunction>(null)
  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const [mounted, setMounted] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<string>('A')
  const dispatch = useDispatch()
  const entries: Array<LocalStorageEntry<PDU1>> | null | undefined =
    useSelector<State, Array<LocalStorageEntry<PDU1>> | null | undefined>(state => state.localStorage.pdu1.entries)

  const changeMode = (newPage: string, newDirection: string, newCallback?: () => void) => {
    if (changeModeFunc.current !== null) {
      changeModeFunc.current(newPage, newDirection, newCallback)
      setCurrentPage(newPage)
    }
  }

  const onGoBackClick = () => {
    changeMode('A', 'back')
    dispatch(resetCurrentEntry('pdu1'))
    document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
  }

  useEffect(() => {
    const fnrParam: string | null = params.get('fnr')
    if (fnrParam) {
      setStatusParam('fnr', fnrParam)
      dispatch(fetchPdu1(fnrParam))
    }
  }, [])

  useEffect(() => {
    if (!mounted) {
      // Load PDU1 from localStorage if I see a GET param - used for token renew
      // I have to wait until localStorage is loaded
      if (entries !== undefined) {
        const name: string | null = params.get('name')
        if (name) {
          const entry: LocalStorageEntry<ReplySed | PDU1> | undefined =
            _.find(entries, (e: LocalStorageEntry<PDU1>) => e.name === name)
          if (entry) {
            dispatch(setCurrentEntry('pdu1', entry))
            dispatch(setPdu1(entry.content))
            changeMode('B', 'forward')
            dispatch(alertSuccess(t('message:success-pdu1-reloaded-after-token', { name })))
          }
        }
        setMounted(true)
      }
    }
  }, [entries])

  return (
    <TopContainer
      backButton={currentPage === 'B'}
      onGoBackClick={onGoBackClick}
      title={t('app:page-title-pdu1')}
    >
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
          <PDU1Edit/>
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
