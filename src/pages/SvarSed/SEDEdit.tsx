import { Sight } from '@navikt/ds-icons'
import { clientClear } from 'actions/alert'
import { resetCurrentEntry, saveEntry } from 'actions/localStorage'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import {
  createSed,
  getPreviewFile,
  resetPreviewFile,
  sendSedInRina,
  setReplySed,
  updateReplySed
} from 'actions/svarsed'
import { resetAllValidation, resetValidation, viewValidation } from 'actions/validation'
import Formaal from 'applications/SvarSed/Formaal/Formaal'
import FormålManager from 'applications/SvarSed/Formaal/FormålManager'
import SEDType from 'applications/SvarSed/Formaal/SEDType'
import Tema from 'applications/SvarSed/Formaal/Tema'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import Attachments from 'applications/Vedlegg/Attachments/Attachments'
import Alert from 'components/Alert/Alert'

import TextArea from 'components/Forms/TextArea'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv, TextAreaDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { JoarkBrowserItems } from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, HSed, ReplySed } from 'declarations/sed'
import { CreateSedResponse, LocalStorageEntry, Validation } from 'declarations/types'
import FileFC, { File } from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
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
import ValidationBox from 'pages/SvarSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { blobToBase64 } from 'utils/blob'
import { getFnr } from 'utils/fnr'
import { isFSed, isHSed, isSed, isUSed } from 'utils/sed'
import { validateSEDEdit, ValidationSEDEditProps } from './mainValidation'

export interface SEDEditSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  creatingSvarSed: boolean
  gettingPreviewFile: boolean
  highContrast: boolean
  previewFile: any,
  replySed: ReplySed | null | undefined
  currentEntry: LocalStorageEntry<ReplySed> | undefined
  savingSed: boolean
  sendingSed: boolean
  sedCreatedResponse: CreateSedResponse
  sedSendResponse: any
  validation: Validation
  view: boolean
}

export interface SEDEditProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
  storageKey: string
}

const mapState = (state: State): any => ({
  alertType: state.alert.type,
  alertMessage: state.alert.stripeMessage,
  creatingSvarSed: state.loading.creatingSvarSed,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  highContrast: state.ui.highContrast,
  previewFile: state.svarsed.previewFile,
  replySed: state.svarsed.replySed,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  sedCreatedResponse: state.svarsed.sedCreatedResponse,
  sedSendResponse: state.svarsed.sedSendResponse,
  validation: state.validation.status,
  view: state.validation.view
})

const SEDEdit: React.FC<SEDEditProps> = ({
  changeMode,
  storageKey
}: SEDEditProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertType,
    alertMessage,
    creatingSvarSed,
    gettingPreviewFile,
    highContrast,
    previewFile,
    replySed,
    savingSed,
    sendingSed,
    sedCreatedResponse,
    sedSendResponse,
    validation,
    view
  }: SEDEditSelector = useSelector<State, SEDEditSelector>(mapState)

  const currentEntry = useSelector<State, LocalStorageEntry<ReplySed> | undefined>(
    (state) => state.localStorage.svarsed.currentEntry)

  const fnr = getFnr(replySed, 'bruker')
  const namespace = 'editor'

  const [_attachments, setAttachments] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationSEDEditProps>(validateSEDEdit)

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
        if (Object.prototype.hasOwnProperty.call((newReplySed as F002Sed).barn?.[i], 'ytelser')) {
          delete (newReplySed as F002Sed).barn?.[i].ytelser
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
      dispatch(saveEntry('svarsed', storageKey, newCurrentEntry))
    }
  }

  const resetPreview = () => {
    dispatch(resetPreviewFile())
    setModal(undefined)
  }

  const onSendSedClick = () => {
    _setSendButtonClicked(true)
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
      delete newReplySed.sakUrl
      dispatch(getPreviewFile(rinaSakId!, newReplySed))
      buttonLogger(e)
    }
  }

  const onGoBackClick = () => {
    changeMode('A', 'back')
    dispatch(resetCurrentEntry('svarsed'))
    document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
  }

  const setComment = (comment: string) => {
    if (isHSed(replySed)) {
      dispatch(updateReplySed('ytterligereInfo', comment))
    } else {
      dispatch(updateReplySed('bruker.ytterligereInfo', comment))
    }
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
    dispatch(startPageStatistic('editor'))
    return () => {
      dispatch(finishPageStatistic('editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      <Modal
        open={!_.isNil(_modal)}
        highContrast={highContrast}
        modal={_modal}
        onModalClose={resetPreview}
      />
      {_viewSendSedModal && (
        <SendSEDModal
          fnr={fnr!}
          open={_viewSendSedModal}
          goToRinaUrl={replySed?.sakUrl}
          highContrast={highContrast}
          attachments={_attachments}
          replySed={replySed}
          onModalClose={() => setViewSendSedModal(false)}
        />
      )}

      <SaveSEDModal
        open={_viewSaveSedModal}
        highContrast={highContrast}
        replySed={replySed!}
        storageKey={storageKey}
        onModalClose={() => setViewSaveSedModal(false)}
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
      <Row>
        <Column flex='2'>
          <Systemtittel>
            {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
          </Systemtittel>
          <VerticalSeparatorDiv />
          {isFSed(replySed) && (
            <Formaal
              replySed={replySed}
              updateReplySed={updateReplySed}
              parentNamespace={namespace}
            />
          )}
          {isUSed(replySed) && (
            <SEDType
              replySed={replySed}
              setReplySed={setReplySed}
            />
          )}
          {isHSed(replySed) && (
            <Tema
              updateReplySed={updateReplySed}
              replySed={replySed}
            />
          )}
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv size='3' />
      {showPersonManager() && (
        <>
          <PersonManager
            viewValidation={view}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {isFSed(replySed) && showFormålManager() && (
        <>
          <FormålManager
            replySed={replySed}
            viewValidation={view}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
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
              key={namespace + '-' + replySed?.sedType}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setComment}
              placeholder={t('el:placeholder-sed')}
              value={isHSed(replySed) ? (replySed as HSed)?.ytterligereInfo : replySed?.bruker?.ytterligereInfo}
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
        <Sight />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewFile ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'SED' })}
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
            disabled={creatingSvarSed}
            spinner={creatingSvarSed}
          >
            {_.isEmpty(sedCreatedResponse)
              ? creatingSvarSed
                  ? t('message:loading-opprette-svarsed')
                  : t('label:opprett-svarsed')
              : creatingSvarSed
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
      {_sendButtonClicked && alertMessage &&
      (alertType === types.SVARSED_SED_SEND_SUCCESS || alertType === types.SVARSED_SED_SEND_FAILURE) && (
        <>
          <FlexDiv>
            <AlertstripeDiv>
              <Alert
                status={alertType === types.SVARSED_SED_SEND_FAILURE ? 'ERROR' : 'OK'}
                message={alertMessage!}
                onClose={() => {
                  _setSendButtonClicked(false)
                  dispatch(clientClear())
                }}
              />
            </AlertstripeDiv>
            <div />
          </FlexDiv>
          <VerticalSeparatorDiv />
        </>
      )}
    </PaddedDiv>
  )
}

export default SEDEdit
