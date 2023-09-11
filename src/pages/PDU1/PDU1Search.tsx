import {Alert, BodyLong, Button, Heading, Label, Loader, Panel} from '@navikt/ds-react'
import FileFC, { File } from '@navikt/forhandsvisningsfil'
import {
  AlignStartRow,
  Column,
  FlexBaseDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import * as appActions from 'actions/app'
import {
  searchPdu1s,
  getFagsaker,
  getStoredPdu1AsPDF,
  resetFagsaker,
  resetPdu1results,
  resetStoredPdu1AsPDF
} from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import Select from 'components/Forms/Select'
import Modal from 'components/Modal/Modal'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Option, Options } from 'declarations/app'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import {Fagsaker, PDU1SearchResult, PDU1SearchResults, Fagsak, Person} from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { blobToBase64 } from 'utils/blob'
import { validatePdu1Search, ValidationPdu1SearchProps } from './mainValidation'
import PersonSearch from "../../applications/OpprettSak/PersonSearch/PersonSearch";
import * as types from "../../constants/actionTypes";
import * as personActions from "../../actions/person";
import SakSidebar from "../../applications/OpprettSak/SakSidebar/SakSidebar";

const ContainerDiv = styled(PileCenterDiv)`
  width: 780px;
  align-items: center;
`

export interface PDU1SearchSelector {
  fnrParam: string | undefined
  fagsaker: Fagsaker | null | undefined
  gettingFagsaker: boolean
  creatingPdu1: boolean
  gettingPdu1: boolean
  fetchingPdu1: boolean
  previewStoredPdu1: Blob | null | undefined
  gettingPreviewStoredPdu1: boolean
  pdu1results: PDU1SearchResults | null | undefined

  person: Person | null | undefined
  searchingPerson: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
}

const mapState = (state: State): PDU1SearchSelector => ({
  fnrParam: state.app.params.fnr,
  fagsaker: state.pdu1.fagsaker,
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

  const [fnrOrDnr, setFnrOrDnr] = useState<string | null | undefined>(fnrParam ?? q)
  const [tema, setTema] = useState<string | undefined>(undefined)

  const [validFnr, setValidFnr] = useState<boolean>(false)
  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)

  const [newPdu1Mode, setNewPdu1Mode] = useState<boolean>(false)
  const [searchPdu1Mode, setSearchPdu1Mode] = useState<boolean>(false)
  const [requestPreview, setRequestPreview] = useState<boolean>(false)

  const namespace = 'pdu1search'
  const [validation, _resetValidation, performValidation] = useLocalValidation<ValidationPdu1SearchProps>(validatePdu1Search, namespace)

  const [gradering, setGradering] = useState<string | null>(null)

  const temaOptions: Options = [
    { label: t('tema:GEN'), value: 'GEN' },
    { label: t('tema:AAP'), value: 'AAP' },
    { label: t('tema:BAR'), value: 'BAR' },
    { label: t('tema:DAG'), value: 'DAG' },
    { label: t('tema:FEI'), value: 'FEI' },
    { label: t('tema:FOR'), value: 'FOR' },
    { label: t('tema:GRA'), value: 'GRA' },
    { label: t('tema:KON'), value: 'KON' },
    { label: t('tema:MED'), value: 'MED' },
    { label: t('tema:OMS'), value: 'OMS' },
    { label: t('tema:PEN'), value: 'PEN' },
    { label: t('tema:SYK'), value: 'SYK' },
    { label: t('tema:YRK'), value: 'YRK' },
    { label: t('tema:UFO'), value: 'UFO' },
    { label: t('tema:GRU'), value: 'GRU' },
    { label: t('tema:KTR'), value: 'KTR' },
    { label: t('tema:TRY'), value: 'TRY' },
    { label: t('tema:SUP'), value: 'SUP' },
    { label: t('tema:UFM'), value: 'UFM' }
  ]

  const onTemaChanged = (o: unknown) => {
    if (validation[namespace + '-tema']) {
      dispatch(resetValidation(namespace + '-tema'))
    }
    setTema((o as Option).value)
    if (fnrOrDnr) {
      dispatch(getFagsaker(fnrOrDnr, 'PD', (o as Option).value))
    }
  }

  const onNewPdu1Mode = () => {
    dispatch(resetPdu1results())
    setSearchPdu1Mode(false)
    setNewPdu1Mode(true)
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

  const resetPreview = () => {
    dispatch(resetStoredPdu1AsPDF())
    setPreviewModal(undefined)
  }

  const showPreviewModal = (previewFile: Blob) => {
    blobToBase64(previewFile).then((base64: any) => {
      const file: File = {
        id: '' + new Date().getTime(),
        size: previewFile.size,
        name: '',
        mimetype: 'application/pdf',
        content: {
          base64: base64.replaceAll('octet-stream', 'pdf')
        }
      }

      setPreviewModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <FileFC
              file={{
                ...file,
                mimetype: 'application/pdf'
              }}
              width={600}
              height={1200}
              tema='simple'
              viewOnePage={false}
              onContentClick={resetPreview}
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
    <ContainerDiv>
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={() => setPreviewModal(undefined)}
      />
      <Heading size='medium'>
        {t('app:page-title-pdu1-search')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        style={{ width: '100%' }}
        className={classNames({ error: validation[namespace + '-search'] })}
      >
        <Column>
          <PileDiv>
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
                  setGradering(null)
                }
              }}
              onPersonFound={() => {
                setValidFnr(true)
                setFnrOrDnr(person?.fnr)
                setGradering(person?.adressebeskyttelse ? person.adressebeskyttelse : null)
              }}
              onSearchPerformed={(fnr: string) => {
                dispatch(personActions.searchPerson(fnr))
              }}
              person={person}
            />
            <VerticalSeparatorDiv/>
            <SakSidebar />
            <VerticalSeparatorDiv/>
            {gradering &&
              <Alert size="small" variant='warning'>
                {t('label:sensitivPerson', {gradering: gradering})}
              </Alert>
            }
          </PileDiv>
        </Column>
      </AlignStartRow>
      <AlignStartRow
        style={{ width: '100%' }}
        className={classNames({ error: validation[namespace + '-search'] })}
      >
        <Column>
          <FlexBaseDiv style={{ marginTop: '2rem' }}>
            <Button
              variant='primary'
              disabled={!validFnr || searchPdu1Mode}
              onClick={onSearchPdu1Mode}
            >
              {fetchingPdu1 && <Loader />}
              {fetchingPdu1 ? t('message:loading-searching') : t('el:button-search-for-x', { x: 'PD U1' })}
            </Button>
            <HorizontalSeparatorDiv />
            {t('label:eller')}
            <HorizontalSeparatorDiv />
            <Button
              variant='primary'
              disabled={!validFnr}
              onClick={onNewPdu1Mode}
            >
              {t('el:button-start-new-x', { x: 'PD U1' })}
            </Button>
          </FlexBaseDiv>
        </Column>
      </AlignStartRow>
      {newPdu1Mode && (
        <>
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv size='2' />
          <Heading size='small'>
            {t('el:button-start-new-x', { x: 'PD U1' })}
          </Heading>
          <VerticalSeparatorDiv size='2' />
          <AlignStartRow>
            <Column>
              <Select
                label={t('label:tema')}
                defaultValue={_.find(temaOptions, { value: tema })}
                error={validation[namespace + '-tema']?.feilmelding}
                id={namespace + '-tema'}
                menuPortalTarget={document.body}
                onChange={onTemaChanged}
                options={temaOptions}
                value={_.find(temaOptions, { value: tema })}
                style={{ minWidth: '300px' }}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          <div style={{ width: '100%' }}>
            {gettingFagsaker && (
              <WaitingPanel />
            )}
            {fagsaker?.map((f: Fagsak) => (
              <Panel style={{ marginBottom: '1rem' }} border key={f.id}>
                <FlexDiv>
                  <PileDiv flex='2'>
                    <FlexBaseDiv>
                      <Label>{t('label:fagsakNr')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{f.nr}</BodyLong>
                    </FlexBaseDiv>
                    <FlexBaseDiv>
                      <Label>{t('label:tema')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{f.tema}</BodyLong>
                    </FlexBaseDiv>
                    <FlexBaseDiv>
                      <Label>{t('label:saksnummer')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{f.id}</BodyLong>
                    </FlexBaseDiv>
                    <FlexBaseDiv>
                      <Label>{t('label:sist-oppdatert')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{f.opprettetdato}</BodyLong>
                    </FlexBaseDiv>
                  </PileDiv>
                  <PileDiv>
                    <Button
                      variant='primary'
                      disabled={!tema || creatingPdu1}
                      onClick={() => onCreatingPdu1(f.id, f.nr)}
                    >
                      {creatingPdu1 && <Loader />}
                      {creatingPdu1 ? t('label:laster') : t('el:button-create-x', { x: 'PD U1' })}
                    </Button>
                  </PileDiv>
                </FlexDiv>
              </Panel>

            ))}
          </div>
          <VerticalSeparatorDiv />

        </>
      )}
      {searchPdu1Mode && (
        <>
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv size='2' />
          <Heading size='small'>
            {t('el:button-edit-x', { x: 'PD U1' })}
          </Heading>
          <VerticalSeparatorDiv size='2' />
          {fetchingPdu1 && <Loader />}
          {pdu1results?.filter(isPDU1)
            .map((pdu1SearchResult: PDU1SearchResult) => (
              <Panel border style={{ width: '100%', marginBottom: '1rem' }} key={pdu1SearchResult.journalpostId + '-' + pdu1SearchResult.dokumentInfoId}>
                <FlexDiv>
                  <PileDiv flex='2'>
                    <FlexBaseDiv>
                      <Label>{t('label:fagsakNr')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{pdu1SearchResult.fagsakId}</BodyLong>
                    </FlexBaseDiv>
                    <FlexBaseDiv>
                      <Label>{t('label:tittel')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{pdu1SearchResult.tittel}</BodyLong>
                    </FlexBaseDiv>
                    <FlexBaseDiv>
                      <Label>{t('label:tema')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{pdu1SearchResult.tema}</BodyLong>
                    </FlexBaseDiv>
                    <FlexBaseDiv>
                      <Label>{t('label:dato-opprettet')}:</Label>
                      <HorizontalSeparatorDiv size='0.35' />
                      <BodyLong>{pdu1SearchResult.datoOpprettet}</BodyLong>
                    </FlexBaseDiv>
                  </PileDiv>
                  <PileDiv>
                    <Button
                      variant='primary'
                      disabled={gettingPdu1 || pdu1SearchResult.dokumentvarianter.indexOf('ORIGINAL') < 0}
                      onClick={() => onEditingPdu1(pdu1SearchResult)}
                    >
                      {gettingPdu1 && <Loader />}
                      {gettingPdu1 ? t('label:laster') : t('el:button-edit-x', { x: 'PD U1' })}
                    </Button>
                    <VerticalSeparatorDiv />
                    <Button
                      variant='secondary'
                      disabled={!pdu1SearchResult || gettingPreviewStoredPdu1 || pdu1SearchResult.dokumentvarianter.indexOf('ARKIV') < 0}
                      onClick={() => onPreviewingStoredPdu1(pdu1SearchResult)}
                    >
                      {gettingPreviewStoredPdu1 && <Loader />}
                      {gettingPreviewStoredPdu1 ? t('label:laster') : t('el:button-preview-x', { x: 'PD U1' })}
                    </Button>
                  </PileDiv>
                </FlexDiv>
              </Panel>
            ))}
        </>
      )}
    </ContainerDiv>
  )
}

export default PDU1Search
