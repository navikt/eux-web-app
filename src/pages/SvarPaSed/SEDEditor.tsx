import { createSed, setAllValidation, setReplySed } from 'actions/svarpased'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import Formaal from 'applications/SvarSed/Formaal/Formaal'
import KravOmRefusjon from 'applications/SvarSed/Formaal/KravOmRefusjon/KravOmRefusjon'
import Motregning from 'applications/SvarSed/Formaal/Motregning/Motregning'
import ProsedyreVedUenighet from 'applications/SvarSed/Formaal/ProsedyreVedUenighet/ProsedyreVedUenighet'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import Vedtak from 'applications/SvarSed/Formaal/Vedtak/Vedtak'
import Attachments from 'applications/Vedlegg/Attachments/Attachments'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import Modal from 'components/Modal/Modal'
import { FlexCenterDiv, TextAreaDiv } from 'components/StyledComponents'
import useValidation from 'hooks/useValidation'
import { JoarkBrowserItems } from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import FileFC, { File } from 'forhandsvisningsfil'
import _ from 'lodash'
import { VenstreChevron } from 'nav-frontend-chevron'
import { Systemtittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import ValidationBox from 'pages/SvarPaSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactJson from 'react-json-view'
import { useDispatch, useSelector } from 'react-redux'
import { SvarpasedState } from 'reducers/svarpased'
import styled from 'styled-components'
import { validateSEDEditor, ValidationSEDEditorProps } from './validation'
import Kontoopplysning from 'applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning'

const SEDEditorDiv = styled.div`
  padding: 0.5rem;
`

const ButtonsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const mapState = (state: State): any => ({
  rinasaksnummerOrFnr: state.app.params.rinasaksnummerOrFnr,

  creatingSedWithAttachments: state.loading.creatingSedWithAttachments,
  creatingSedEditInRINA: state.loading.creatingSedEditInRINA,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  savingSed: state.loading.savingSed,
  creatingSvarPaSed: state.loading.creatingSvarPaSed,

  inntekter: state.svarpased.inntekter,
  previewFile: state.svarpased.previewFile,
  replySed: state.svarpased.replySed,
  validation: state.svarpased.validation,

  highContrast: state.ui.highContrast
})

const mapStateTwo = (state: State): any => ({
  arbeidsgivere: state.svarpased.valgteArbeidsgivere,
  familieRelasjoner: state.svarpased.familierelasjoner,
  inntekter: state.svarpased.selectedInntekter,
  sed: state.svarpased.replySed
})

export interface SvarPaSedProps {
  mode: string | undefined
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const SEDEditor: React.FC<SvarPaSedProps> = ({
  mode,
  setMode
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    rinasaksnummerOrFnr,

    creatingSedWithAttachments,
    creatingSedEditInRINA,
    gettingPreviewFile,
    savingSed,
    creatingSvarPaSed,

    previewFile,
    replySed,
    validation,

    highContrast
  }: any = useSelector<State, any>(mapState)
  const fnr = _.find(replySed?.bruker?.personInfo.pin, p => p.land === 'NO')?.identifikator
  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const [_comment, _setComment] = useState<string>('')
  const [_attachments, setAttachments] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<any | undefined>(undefined)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const [_viewKontoopplysninger, setViewKontoopplysninger] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationSEDEditorProps>(validation, validateSEDEditor)
  const [_viewValidation, _setViewValidation] = useState<boolean>(false)

  const showPersonManager = (): boolean => replySed?.sedType?.startsWith('F') || replySed?.sedType?.startsWith('U') || false
  const showMotregning = (): boolean => (replySed?.formaal?.indexOf('motregning') >= 0)
  const showVedtak = (): boolean => (replySed?.formaal?.indexOf('vedtak') >= 0)
  const showProsedyreVedUenighet = (): boolean => (replySed?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0)
  const showKravOmRefusjon = (): boolean => (replySed?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0)
  const showKontoopplysninger = (): boolean => _viewKontoopplysninger === true

  const sendReplySed = (): void => {
    if (replySed) {
      const valid = performValidation({
        comment: _comment,
        replySed
      })
      _setViewValidation(true)
      if (valid) {
        setViewSendSedModal(true)
        dispatch(createSed(
          rinasaksnummerOrFnr,
          replySed!.sedId,
          replySed!.svarsedType,
          data
        ))
        _resetValidation()
      } else {
        // dispatch validation results to all components
        dispatch(setAllValidation(_validation))
      }
    }
  }

  // TODO
  const createSedWithAttachments = () => {}

  // TODO
  const createSedEditInRINA = () => {}

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
    if (mode === '2') {
      setMode('1', 'back')
    }
  }

  const setComment = (comment: string) => {
    _resetValidation('comment')
    _setComment(comment)
  }

  const updateReplySed = (needleString: string | Array<string>, value: any) => {
    const newReplySed = _.cloneDeep(replySed)
    _.set(newReplySed, needleString, value)
    dispatch(setReplySed(newReplySed))
  }

  useEffect(() => {
    if (!_previewFile && previewFile) {
      setPreviewFile(previewFile)
      showPreviewModal(previewFile)
    }
  }, [previewFile, _previewFile])

  return (
    <SEDEditorDiv>
      {_modal && (
        <Modal
          highContrast={highContrast}
          modal={_modal}
          onModalClose={() => setModal(undefined)}
        />
      )}
      {_viewSendSedModal && (
        <SendSEDModal
          fnr={fnr}
          highContrast={highContrast}
          attachments={_attachments}
          onModalClose={() => setViewSendSedModal(false)}
        />
      )}
      {_viewSaveSedModal && (
        <SaveSEDModal
          highContrast={highContrast}
          localStorageContent={replySed}
          storageKey='replysed'
          onModalClose={() => setViewSaveSedModal(false)}
        />
      )}
      <FlexCenterDiv>
        <HighContrastLink
          href='#'
          onClick={onGoBackClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('label:tilbake')}
        </HighContrastLink>
      </FlexCenterDiv>
      <VerticalSeparatorDiv />
      <Row>
        <Column data-flex='2'>
          <Systemtittel>
            {replySed?.sedType}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <Formaal
            feil={_validation.formaal}
            replySed={replySed}
            highContrast={highContrast}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv data-size='2' />
      {showPersonManager() && (
        <>
          <PersonManager
            fnr={fnr}
            replySed={replySed}
            resetValidation={_resetValidation}
            updateReplySed={updateReplySed}
            validation={_validation}
            viewValidation={_viewValidation}
          />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showVedtak() && (
        <>
          <Vedtak
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={_resetValidation}
            updateReplySed={updateReplySed}
            validation={_validation}
          />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showMotregning() && (
        <>
          <Motregning
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={_resetValidation}
            seeKontoopplysninger={() => setViewKontoopplysninger(true)}
            updateReplySed={updateReplySed}
            validation={_validation}
          />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showProsedyreVedUenighet() && (
        <>
          <ProsedyreVedUenighet
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={_resetValidation}
            updateReplySed={updateReplySed}
            validation={_validation}
          />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showKravOmRefusjon() && (
        <>
          <KravOmRefusjon
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={_resetValidation}
            seeKontoopplysninger={() => setViewKontoopplysninger(true)}
            updateReplySed={updateReplySed}
            validation={_validation}
          />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showKontoopplysninger() && (
        <>
          <Kontoopplysning
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={_resetValidation}
            updateReplySed={updateReplySed}
            validation={_validation}
          />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      <VerticalSeparatorDiv />
      <TextAreaDiv>
        <HighContrastTextArea
          className={classNames({ 'skjemaelement__input--harFeil': _validation.comment })}
          data-test-id='comment'
          feil={_validation.comment?.feilmelding}
          id='comment'
          label={t('label:ytterligere-informasjon-til-sed')}
          maxLength={500}
          onChange={(e: any) => setComment(e.target.value)}
          placeholder={t('el:placeholder-sed')}
          value={_comment}
        />
      </TextAreaDiv>
      <VerticalSeparatorDiv data-size='2' />
      <Attachments
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
        <HorizontalSeparatorDiv data-size='0.5' />
        {gettingPreviewFile ? t('label:laster-ned-filen') : t('label:forhåndsvis-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv data-size='2' />
      <ValidationBox validation={_validation} />
      <VerticalSeparatorDiv data-size='2' />
      <ButtonsDiv>
        <div>
          <HighContrastHovedknapp
            mini
            onClick={sendReplySed}
            disabled={creatingSvarPaSed}
            spinner={creatingSvarPaSed}
          >
            {creatingSvarPaSed ? t('message:loading-sendingReplySed') : t('label:send-svarsed')}
          </HighContrastHovedknapp>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        <div>
          <HighContrastKnapp
            mini
            onClick={createSedWithAttachments}
            disabled={creatingSedWithAttachments}
            spinner={creatingSedWithAttachments}
          >
            {t('el:button-add-attachments')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        <div>
          <HighContrastKnapp
            mini
            onClick={createSedEditInRINA}
            disabled={creatingSedEditInRINA}
            spinner={creatingSedEditInRINA}
          >
            {t('label:opprett-sed-rediger-i-rina')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv data-size='0.5' />
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
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
      </ButtonsDiv>
    </SEDEditorDiv>
  )
}

export default SEDEditor
