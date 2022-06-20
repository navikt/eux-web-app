import { Button } from '@navikt/ds-react'
import { Container, Content, FlexDiv, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import { cleanUpPDU1, fetchPdu1, loadPdu1, setPdu1 } from 'actions/pdu1'
import { setCurrentSak } from 'actions/svarsed'
import PDU1Details from 'applications/PDU1/PDU1Details/PDU1Details'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import LoadSave from 'components/LoadSave/LoadSave'
import Modal from 'components/Modal/Modal'
import { SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import PDU1Edit from './PDU1Edit'
import PDU1Search from './PDU1Search'

interface PDU1Selector {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  pdu1: PDU1 | null | undefined
  pdu1Changed: boolean
}

const mapState = (state: State) => ({
  entries: state.localStorage.svarsed.entries,
  pdu1: state.pdu1.pdu1,
  pdu1Changed: state.pdu1.pdu1Changed
})

export const PDU1Page = (): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const location = useLocation()

  const [_currentPage, _setCurrentPage] = useState<string>('A')
  const [_showSaveModal, _setShowSaveModal] = useState<boolean>(false)
  const [_showSavePdu1Modal, _setShowSavePdu1Modal] = useState<boolean>(false)
  const params: URLSearchParams = new URLSearchParams(location.search)

  const { entries, pdu1Changed, pdu1 }: PDU1Selector = useAppSelector(mapState)

  const changeMode = (newPage: string) => {
    _setCurrentPage(newPage)
  }

  const backToPageA = () => {
    if (_currentPage === 'B') {
      changeMode('A')
      dispatch(resetCurrentEntry('pdu1'))
      document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
    }
    dispatch(setCurrentSak(undefined))
  }

  const onGoBackClick = () => {
    if (!pdu1Changed) {
      changeMode('A')
      dispatch(cleanUpPDU1())
      backToPageA()
    } else {
      _setShowSaveModal(true)
    }
  }

  useEffect(() => {
    const fnrParam: string | null = params.get('fnr')
    const temaParam: string | null = params.get('tema')
    const dokumenttypeParam: string | null = params.get('dokumenttype')
    if (fnrParam) {
      setStatusParam('fnr', fnrParam)
      dispatch(fetchPdu1(fnrParam))
    }
    if (temaParam) {
      setStatusParam('tema', temaParam)
    }
    if (dokumenttypeParam) {
      setStatusParam('dokumenttype', dokumenttypeParam)
    }
  }, [])

  useEffect(() => {
    if (!mounted) {
      // Load PDU1 from localStorage if I see a GET param - used for token renew
      // I have to wait until localStorage is loaded
      if (entries !== undefined) {
        const name: string | null = params.get('name')
        if (name) {
          const entry: LocalStorageEntry<PDU1> | undefined =
            _.find(entries, (e: LocalStorageEntry<PDU1>) => e.name === name) as LocalStorageEntry<PDU1> | undefined
          if (entry) {
            dispatch(setCurrentEntry('pdu1', entry))
            dispatch(setPdu1(entry.content as PDU1))
            changeMode('B')
            dispatch(alertSuccess(t('message:success-pdu1-reloaded-after-token', { name })))
          }
        }
        setMounted(true)
      }
    }
  }, [entries])

  return (
    <TopContainer
      backButton={_currentPage === 'B'}
      onGoBackClick={onGoBackClick}
      unsavedDoc={pdu1Changed}
      title={t('app:page-title-pdu1')}
    >
      <Modal
        open={_showSaveModal}
        onModalClose={() => _setShowSaveModal(false)}
        modal={{
          modalTitle: t('message:warning-x-not-saved', { x: 'PDU1' }),
          modalContent: (
            <>
              <div>
                {t('message:warning-x-save', { x: 'PDU1' })}
              </div>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <Button
                  variant='primary' onClick={() => {
                    _setShowSaveModal(false)
                    _setShowSavePdu1Modal(true)
                  }}
                >
                  {t('el:button-save-draft-x', { x: t('label:pdu1') })}
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
        open={_showSavePdu1Modal}
        onModalClose={() => _setShowSavePdu1Modal(false)}
        modal={{
          closeButton: false,
          modalContent: (
            <SavePDU1Modal
              pdu1={pdu1!}
              onSaved={() => _setShowSavePdu1Modal(false)}
              onCancelled={() => _setShowSavePdu1Modal(false)}
            />
          )
        }}
      />

      <Container>
        <Margin />
        <Content style={{ flex: 6 }}>
          {_currentPage === 'A' && (
            <PDU1Search changeMode={changeMode} />
          )}
          {_currentPage === 'B' && (
            <PDU1Edit />
          )}
        </Content>
        <Content style={{ flex: 2 }}>
          {_currentPage === 'A' && (
            <SideBarDiv>
              <LoadSave<PDU1>
                namespace='pdu1'
                changeMode={changeMode}
                loadReplySed={loadPdu1}
              />
            </SideBarDiv>
          )}
          {_currentPage === 'B' && (
            <PDU1Details />
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default PDU1Page
