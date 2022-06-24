import { BodyLong, Button, Heading, Label, Loader } from '@navikt/ds-react'
import validator from '@navikt/fnrvalidator'
import FileFC, { File } from '@navikt/forhandsvisningsfil'
import {
  AlignStartRow,
  Column,
  FlexBaseDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  RadioPanelBorder,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import * as appActions from 'actions/app'
import {
  searchPdu1s,
  getFagsaker,
  getStoredPdu1AsJSON,
  getStoredPdu1AsPDF,
  resetFagsaker,
  resetPdu1results,
  getPdu1Template,
  resetStoredPdu1AsPDF
} from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import Modal from 'components/Modal/Modal'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Option, Options } from 'declarations/app'
import { ModalContent } from 'declarations/components'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { FagSak, FagSaker, PDU1SearchResult, PDU1SearchResults } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { blobToBase64 } from 'utils/blob'
import { validatePdu1Search, ValidationPdu1SearchProps } from './mainValidation'

const ContainerDiv = styled(PileCenterDiv)`
  width: 780px;
  align-items: center;
`

export interface PDU1SearchSelector {
  fnrParam: string | undefined
  fagsaker: FagSaker | null | undefined
  gettingFagsaker: boolean
  creatingPdu1: boolean
  gettingPdu1: boolean
  fetchingPdu1: boolean
  previewStoredPdu1: Blob | null | undefined
  gettingPreviewStoredPdu1: boolean
  PDU1: PDU1 | null | undefined
  pdu1results: PDU1SearchResults | null | undefined
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
  PDU1: state.pdu1.pdu1,
  pdu1results: state.pdu1.pdu1results
})

export interface PDU1Props {
  changeMode: (newPage: string) => void
}

const PDU1Search: React.FC<PDU1Props> = ({
  changeMode
}: PDU1Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    fagsaker,
    gettingFagsaker,
    creatingPdu1,
    gettingPdu1,
    fetchingPdu1,
    PDU1,
    pdu1results,
    gettingPreviewStoredPdu1,
    previewStoredPdu1,
    fnrParam
  }: PDU1SearchSelector = useAppSelector(mapState)
  const [fnrOrDnr, setFnrOrDnr] = useState<string | undefined>(fnrParam)

  const [fagsak, setFagsak] = useState<string | undefined>(undefined)
  const [tema, setTema] = useState<string | undefined>(undefined)
  const [pdu1SearchResult, setPdu1SearchResult] = useState< PDU1SearchResult | undefined>(undefined)

  const [validFnr, setValidFnr] = useState<boolean>(false)
  const [validMessage, setValidMessage] = useState<string>('')
  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)

  const [loadingForEditPdu1Mode, setLoadingForEditPdu1Mode] = useState<boolean>(false)
  const [newPdu1Mode, setNewPdu1Mode] = useState<boolean>(false)
  const [searchPdu1Mode, setSearchPdu1Mode] = useState<boolean>(false)
  const [requestPreview, setRequestPreview] = useState<boolean>(false)

  const namespace = 'pdu1search'
  const [validation, _resetValidation, performValidation] = useLocalValidation<ValidationPdu1SearchProps>(validatePdu1Search, namespace)

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

  const onFnrDnrChange = (query: string) => {
    dispatch(appActions.cleanData())
    setNewPdu1Mode(false)
    setSearchPdu1Mode(false)
    _resetValidation(namespace + '-search')
    setFnrOrDnr(query)
    const result = validator.idnr(query)
    if (result.status !== 'valid') {
      setValidFnr(false)
      setValidMessage(t('label:ukjent'))
    } else {
      setValidFnr(true)
      if (result.type === 'fnr') {
        setValidMessage(t('label:valid-fnr'))
      }
      if (result.type === 'dnr') {
        setValidMessage(t('label:valid-dnr'))
      }
    }
  }

  const onTemaChanged = (o: unknown) => {
    if (validation[namespace + '-tema']) {
      dispatch(resetValidation(namespace + '-tema'))
    }
    setTema((o as Option).value)
    if (fnrOrDnr) {
      dispatch(getFagsaker(fnrOrDnr, 'PD', (o as Option).value))
    }
  }

  const onFagsakerSelected = (f: string) => {
    if (validation[namespace + '-fagsaker']) {
      dispatch(resetValidation(namespace + '-fagsaker'))
    }
    setFagsak(f)
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

  const onPdu1SearchResultSelected = (ids: string) => {
    const _ids = ids.split('-')
    const pdu1SearchResult = _.find(pdu1results, { journalpostId: _ids[0], dokumentInfoId: _ids[1] })
    setPdu1SearchResult(pdu1SearchResult)
  }

  const onCreatingPdu1 = () => {
    const valid = performValidation({
      fnrOrDnr,
      fagsak
    })
    if (valid) {
      setLoadingForEditPdu1Mode(true)
      dispatch(getPdu1Template(fnrOrDnr!, fagsak!))
    }
  }

  const onEditingPdu1 = () => {
    if (pdu1SearchResult) {
      setLoadingForEditPdu1Mode(true)
      dispatch(getStoredPdu1AsJSON(pdu1SearchResult.journalpostId, pdu1SearchResult.dokumentInfoId))
    }
  }

  const onPreviewingStoredPdu1 = () => {
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
    if (PDU1 && loadingForEditPdu1Mode) {
      setLoadingForEditPdu1Mode(false)
      changeMode('B')
    }
  }, [PDU1])

  useEffect(() => {
    if (PDU1 && loadingForEditPdu1Mode) {
      setLoadingForEditPdu1Mode(false)
      changeMode('B')
    }
  }, [PDU1])

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
            <Input
              label={t('label:fnr-dnr')}
              error={validation[namespace + '-search']?.feilmelding}
              id='search'
              namespace={namespace}
              onContentChange={onFnrDnrChange}
              required
              value={fnrOrDnr}
            />
            <VerticalSeparatorDiv size='0.5' />
            <BodyLong>
              {validMessage}
            </BodyLong>
          </PileDiv>
        </Column>
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
            <RadioPanelGroup
              value={fagsak}
              name={namespace + '-fagsaker'}
              onChange={(e: string) => onFagsakerSelected(e)}
            >
              {fagsaker?.map((f: FagSak) => (
                <div key={f.saksID}>
                  <RadioPanelBorder key={f.saksID} value={f.saksID}>
                    <PileDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:fagsakNr')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.fagsakNr}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:tema')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.temakode}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:saksnummer')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.saksID}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:siste-oppdatert')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.opprettetTidspunkt}</BodyLong>
                      </FlexBaseDiv>
                    </PileDiv>
                  </RadioPanelBorder>
                  <VerticalSeparatorDiv />
                </div>
              ))}
            </RadioPanelGroup>
          </div>
          <VerticalSeparatorDiv size='2' />
          <Button
            variant='primary'
            disabled={!tema || !fagsak || creatingPdu1}
            onClick={onCreatingPdu1}
          >
            {creatingPdu1 && <Loader />}
            {creatingPdu1 ? t('label:laster') : t('el:button-create-x', { x: 'PD U1' })}
          </Button>
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
          <div style={{ width: '100%' }}>
            <RadioPanelGroup
              value={pdu1SearchResult ? pdu1SearchResult.journalpostId + '-' + pdu1SearchResult.dokumentInfoId : ''}
              name={namespace + '-pdu1searchresult'}
              onChange={(e: string) => onPdu1SearchResultSelected(e)}
            >
              {pdu1results?.filter(isPDU1)
                .map((r: PDU1SearchResult) => (
                  <div key={r.journalpostId + '-' + r.dokumentInfoId}>
                    <RadioPanelBorder key={r.journalpostId + '-' + r.dokumentInfoId} value={r.journalpostId + '-' + r.dokumentInfoId}>
                      <PileDiv>
                        <FlexBaseDiv>
                          <Label>{t('label:tittel')}:</Label>
                          <HorizontalSeparatorDiv size='0.35' />
                          <BodyLong>{r.tittel}</BodyLong>
                        </FlexBaseDiv>
                        <FlexBaseDiv>
                          <Label>{t('label:tema')}:</Label>
                          <HorizontalSeparatorDiv size='0.35' />
                          <BodyLong>{r.tema}</BodyLong>
                        </FlexBaseDiv>
                        <FlexBaseDiv>
                          <Label>{t('label:journalpost-id')}:</Label>
                          <HorizontalSeparatorDiv size='0.35' />
                          <BodyLong>{r.journalpostId}</BodyLong>
                        </FlexBaseDiv>
                        <FlexBaseDiv>
                          <Label>{t('label:dokument-id')}:</Label>
                          <HorizontalSeparatorDiv size='0.35' />
                          <BodyLong>{r.dokumentInfoId}</BodyLong>
                        </FlexBaseDiv>
                        <FlexBaseDiv>
                          <Label>{t('label:variant')}:</Label>
                          <HorizontalSeparatorDiv size='0.35' />
                          <BodyLong>{r.dokumentvarianter.join(', ')}</BodyLong>
                        </FlexBaseDiv>
                        <FlexBaseDiv>
                          <Label>{t('label:dato-opprettet')}:</Label>
                          <HorizontalSeparatorDiv size='0.35' />
                          <BodyLong>{r.datoOpprettet}</BodyLong>
                        </FlexBaseDiv>
                      </PileDiv>
                    </RadioPanelBorder>
                    <VerticalSeparatorDiv />
                  </div>
                ))}
            </RadioPanelGroup>
          </div>
          <VerticalSeparatorDiv size='2' />
          <FlexDiv>
            <Button
              variant='primary'
              disabled={!pdu1SearchResult || gettingPdu1 || pdu1SearchResult.dokumentvarianter.indexOf('ORIGINAL') < 0}
              onClick={onEditingPdu1}
            >
              {gettingPdu1 && <Loader />}
              {gettingPdu1 ? t('label:laster') : t('el:button-edit-x', { x: 'PD U1' })}
            </Button>
            <HorizontalSeparatorDiv />
            <Button
              variant='secondary'
              disabled={!pdu1SearchResult || gettingPreviewStoredPdu1 || pdu1SearchResult.dokumentvarianter.indexOf('ARKIV') < 0}
              onClick={onPreviewingStoredPdu1}
            >
              {gettingPreviewStoredPdu1 && <Loader />}
              {gettingPreviewStoredPdu1 ? t('label:laster') : t('el:button-preview-x', { x: 'PD U1' })}
            </Button>
          </FlexDiv>
        </>
      )}
    </ContainerDiv>
  )
}

export default PDU1Search
