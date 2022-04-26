import { Container, Content, Margin } from '@navikt/hoykontrast'
import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { setCurrentSak, querySaksnummerOrFnr, setReplySed, updateReplySed } from 'actions/svarsed'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import SakBanner from 'applications/SvarSed/Sak/SakBanner'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import { FadingLineSeparator, SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sak } from 'declarations/types'
import _ from 'lodash'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import SEDSearch from 'pages/SvarSed/SEDSearch'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

export const SvarSedPage = (): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const [_currentPage, _setCurrentPage] = useState<string>('A')
  const params: URLSearchParams = new URLSearchParams(location.search)
  const entries: Array<LocalStorageEntry<ReplySed>> | null | undefined =
    useAppSelector(state => state.localStorage.svarsed.entries)
  const replySedChanged: boolean = useAppSelector(state => state.svarsed.replySedChanged)
  const currentSak: Sak | undefined = useAppSelector(state => state.svarsed.currentSak)

  const changeMode = (newPage: string) => {
    _setCurrentPage(newPage)
  }

  const onGoBackClick = () => {
    if (_currentPage === 'B') {
      changeMode('A')
      dispatch(resetCurrentEntry('svarsed'))
      document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
    }
    dispatch(setCurrentSak(undefined))
  }

  useEffect(() => {
    const rinasaksnummerParam: string | null = params.get('rinasaksnummer')
    const fnrParam: string | null = params.get('fnr')
    if (fnrParam) {
      setStatusParam('fnr', fnrParam)
    }
    if (!!rinasaksnummerParam || !!fnrParam) {
      setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam)
      dispatch(querySaksnummerOrFnr((rinasaksnummerParam || fnrParam)!))
    }
  }, [])

  useEffect(() => {
    if (!mounted) {
      // Load SvarSED from localStorage if I see a GET param - used for token renew
      // I have to wait until localStorage is loaded
      if (entries !== undefined) {
        const name: string | null = params.get('name')
        if (name) {
          const entry: LocalStorageEntry<ReplySed> | undefined =
            _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.name === name)
          if (entry) {
            dispatch(setCurrentEntry('svarsed', entry))
            dispatch(setReplySed(entry.content))
            changeMode('B')
            dispatch(alertSuccess(t('message:success-svarsed-reloaded-after-token', { name })))
          }
        }
        setMounted(true)
      }
    }
  }, [entries])

  return (
    <TopContainer
      backButton={_currentPage === 'B' || (_currentPage === 'A' && currentSak !== undefined)}
      onGoBackClick={onGoBackClick}
      unsavedDoc={replySedChanged}
      title={t('app:page-title-svarsed')}
    >
      <>
        {currentSak !== undefined && (
          <SakBanner sak={currentSak} />
        )}
        <Container>
          <Margin />
          <Content style={{ flex: 6, maxWidth: '1200px' }}>
            {_currentPage === 'A' && (
              <SEDSearch changeMode={changeMode} />
            )}
            {_currentPage === 'B' && (
              <SEDEdit />
            )}
          </Content>
          <FadingLineSeparator className='fadeIn'>
            &nbsp;
          </FadingLineSeparator>
          <Content style={{ width: '23.5rem' }}>
            <SideBarDiv>
              {_currentPage === 'A' && (
                currentSak === undefined
                  ? (
                    <LoadSave<ReplySed>
                      namespace='svarsed'
                      changeMode={changeMode}
                      setReplySed={setReplySed}
                    />
                    )
                  : (
                    <Saksopplysninger sak={currentSak} />
                    )
              )}

              {_currentPage === 'B' && (
                <SEDDetails updateReplySed={updateReplySed} />
              )}
            </SideBarDiv>
          </Content>
          <Margin />
        </Container>
      </>
    </TopContainer>
  )
}

export default SvarSedPage
