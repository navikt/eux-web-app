import { saveEntry } from 'actions/localStorage'
import { createSed, getPreviewFile, resetPreviewFile, sendSedInRina, updateReplySed } from 'actions/svarpased'
import { resetAllValidation, resetValidation, viewValidation } from 'actions/validation'
import Formaal from 'applications/SvarSed/Formaal/Formaal'
import FormålManager from 'applications/SvarSed/Formaal/FormålManager'
import SEDType from 'applications/SvarSed/Formaal/SEDType'
import Tema from 'applications/SvarSed/Formaal/Tema'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import Attachments from 'applications/Vedlegg/Attachments/Attachments'
import Add from 'assets/icons/Add'

import TextArea from 'components/Forms/TextArea'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv, TextAreaDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { SvarPaSedMode } from 'declarations/app'
import { JoarkBrowserItems } from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, ReplySed } from 'declarations/sed'
import { CreateSedResponse, LocalStorageEntry, Validation } from 'declarations/types'
import FileFC, { File } from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import { VenstreChevron } from 'nav-frontend-chevron'
import { Systemtittel } from 'nav-frontend-typografi'
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
import ValidationBox from 'pages/SvarPaSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { blobToBase64 } from 'utils/blob'
import { getFnr } from 'utils/fnr'
import { isFSed, isHSed, isSed, isUSed } from 'utils/sed'
import { validateSEDEditor, ValidationSEDEditorProps } from './mainValidation'

export interface SEDEditorSelector {
  alertType: string | undefined
  alertMessage: string | undefined
  creatingSvarPaSed: boolean
  gettingPreviewFile: boolean
  highContrast: boolean
  mode: SvarPaSedMode,
  previewFile: any,
  replySed: ReplySed | null | undefined
  currentEntry: LocalStorageEntry<ReplySed> | undefined
  savingSed: boolean
  sendingSed: boolean
  sedCreatedResponse: CreateSedResponse
  sedSendResponse: any
  validation: Validation
}

export interface SEDEditorProps {
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const mapState = (state: State): any => ({
  alertType: state.alert.type,
  alertMessage: state.alert.clientErrorMessage,
  creatingSvarPaSed: state.loading.creatingSvarPaSed,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  highContrast: state.ui.highContrast,
  mode: state.svarpased.mode,
  previewFile: state.svarpased.previewFile,
  replySed: state.svarpased.replySed,
  currentEntry: state.localStorage.currentEntry,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  sedCreatedResponse: state.svarpased.sedCreatedResponse,
  sedSendResponse: state.svarpased.sedSendResponse,
  validation: state.validation.status,
  view: state.validation.view
})

const SEDEditor: React.FC<SEDEditorProps> = ({
  setMode
}: SEDEditorProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertType,
    alertMessage,
    creatingSvarPaSed,
    gettingPreviewFile,
    highContrast,
    mode,
    previewFile,
    replySed,
    currentEntry,
    savingSed,
    sendingSed,
    sedCreatedResponse,
    sedSendResponse,
    validation,
    view
  }: SEDEditorSelector = useSelector<State, SEDEditorSelector>(mapState)
  const fnr = getFnr(replySed, 'bruker')
  const namespace = 'editor'

  const [_attachments, setAttachments] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationSEDEditorProps>(validateSEDEditor)

  const [totalTime] = useState<Date>(new Date())

  const storageKey = 'replySed'
  const showPersonManager = (): boolean => isSed(replySed)
  const showFormålManager = (): boolean =>
    (replySed as F002Sed)?.formaal?.indexOf('motregning') >= 0 ||
    (replySed as F002Sed)?.formaal?.indexOf('vedtak') >= 0 ||
    (replySed as F002Sed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ||
    (replySed as F002Sed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0

  const cleanReplySed = (replySed: ReplySed): ReplySed => {
    const newReplySed = _.cloneDeep(replySed)
    // if we do not have vedtak, do not have ytelse in barna
    if (Object.prototype.hasOwnProperty.call(replySed, 'formaal') && (replySed as FSed)?.formaal.indexOf('vedtak') < 0) {
      (newReplySed as F002Sed).barn?.forEach((b: Barn, i: number) => {
        if (Object.prototype.hasOwnProperty.call((newReplySed as F002Sed).barn[i], 'ytelse')) {
          delete (newReplySed as F002Sed).barn[i].ytelse
        }
      })
    }
    return newReplySed
  }

  const sendReplySed = (e: React.ChangeEvent<HTMLButtonElement>): void => {
    if (replySed) {
      const newReplySed: ReplySed = cleanReplySed(replySed)
      const valid = performValidation({
        replySed: newReplySed
      })
      dispatch(viewValidation())
      if (valid) {
        setViewSendSedModal(true)
        cleanReplySed(newReplySed)
        dispatch(createSed(newReplySed))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onSaveSedClick = () => {
    if (_.isNil(currentEntry)) {
      setViewSaveSedModal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<ReplySed> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(replySed!)
      dispatch(saveEntry(storageKey, newCurrentEntry))
    }
  }

  const resetPreview = () => {
    dispatch(resetPreviewFile())
    setModal(undefined)
  }

  const onSendSedClick = () => {
    dispatch(sendSedInRina(replySed?.saksnummer, sedCreatedResponse?.sedId))
    standardLogger('svarsed.editor.sendsvarsed.button', { type: 'editor' })
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

      setModal({
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
              height={800}
              tema='simple'
              viewOnePage={false}
              onContentClick={resetPreview}
            />
          </div>
        )
      })
    })
  }

  const onPreviewSed = (e: React.ChangeEvent<HTMLButtonElement>) => {
    if (replySed) {
      const newReplySed = _.cloneDeep(replySed)
      cleanReplySed(newReplySed)
      const rinaSakId = newReplySed.saksnummer
      delete newReplySed.saksnummer
      delete newReplySed.sedUrl
      dispatch(getPreviewFile(rinaSakId!, newReplySed))
      buttonLogger(e)
    }
  }

  const onGoBackClick = () => {
    if (mode === 'editor') {
      setMode('selection', 'back')
      document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
    }
  }

  const setComment = (comment: string) => {
    dispatch(updateReplySed('bruker.ytterligereInfo', comment))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  useEffect(() => {
    if (!_modal && !_.isNil(previewFile)) {
      showPreviewModal(previewFile)
    }
  }, [previewFile])

  useEffect(() => {
    return () => {
      timeLogger('svarpased.editor', totalTime)
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      {_modal && (
        <Modal
          highContrast={highContrast}
          modal={_modal}
          onModalClose={resetPreview}
        />
      )}
      {_viewSendSedModal && (
        <SendSEDModal
          fnr={fnr!}
          goToRinaUrl={replySed?.sedUrl}
          highContrast={highContrast}
          attachments={_attachments}
          onModalClose={() => setViewSendSedModal(false)}
        />
      )}
      {_viewSaveSedModal && (
        <SaveSEDModal
          highContrast={highContrast}
          replySed={replySed!}
          storageKey={storageKey}
          onModalClose={() => setViewSaveSedModal(false)}
        />
      )}
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
      <Row>
        <Column flex='2'>
          <Systemtittel>
            {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
          </Systemtittel>
          <VerticalSeparatorDiv />
          {isFSed(replySed) && <Formaal parentNamespace={namespace} />}
          {isUSed(replySed) && <SEDType />}
          {isHSed(replySed) && <Tema />}
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv size='3' />
      {showPersonManager() && (
        <>
          <PersonManager viewValidation={view}/>
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {isFSed(replySed) && showFormålManager() && (
        <>
          <FormålManager viewValidation={view}/>
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      <VerticalSeparatorDiv />
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
      <Attachments
        fnr={fnr}
        highContrast={highContrast}
        onAttachmentsChanged={(attachments) => setAttachments(attachments)}
      />
      <HighContrastFlatknapp
        mini
        kompakt
        disabled={gettingPreviewFile}
        spinner={gettingPreviewFile}
        data-amplitude='svarsed.editor.preview'
        onClick={onPreviewSed}
      >
        <Add />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewFile ? t('label:laster-ned-filen') : t('label:forhåndsvis-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv size='2' />
      <ValidationBox />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <HighContrastHovedknapp
            mini
            data-amplitude={_.isEmpty(sedCreatedResponse) ? 'svarsed.editor.opprettsvarsed' : 'svarsed.editor.oppdattersvarsed'}
            onClick={sendReplySed}
            disabled={creatingSvarPaSed}
            spinner={creatingSvarPaSed}
          >
            {_.isEmpty(sedCreatedResponse)
              ? creatingSvarPaSed
                  ? t('message:loading-opprette-svarsed')
                  : t('label:opprett-svarsed')
              : creatingSvarPaSed
                ? t('message:loading-oppdatering-svarsed')
                : t('label:oppdatere-svarsed')}
          </HighContrastHovedknapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        {!_.isEmpty(sedCreatedResponse) && (
          <>
            <div>
              <HighContrastHovedknapp
                // amplitude is dealt on SendSedClick
                mini
                title={t('message:help-send-sed')}
                disabled={sendingSed || !_.isNil(sedSendResponse)}
                onClick={onSendSedClick}
              >
                {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
              </HighContrastHovedknapp>
            </div>
            <HorizontalSeparatorDiv />
          </>
        )}
        <div>
          <HighContrastKnapp
            data-amplitude={_.isNil(currentEntry) ? 'svarsed.editor.savedraft' : 'svarsed.editor.updatedraft'}
            mini
            onClick={onSaveSedClick}
            disabled={savingSed}
            spinner={savingSed}
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
              <AlertStripe type='suksess'>
                {t(alertMessage!)}
              </AlertStripe>
            </AlertstripeDiv>
            <div />
          </FlexDiv>
          <VerticalSeparatorDiv />
        </>
      )}
    </PaddedDiv>
  )
}

export default SEDEditor
