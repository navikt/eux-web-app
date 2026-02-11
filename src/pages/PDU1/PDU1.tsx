import {Button, HStack, Page, Spacer} from '@navikt/ds-react'
import { setStatusParam } from 'actions/app'
import { cleanUpPDU1, searchPdu1s } from 'actions/pdu1'
import Modal from 'components/Modal/Modal'
import TopContainer from 'components/TopContainer/TopContainer'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import PDU1Edit from './PDU1Edit'
import PDU1Search from './PDU1Search'
import styles from "./PDU1.module.css"

interface PDU1Selector {
  pdu1: PDU1 | null | undefined
  pdu1Changed: boolean
}

export interface PDU1PageProps {
  type: 'search' | 'edit' | 'create'
}

const mapState = (state: State) => ({
  pdu1: state.pdu1.pdu1,
  pdu1Changed: state.pdu1.pdu1Changed
})

export const PDU1Page: React.FC<PDU1PageProps> = ({
  type
}: PDU1PageProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [_showSaveModal, _setShowSaveModal] = useState<boolean>(false)
  const params: URLSearchParams = new URLSearchParams(window.location.search)

  const { pdu1Changed }: PDU1Selector = useAppSelector(mapState)

  const goToSearchPage = () => {
    navigate({
      pathname: '/pdu1/search',
      search: window.location.search
    })
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

  return (
    <Page className={styles.page}>
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
                <HStack gap="4">
                  <Button
                    variant='secondary' onClick={() => {
                      _setShowSaveModal(false)
                      goToSearchPage()
                    }}
                  >
                    {t('el:button-discard-changes')}
                  </Button>
                  <Button variant='tertiary' onClick={() => _setShowSaveModal(false)}>
                    {t('el:button-cancel')}
                  </Button>
                </HStack>
              </>
            )
          }}
        />
        <Page.Block width="2xl" gutters as="main" background="bg-subtle">
          <HStack padding="12" width="100%">
            <Spacer/>
            {type === 'search' && (<PDU1Search />)}
            {(type === 'create' || type === 'edit') && (<PDU1Edit type={type} />)}
            <Spacer/>
          </HStack>
        </Page.Block>
      </TopContainer>
    </Page>
  )
}

export default PDU1Page
