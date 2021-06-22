import { createSed, updateReplySed } from 'actions/svarpased'
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
import Modal from 'components/Modal/Modal'
import { TextAreaDiv } from 'components/StyledComponents'
import { JoarkBrowserItems } from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import FileFC, { File } from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
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
import ReactJson from 'react-json-view'
import { useDispatch, useSelector } from 'react-redux'
import { getFnr } from 'utils/fnr'
import { isFSed, isHSed, isSed, isUSed } from 'utils/sed'
import { validateSEDEditor, ValidationSEDEditorProps } from './mainValidation'

import TextArea from 'components/Forms/TextArea'

const mapState = (state: State): any => ({
  creatingSvarPaSed: state.loading.creatingSvarPaSed,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  highContrast: state.ui.highContrast,
  mode: state.svarpased.mode,
  previewFile: state.svarpased.previewFile,
  replySed: state.svarpased.replySed,
  savingSed: state.loading.savingSed,
  validation: state.validation.status
})

export interface SvarPaSedProps {
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const SEDEditor: React.FC<SvarPaSedProps> = ({
  setMode
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    creatingSvarPaSed,
    gettingPreviewFile,
    highContrast,
    mode,
    previewFile,
    replySed,
    savingSed,
    validation
  }: any = useSelector<State, any>(mapState)
  const fnr = getFnr(replySed)
  const namespace = 'editor'

  const [_attachments, setAttachments] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<any | undefined>(undefined)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationSEDEditorProps>(validateSEDEditor)

  const storageKey = 'replySed'
  const showPersonManager = (): boolean => isSed(replySed)
  const showFormålManager = (): boolean =>
    replySed?.formaal?.indexOf('motregning') >= 0 ||
    replySed?.formaal?.indexOf('vedtak') >= 0 ||
    replySed?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ||
    replySed?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0

  const sendReplySed = (): void => {
    if (replySed) {
      const valid = performValidation({
        replySed
      })
      dispatch(viewValidation())
      if (valid) {
        setViewSendSedModal(true)
        delete replySed.xxxformaal
        delete replySed.xxxsisteAnsettelsesForhold
        delete replySed.xxxretttilytelser
        delete replySed.xxxgrunntilopphør
        delete replySed.xxxinntekt
        delete replySed.xxxperiodefordagpenger
        dispatch(createSed(replySed))
        dispatch(resetAllValidation())
      }
    }
  }

  const onSaveSedClick = () => {
    setViewSaveSedModal(true)
  }

  const showPreviewModal = (previewFile: File) => {
    setModal({
      closeButton: true,
      modalContent: (
        <div
          style={{ cursor: 'pointer' }}
        >
          <FileFC
            file={previewFile}
            width={600}
            height={800}
            tema='simple'
            viewOnePage={false}
            onContentClick={() => setModal(undefined)}
          />
        </div>
      )
    })
  }

  const onPreviewSed = () => {
    setModal({
      closeButton: true,
      modalContent: (
        <div>
          <ReactJson src={replySed} />
        </div>
      )
    })
  }

  const onGoBackClick = () => {
    if (mode === 'editor') {
      setMode('selection', 'back')
    }
  }

  const setComment = (comment: string) => {
    dispatch(updateReplySed('ytterligereInfo', comment))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  useEffect(() => {
    if (!_previewFile && previewFile) {
      setPreviewFile(previewFile)
      showPreviewModal(previewFile)
    }
  }, [previewFile, _previewFile])

  return (
    <PaddedDiv size='0.5'>
      {_modal && (
        <Modal
          highContrast={highContrast}
          modal={_modal}
          onModalClose={() => setModal(undefined)}
        />
      )}
      {_viewSendSedModal && (
        <SendSEDModal
          fnr={fnr!}
          goToRinaUrl={replySed.sedUrl}
          highContrast={highContrast}
          attachments={_attachments}
          onModalClose={() => setViewSendSedModal(false)}
        />
      )}
      {_viewSaveSedModal && (
        <SaveSEDModal
          highContrast={highContrast}
          localStorageContent={replySed}
          storageKey={storageKey}
          onModalClose={() => setViewSaveSedModal(false)}
        />
      )}
      <FlexCenterSpacedDiv>
        <HighContrastFlatknapp
          onClick={onGoBackClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv size='0.5' />
          {t('label:tilbake')}
        </HighContrastFlatknapp>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv />
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
      <VerticalSeparatorDiv size='2' />
      {showPersonManager() && (
        <>
          <PersonManager />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {isFSed(replySed) && showFormålManager() && (
        <>
          <FormålManager />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      <VerticalSeparatorDiv />
      <TextAreaDiv>
        <TextArea
          namespace={namespace}
          feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
          id='ytterligereInfo'
          label={t('label:ytterligere-informasjon-til-sed')}
          onChanged={setComment}
          placeholder={t('el:placeholder-sed')}
          value={replySed?.ytterligereInfo}
        />
      </TextAreaDiv>
      <VerticalSeparatorDiv size='2' />
      <Attachments
        fnr={fnr!}
        highContrast={highContrast}
        onAttachmentsChanged={(attachments) => setAttachments(attachments)}
      />
      <HighContrastFlatknapp
        mini
        kompakt
        disabled={gettingPreviewFile}
        spinner={gettingPreviewFile}
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
            onClick={sendReplySed}
            disabled={creatingSvarPaSed}
            spinner={creatingSvarPaSed}
          >
            {creatingSvarPaSed ? t('message:loading-sending-svarsed') : t('label:send-svarsed')}
          </HighContrastHovedknapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        <div>
          <HighContrastKnapp
            mini
            onClick={onSaveSedClick}
            disabled={savingSed}
            spinner={savingSed}
          >
            {t('el:button-save')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
      </FlexDiv>
    </PaddedDiv>
  )
}

export default SEDEditor
