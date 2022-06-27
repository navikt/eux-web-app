import { Button } from '@navikt/ds-react'
import { Container, Content, FlexDiv, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import {
  cleanUpSvarSed,
  loadReplySed,
  querySaksnummerOrFnr,
  setCurrentSak,
  setReplySed,
  updateReplySed
} from 'actions/svarsed'
import SakBanner from 'applications/SvarSed/Sak/SakBanner'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import LoadSave from 'components/LoadSave/LoadSave'
import Modal from 'components/Modal/Modal'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sak } from 'declarations/types'
import _ from 'lodash'
import SEDEdit from 'pages/SvarSed/SEDEdit'
import SEDSearch from 'pages/SvarSed/SEDSearch'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

interface SvarSedSelector {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  replySedChanged: boolean
  replySed: ReplySed | null | undefined
  currentSak: Sak | undefined
}

const mapState = (state: State) => ({
  entries: state.localStorage.svarsed.entries,
  replySedChanged: state.svarsed.replySedChanged,
  replySed: state.svarsed.replySed,
  currentSak: state.svarsed.currentSak
})

export const SvarSedPage = (): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { t } = useTranslation()

  const [_currentPage, _setCurrentPage] = useState<string>('A')
  const [_showSaveModal, _setShowSaveModal] = useState<boolean>(false)
  const [_showSaveSedModal, _setShowSaveSedModal] = useState<boolean>(false)
  const params: URLSearchParams = new URLSearchParams(location.search)
  const { entries, replySed, replySedChanged, currentSak }: SvarSedSelector = useAppSelector(mapState)

  const changeMode = (newPage: string) => {
    _setCurrentPage(newPage)
  }

  const backToPageA = () => {
    if (_currentPage === 'B') {
      changeMode('A')
      dispatch(resetCurrentEntry('svarsed'))
      setTimeout(() =>
        dispatch(cleanUpSvarSed())
      , 200)
      document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
    }
    if (_currentPage === 'A') {
      dispatch(setCurrentSak(undefined))
    }
  }

  const onGoBackClick = () => {
    if (!replySedChanged) {
      backToPageA()
    } else {
      _setShowSaveModal(true)
    }
  }

  useEffect(() => {
    const rinasaksnummerParam: string | null = params.get('rinasaksnummer')
    const fnrParam: string | null = params.get('fnr')
    const temaParam: string | null = params.get('tema')
    const dokumenttypeParam: string | null = params.get('dokumenttype')
    if (fnrParam) {
      setStatusParam('fnr', fnrParam)
    }
    if (temaParam) {
      setStatusParam('tema', temaParam)
    }
    if (dokumenttypeParam) {
      setStatusParam('dokumenttype', dokumenttypeParam)
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
            dispatch(setReplySed(entry.content, false))
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
        <Modal
          open={_showSaveModal}
          onModalClose={() => _setShowSaveModal(false)}
          modal={{
            modalTitle: t('message:warning-x-not-saved', { x: 'SED' }),
            modalContent: (
              <>
                <div>
                  {t('message:warning-x-save', { x: 'SEDen' })}
                </div>
                <VerticalSeparatorDiv />
                <FlexDiv>
                  <Button
                    variant='primary' onClick={() => {
                      _setShowSaveModal(false)
                      _setShowSaveSedModal(true)
                    }}
                  >
                    {t('el:button-save-draft-x', { x: t('label:sed') })}
                  </Button>
                  <HorizontalSeparatorDiv />
                  <Button
                    variant='secondary' onClick={() => {
                      _setShowSaveModal(false)
                      backToPageA()
                    }}
                  >
                    {t('el:button-discard-changes')}
                  </Button>
                  <HorizontalSeparatorDiv />
                  <Button variant='tertiary' onClick={() => _setShowSaveModal(false)}>
                    {t('el:button-cancel')}
                  </Button>
                </FlexDiv>
              </>
            )
          }}
        />
        <Modal
          open={_showSaveSedModal}
          onModalClose={() => _setShowSaveSedModal(false)}
          modal={{
            closeButton: false,
            modalContent: (
              <SaveSEDModal
                replySed={replySed!}
                onSaved={() => _setShowSaveSedModal(false)}
                onCancelled={() => _setShowSaveSedModal(false)}
              />
            )
          }}
        />
        {currentSak !== undefined && (
          <SakBanner sak={currentSak} />
        )}
        <Container>
          <Margin />
          <Content style={{ flex: 6 }}>
            {_currentPage === 'A' && (
              <SEDSearch changeMode={changeMode} sak={currentSak!} />
            )}
            {_currentPage === 'B' && (
              <SEDEdit changeMode={changeMode} />
            )}
          </Content>
          <Content style={{ flex: 2 }}>
            {_currentPage === 'A' && (
              currentSak === undefined
                ? (
                  <LoadSave<ReplySed>
                    namespace='svarsed'
                    changeMode={changeMode}
                    loadReplySed={loadReplySed}
                  />
                  )
                : (
                  <Saksopplysninger sak={currentSak} />
                  )
            )}
            {_currentPage === 'B' && (
              <SEDDetails
                updateReplySed={updateReplySed}
              />
            )}
          </Content>
          <Margin />
        </Container>
      </>
    </TopContainer>
  )
}

export default SvarSedPage
