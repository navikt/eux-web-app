import { Button } from '@navikt/ds-react'
import { Container, Content, FlexDiv, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertSuccess } from 'actions/alert'
import { setStatusParam } from 'actions/app'
import { resetCurrentEntry, setCurrentEntry } from 'actions/localStorage'
import { cleanUpPDU1, searchPdu1s, loadPdu1 } from 'actions/pdu1'
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
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import PDU1Edit from './PDU1Edit'
import PDU1Search from './PDU1Search'

interface PDU1Selector {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  pdu1: PDU1 | null | undefined
  pdu1Changed: boolean
}

export interface PDU1PageProps {
  type: 'search' | 'edit' | 'create'
}

const mapState = (state: State) => ({
  entries: state.localStorage.svarsed.entries,
  pdu1: state.pdu1.pdu1,
  pdu1Changed: state.pdu1.pdu1Changed
})

export const PDU1Page: React.FC<PDU1PageProps> = ({
  type
}: PDU1PageProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [_showSaveModal, _setShowSaveModal] = useState<boolean>(false)
  const [_showSavePdu1Modal, _setShowSavePdu1Modal] = useState<boolean>(false)
  const params: URLSearchParams = new URLSearchParams(window.location.search)

  const { entries, pdu1Changed, pdu1 }: PDU1Selector = useAppSelector(mapState)

  const goToSearchPage = () => {
    navigate({ pathname: '/pdu1/search', search: window.location.search })
    dispatch(resetCurrentEntry('pdu1'))
  }

  const onGoBackClick = () => {
    if (!pdu1Changed) {
      setTimeout(() =>
        dispatch(cleanUpPDU1())
      , 200)
      goToSearchPage()
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
      dispatch(searchPdu1s(fnrParam))
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
            dispatch(loadPdu1(entry.content as PDU1))
            navigate({
              pathname: '/pdu1/edit/' + (entry.content as PDU1).saksreferanse,
              search: window.location.search
            })
            dispatch(alertSuccess(t('message:success-pdu1-reloaded-after-token', { name })))
          }
        }
        setMounted(true)
      }
    }
  }, [entries])

  return (
    <TopContainer
      backButton={type === 'edit' || type === 'create'}
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
                    goToSearchPage()
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
          {type === 'search' && (<PDU1Search />)}
          {(type === 'create' || type === 'edit') && (<PDU1Edit type={type} />)}
        </Content>
        <Content style={{ flex: 2 }}>
          {type === 'search' && (
            <SideBarDiv>
              <LoadSave<PDU1>
                namespace='pdu1'
                loadReplySed={loadPdu1}
              />
            </SideBarDiv>
          )}
          {(type === 'create' || type === 'edit') && (<PDU1Details />)}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default PDU1Page
