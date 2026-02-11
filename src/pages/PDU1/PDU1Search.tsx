import {Alert, BodyLong, Box, Button, Heading, HStack, Label, Loader, Select, VStack} from '@navikt/ds-react'
import * as appActions from 'actions/app'
import {
  searchPdu1s,
  getFagsaker,
  getStoredPdu1AsPDF,
  resetFagsaker,
  resetPdu1results,
  resetStoredPdu1AsPDF, createFagsak
} from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import classNames from 'classnames'
import Modal from 'components/Modal/Modal'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import {Fagsaker, PDU1SearchResult, PDU1SearchResults, Fagsak, PersonInfoPDL} from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import { blobToBase64 } from 'utils/blob'
import { validatePdu1Search, ValidationPdu1SearchProps } from './mainValidation'
import PersonSearch from "../../applications/OpprettSak/PersonSearch/PersonSearch";
import * as types from "../../constants/actionTypes";
import * as personActions from "../../actions/person";
import SakSidebar from "../../applications/PDU1/SakSidebar/SakSidebar";
import moment from "moment";
import PDFViewer from "../../components/PDFViewer/PDFViewer";
import styles from "./PDU1.module.css"

export interface PDU1SearchSelector {
  fnrParam: string | undefined
  fagsaker: Fagsaker | null | undefined
  createdFagsak: string | null | undefined
  creatingFagsak: boolean
  gettingFagsaker: boolean
  creatingPdu1: boolean
  gettingPdu1: boolean
  fetchingPdu1: boolean
  previewStoredPdu1: Blob | null | undefined
  gettingPreviewStoredPdu1: boolean
  pdu1results: PDU1SearchResults | null | undefined

  person: PersonInfoPDL | null | undefined
  searchingPerson: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
}

const mapState = (state: State): PDU1SearchSelector => ({
  fnrParam: state.app.params.fnr,
  fagsaker: state.pdu1.fagsaker,
  createdFagsak: state.pdu1.createdFagsak,
  creatingFagsak: state.loading.creatingFagsak,
  gettingFagsaker: state.loading.gettingFagsaker,
  creatingPdu1: state.loading.creatingPdu1,
  gettingPdu1: state.loading.gettingPdu1,
  fetchingPdu1: state.loading.fetchingPdu1,
  previewStoredPdu1: state.pdu1.previewStoredPdu1,
  gettingPreviewStoredPdu1: state.loading.gettingPreviewStoredPdu1,
  pdu1results: state.pdu1.pdu1results,

  person: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type
})

const PDU1Search = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    fagsaker,
    createdFagsak,
    creatingFagsak,
    gettingFagsaker,
    creatingPdu1,
    gettingPdu1,
    fetchingPdu1,
    pdu1results,
    gettingPreviewStoredPdu1,
    previewStoredPdu1,
    fnrParam,
    person,
    searchingPerson,
    alertMessage,
    alertType
  }: PDU1SearchSelector = useAppSelector(mapState)

  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const q: string | null = params.get('q')
  const currentYear = new Date().getFullYear()

  const [fnrOrDnr, setFnrOrDnr] = useState<string | null | undefined>(fnrParam ?? q)
  const [tema, setTema] = useState<string | undefined>(undefined)

  const [validFnr, setValidFnr] = useState<boolean>(false)
  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)

  const [newPdu1Mode, setNewPdu1Mode] = useState<boolean>(false)
  const [searchPdu1Mode, setSearchPdu1Mode] = useState<boolean>(false)
  const [requestPreview, setRequestPreview] = useState<boolean>(false)
  const [fagsakYear, setFagsakYear] = useState<any>(currentYear)

  const namespace = 'pdu1search'
  const [validation, _resetValidation, performValidation] = useLocalValidation<ValidationPdu1SearchProps>(validatePdu1Search, namespace)


  const onNewPdu1Mode = () => {
    dispatch(resetPdu1results())
    setSearchPdu1Mode(false)
    setNewPdu1Mode(true)
    setTema("DAG")
    setFagsakYear(currentYear)
    if (fnrOrDnr) {
      dispatch(getFagsaker(fnrOrDnr, 'PD', "DAG"))
    }
  }

  const onCreateFagsak = () => {
    if (fnrOrDnr) {
      dispatch(createFagsak(fnrOrDnr, {aar: fagsakYear}))
    }
  }

  const onSearchPdu1Mode = () => {
    setNewPdu1Mode(false)
    setSearchPdu1Mode(true)
    dispatch(resetFagsaker())
    setTema(undefined)
    if (fnrOrDnr) {
      dispatch(searchPdu1s(fnrOrDnr))
    }
  }

  const onCreatingPdu1 = (fagsakId: string, fagsakNr: string | null | undefined) => {
    const valid = performValidation({
      fnrOrDnr,
      fagsakId,
      saksreferanse: fagsakNr
    })
    if (valid && fagsakNr) {
      navigate({
        pathname: '/pdu1/create/fnr/' + fnrOrDnr! + '/fagsak/' + encodeURIComponent(fagsakId) + '/saksreferanse/' + encodeURIComponent(fagsakNr),
        search: '?q=' + fnrOrDnr
      })
    }
  }

  const onEditingPdu1 = (pdu1SearchResult: PDU1SearchResult) => {
    if (pdu1SearchResult) {
      navigate({
        pathname: '/pdu1/edit/postId/' + pdu1SearchResult.journalpostId + '/docId/' + pdu1SearchResult.dokumentInfoId + '/fagsak/' + encodeURIComponent(pdu1SearchResult.fagsakId),
        search: '?q=' + fnrOrDnr
      })
    }
  }

  const onPreviewingStoredPdu1 = (pdu1SearchResult: PDU1SearchResult) => {
    if (pdu1SearchResult) {
      setRequestPreview(true)
      dispatch(getStoredPdu1AsPDF(pdu1SearchResult.journalpostId!, pdu1SearchResult.dokumentInfoId!))
    }
  }

  const isPDU1 = (r: PDU1SearchResult) => r.brevkode === 'DAG_EOS_U1'

  const handleModalClose = () => {
    dispatch(resetStoredPdu1AsPDF())
    setPreviewModal(undefined)
  }

  const showPreviewModal = (previewFile: Blob) => {
    blobToBase64(previewFile).then((base64: any) => {
      setPreviewModal({
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <PDFViewer
              file={base64.replaceAll('octet-stream', 'pdf')}
              name=""
              size={previewFile.size}
              width={600}
              height={1200}
            />
          </div>
        )
      })
    })
  }

  useEffect(() => {
    if (requestPreview && !previewModal && !_.isNil(previewStoredPdu1)) {
      setRequestPreview(false)
      showPreviewModal(previewStoredPdu1)
    }
  }, [previewStoredPdu1])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1-search'))
    return () => {
      dispatch(finishPageStatistic('pdu1-search'))
    }
  }, [])

  return (
    <VStack width="780px" align="center">
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={handleModalClose}
      />
      <VStack gap="4" width="100%">
        <Heading size='medium'>
          {t('app:page-title-pdu1-search')}
        </Heading>
        <Box
          width="100%"
          className={classNames({ error: validation[namespace + '-search'] })}
        >
          <VStack gap="4">
            <PersonSearch
              key={namespace + '-fnr-'}
              alertMessage={alertMessage}
              alertType={alertType}
              alertTypesWatched={[types.PERSON_SEARCH_FAILURE]}
              data-testid={namespace + '-fnr'}
              error={validation[namespace + '-fnr']?.feilmelding}
              searchingPerson={searchingPerson}
              id={namespace + '-fnr'}
              initialFnr=''
              value={fnrOrDnr!}
              parentNamespace={namespace}
              onFnrChange={() => {
                if (validFnr) {
                  setNewPdu1Mode(false)
                  setSearchPdu1Mode(false)
                  _resetValidation(namespace + '-search')
                  setValidFnr(false)
                  dispatch(appActions.appReset())
                }
              }}
              onPersonFound={() => {
                setValidFnr(true)
                setFnrOrDnr(person?.fnr)
              }}
              onSearchPerformed={(fnr: string) => {
                dispatch(personActions.searchPerson(fnr))
              }}
              person={person}
            />
            <SakSidebar />
          </VStack>
        </Box>
        <HStack gap="4" align="center" paddingBlock="4">
          <Button
            variant='primary'
            disabled={!validFnr || searchPdu1Mode}
            onClick={onSearchPdu1Mode}
          >
            {fetchingPdu1 && <Loader />}
            {fetchingPdu1 ? t('message:loading-searching') : t('el:button-search-for-x', { x: 'PD U1' })}
          </Button>
          {t('label:eller')}
          <Button
            variant='primary'
            disabled={!validFnr}
            onClick={onNewPdu1Mode}
          >
            {t('el:button-start-new-x', { x: 'PD U1' })}
          </Button>
        </HStack>
        {newPdu1Mode && (
          <VStack gap="4" align="center">
            <HorizontalLineSeparator />
            <Box paddingBlock="4">
              <VStack gap="4" align="center">
                <Heading size='small'>
                  {t('el:button-start-new-x', { x: 'PD U1' })}
                </Heading>
                {!gettingFagsaker &&
                  <HStack gap="4" align="end">
                    <Select label="År" hideLabel={true} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFagsakYear(e.currentTarget.value)}>
                      <option value={currentYear}>{currentYear}</option>
                      <option value={currentYear - 1}>{currentYear - 1}</option>
                      <option value={currentYear - 2}>{currentYear - 2}</option>
                      <option value={currentYear - 3}>{currentYear - 3}</option>
                      <option value={currentYear - 4}>{currentYear - 4}</option>
                    </Select>
                    <Box>
                      <Button
                        variant='primary'
                        disabled={!validFnr}
                        loading={creatingFagsak}
                        onClick={onCreateFagsak}
                      >
                        {t('el:button-create-x', { x: 'fagsak' })}
                      </Button>
                    </Box>
                  </HStack>
                }
              </VStack>
            </Box>

            <VStack gap="2" width="100%">
              {gettingFagsaker && (
                <WaitingPanel />
              )}
              {createdFagsak &&
                <Alert size="small" variant='warning'>
                  OBS: Husk å journalføre i Gosys før du oppretter ny PD U1
                </Alert>
              }
              {fagsaker?.filter((f: Fagsak) => f.type === "FAGSAK").map((f: Fagsak) => (
                <Box
                  key={f._id}
                  borderWidth="1"
                  borderColor="border-default"
                  borderRadius="small"
                  padding="4"
                  background="bg-default"
                  className={classNames({
                    [styles.new]: createdFagsak === f._id
                  })}
                >
                  <HStack gap="4" justify="space-between" align="center">
                    <VStack gap="1">
                      <HStack gap="2">
                        <Label>{t('label:fagsakNr')}:</Label>
                        <BodyLong>{f.nr}</BodyLong>
                      </HStack>
                      <HStack gap="2">
                        <Label>{t('label:dato-opprettet')}:</Label>
                        <BodyLong>{moment(f.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}</BodyLong>
                      </HStack>
                    </VStack>
                    <Box>
                      <Button
                        variant='primary'
                        disabled={!tema || creatingPdu1}
                        onClick={() => onCreatingPdu1(f._id!, f.nr)}
                      >
                        {creatingPdu1 && <Loader />}
                        {creatingPdu1 ? t('label:laster') : t('el:button-create-x', { x: 'PD U1' })}
                      </Button>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        )}
      {searchPdu1Mode && (
        <VStack gap="2" align="center">
          <HorizontalLineSeparator />
          <Box paddingBlock="4">
            <Heading size='small'>
              {t('el:button-edit-x', { x: 'PD U1' })}
            </Heading>
          </Box>
          {fetchingPdu1 && <Loader />}
          {pdu1results?.filter(isPDU1)
            .map((pdu1SearchResult: PDU1SearchResult) => (
              <Box borderWidth="1" borderColor="border-default" borderRadius="small" padding="4" background="bg-default" width="100%" key={pdu1SearchResult.journalpostId + '-' + pdu1SearchResult.dokumentInfoId}>
                <HStack gap="4" justify="space-between" align="start">
                  <VStack gap="1">
                    <HStack gap="2">
                      <Label>{t('label:fagsakNr')}:</Label>
                      <BodyLong>{pdu1SearchResult.fagsakId}</BodyLong>
                    </HStack>
                    <HStack gap="2">
                      <Label>{t('label:tittel')}:</Label>
                      <BodyLong>{pdu1SearchResult.tittel}</BodyLong>
                    </HStack>
                    <HStack gap="2">
                      <Label>{t('label:dato-opprettet')}:</Label>
                      <BodyLong>{moment(pdu1SearchResult.datoOpprettet).format('DD.MM.YYYY HH:mm')}</BodyLong>
                    </HStack>
                  </VStack>
                  <VStack gap="2">
                    <Button
                      variant='primary'
                      disabled={gettingPdu1 || pdu1SearchResult.dokumentvarianter.indexOf('ORIGINAL') < 0}
                      onClick={() => onEditingPdu1(pdu1SearchResult)}
                    >
                      {gettingPdu1 && <Loader />}
                      {gettingPdu1 ? t('label:laster') : t('el:button-edit-x', { x: 'PD U1' })}
                    </Button>
                    <Button
                      variant='secondary'
                      disabled={!pdu1SearchResult || gettingPreviewStoredPdu1 || pdu1SearchResult.dokumentvarianter.indexOf('ARKIV') < 0}
                      onClick={() => onPreviewingStoredPdu1(pdu1SearchResult)}
                    >
                      {gettingPreviewStoredPdu1 && <Loader />}
                      {gettingPreviewStoredPdu1 ? t('label:laster') : t('el:button-preview-x', { x: 'PD U1' })}
                    </Button>
                  </VStack>
                </HStack>
              </Box>
            ))}
        </VStack>
      )}
      </VStack>
    </VStack>
  )
}

export default PDU1Search
