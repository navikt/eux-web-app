import { Add } from '@navikt/ds-icons'
import { clientClear } from 'actions/alert'
import { resetCurrentEntry, saveEntry } from 'actions/localStorage'
import { completePdu1, getPreviewPdu1 } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetPreviewFile, updateReplySed } from 'actions/svarsed'
import { resetAllValidation, resetValidation, viewValidation } from 'actions/validation'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import Alert from 'components/Alert/Alert'

import TextArea from 'components/Forms/TextArea'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv, TextAreaDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Validation } from 'declarations/types'
import FileFC from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import { VenstreChevron } from 'nav-frontend-chevron'
import {
  Column,
  FlexCenterSpacedDiv,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import ValidationBox from 'pages/SvarSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { validatePDU1Edit, ValidationPDU1EditProps } from './mainValidation'

export interface PDU1EditSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  completingPdu1: boolean
  gettingPreviewPdu1: boolean
  highContrast: boolean
  previewPdu1: any,
  replySed: ReplySed | null | undefined
  savingPdu1: boolean
  completePdu1Response: any
  validation: Validation
  view: boolean
}

export interface PDU1EditProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
  storageKey: string
}

const mapState = (state: State): any => ({
  alertType: state.alert.type,
  alertMessage: state.alert.clientErrorMessage,
  completingPdu1: state.loading.completingPdu1,
  gettingPreviewPdu1: state.loading.gettingPreviewPdu1,
  previewPdu1: state.pdu1.previewPdu1,
  replySed: state.pdu1.replySed,
  completePdu1Response: state.pdu1.completePdu1Response,
  highContrast: state.ui.highContrast,
  validation: state.validation.status,
  view: state.validation.view
})

const PDU1Edit: React.FC<PDU1EditProps> = ({
  changeMode,
  storageKey
}: PDU1EditProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertType,
    alertMessage,
    completingPdu1,
    gettingPreviewPdu1,
    previewPdu1,
    replySed,
    completePdu1Response,
    highContrast,
    validation,
    view
  }: PDU1EditSelector = useSelector<State, PDU1EditSelector>(mapState)
  const currentEntry = useSelector<State, LocalStorageEntry<ReplySed> | undefined>(
    (state) => state.localStorage.pdu1.currentEntry)
  const namespace = 'pdu1editor'

  const [previewModal, setPreviewModal] = useState<boolean>(false)
  const [viewSavePdu1Modal, setViewSavePdu1Modal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationPDU1EditProps>(validatePDU1Edit)

  const completePdu1Clicked = (e: React.ChangeEvent<HTMLButtonElement>): void => {
    if (replySed) {
      const newReplySed: ReplySed = _.cloneDeep(replySed)
      const valid = performValidation({
        replySed: newReplySed
      })
      dispatch(viewValidation())
      if (valid) {

        dispatch(completePdu1(newReplySed))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onSavePdu1Click = () => {
    if (_.isNil(currentEntry)) {
      setViewSavePdu1Modal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<ReplySed> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(replySed!)
      dispatch(saveEntry('pdu1', storageKey, newCurrentEntry))
    }
  }

  const resetPreview = () => {
    dispatch(resetPreviewFile())
    setPreviewModal(false)
  }

  const onPreviewPdu1Clicked = (e: React.ChangeEvent<HTMLButtonElement>) => {
    if (replySed) {
      const newReplySed = _.cloneDeep(replySed)
      dispatch(getPreviewPdu1(newReplySed))
      buttonLogger(e)
    }
  }

  const onGoBackClick = () => {
    changeMode('A', 'back')
    dispatch(resetCurrentEntry('pdu1'))
    document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
  }

  const setComment = (comment: string) => {
    dispatch(updateReplySed('bruker.ytterligereInfo', comment))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  useEffect(() => {
    if (!previewModal && !_.isNil(previewPdu1)) {
      setPreviewModal(true)
    }
  }, [previewPdu1])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1editor'))
    return () => {
      dispatch(finishPageStatistic('pdu1editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      <Modal
        open={previewModal}
        highContrast={highContrast}
        modal={{
          closeButton: true,
          modalContent: (
            <div
              style={{ cursor: 'pointer' }}
            >
              <FileFC
                file={previewPdu1}
                width={600}
                height={800}
                tema='simple'
                viewOnePage={false}
                onContentClick={resetPreview}
              />
            </div>
          )
        }}
        onModalClose={resetPreview}
      />
      <SavePDU1Modal
        open={viewSavePdu1Modal}
        highContrast={highContrast}
        replySed={replySed!}
        storageKey={storageKey}
        onModalClose={() => setViewSavePdu1Modal(false)}
      />
      <FlexCenterSpacedDiv>
        <HighContrastKnapp
          kompakt
          onClick={onGoBackClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv size='0.5' />
          {t('label:tilbake')}
        </HighContrastKnapp>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv size='2' />
      <PersonManager viewValidation={view}/>
      <VerticalSeparatorDiv size='2' />
      <Row>
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              namespace={namespace}
              feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setComment}
              placeholder={t('el:placeholder-sed')}
              value={replySed?.bruker?.ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv size='2' />
      <HighContrastFlatknapp
        mini
        kompakt
        disabled={gettingPreviewPdu1}
        spinner={gettingPreviewPdu1}
        data-amplitude='pdu1.editor.preview'
        onClick={onPreviewPdu1Clicked}
      >
        <Add />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewPdu1 ? t('label:laster-ned-filen') : t('label:forhåndsvis-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv size='2' />
      <ValidationBox />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <HighContrastHovedknapp
            mini
            data-amplitude={'pdu1.editor.opprett'}
            onClick={completePdu1Clicked}
            disabled={completingPdu1 || !_.isEmpty(completePdu1Response)}
            spinner={completingPdu1}
          >
            {completingPdu1
              ? t('message:loading-opprette-pdu1')
              : t('label:opprett-pdu1')}
          </HighContrastHovedknapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />

        <div>
          <HighContrastKnapp
            data-amplitude={_.isNil(currentEntry) ? 'pdu1.editor.savedraft' : 'pdu1.editor.updatedraft'}
            mini
            onClick={onSavePdu1Click}
          >
            {_.isNil(currentEntry) ? t('el:button-save-draft') : t('el:button-update-draft')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
      </FlexDiv>
      <VerticalSeparatorDiv />
      {alertMessage && alertType === types.LOCALSTORAGE_ENTRY_SAVE && (
        <>
          <FlexDiv>
            <AlertstripeDiv>
              <Alert status='OK' message={alertMessage!} onClose={() => dispatch(clientClear())} />
            </AlertstripeDiv>
            <div />
          </FlexDiv>
          <VerticalSeparatorDiv />
        </>
      )}
    </PaddedDiv>
  )
}

export default PDU1Edit
