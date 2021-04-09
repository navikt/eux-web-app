import * as svarpasedActions from 'actions/svarpased'
import { getPreviewFile } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import Attachments from 'components/Attachments/Attachments'
import FamilyManager from 'components/FamilyManager/FamilyManager'
import Formaal from 'components/Formaal/Formaal'
import Inntekt from 'components/Inntekt/Inntekt'
import KravOmRefusjon from 'components/KravOmRefusjon/KravOmRefusjon'
import Modal from 'components/Modal/Modal'
import Motregning from 'components/Motregning/Motregning'
import ProsedyreVedUenighet from 'components/ProsedyreVedUenighet/ProsedyreVedUenighet'
import SaveSEDModal from 'components/SaveSEDModal/SaveSEDModal'
import SendSEDModal from 'components/SendSEDModal/SendSEDModal'
import { TextAreaDiv } from 'components/StyledComponents'
import Vedtak from 'components/Vedtak/Vedtak'
import { JoarkBrowserItems } from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Inntekt as IInntekt, Inntekter, Validation } from 'declarations/types'
import FileFC, { File } from 'forhandsvisningsfil'
import _ from 'lodash'
import { VenstreChevron } from 'nav-frontend-chevron'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
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
import { useDispatch, useSelector } from 'react-redux'
import { SvarpasedState } from 'reducers/svarpased'
import styled from 'styled-components'
import { Item } from 'tabell'

import { validate } from './validation'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Step2Div = styled.div`
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
  arbeidsforhold: state.svarpased.valgteArbeidsforhold,
  familieRelasjoner: state.svarpased.familierelasjoner,
  inntekter: state.svarpased.selectedInntekter,
  sed: state.svarpased.replySed
})

export interface SvarPaSedProps {
  mode: string | undefined
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const Step2: React.FC<SvarPaSedProps> = ({
  mode, setMode
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

    inntekter,
    previewFile,
    replySed,
    validation,

    highContrast
  }: any = useSelector<State, any>(mapState)

  const [_comment, setComment] = useState<string>('')
  const [_attachments, setAttachments] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<any | undefined>(undefined)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const fnr = _.find(replySed?.bruker?.personInfo.pin, p => p.land === 'NO')?.fnr

  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const isValid = (validation: Validation): boolean => _.find(_.values(validation), (e) => e !== undefined) === undefined

  const showFamily = (): boolean => replySed?.sedType?.startsWith('F') || false
  const showMotregning = (): boolean => (replySed?.formaal?.indexOf('motregning') >= 0)
  const showVedtak = (): boolean => (replySed?.formaal?.indexOf('vedtak') >= 0)
  const showProsedyreVedUenighet = (): boolean => (replySed?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0)
  const showKravOmRefusjon = (): boolean => (replySed?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0)
  const showInntekt = (): boolean => replySed?.sedType === 'U004'

  const sendReplySed = (): void => {
    if (replySed) {
      const newValidation = validate({
        comment: _comment,
        t: t,
        replySed: replySed
      })
      dispatch(svarpasedActions.setAllValidation(newValidation))
      if (isValid(newValidation)) {
        setViewSendSedModal(true)
        dispatch(svarpasedActions.createSed(
          rinasaksnummerOrFnr,
          replySed!.svarSedId,
          replySed!.svarSedType,
          data
        ))
      }
    }
  }

  // TODO
  const createSedWithAttachments = () => {}

  // TODO
  const createSedEditInRINA = () => {}

  // TODO
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

  // TODO
  const onPreviewSed = () => {
    if (!_previewFile) {
      dispatch(getPreviewFile())
    } else {
      showPreviewModal(_previewFile)
    }
  }

  const onGoBackClick = () => {
    if (mode === '2') {
      setMode('1', 'back')
    }
  }

  const onSelectedInntekt = (items: Array<Item>) => {
    const inntekter: Inntekter = items.map(
      (item) => ({
        beloep: item.beloep,
        fraDato: item.fraDato,
        tilDato: item.tilDato,
        type: item.type
      } as IInntekt)
    )
    if (items) {
      dispatch(svarpasedActions.sendSeletedInntekt(inntekter))
    }
  }

  useEffect(() => {
    if (!_previewFile && previewFile) {
      setPreviewFile(previewFile)
      showPreviewModal(previewFile)
    }
  }, [previewFile, _previewFile])

  return (
    <Step2Div>
      {_modal && (
        <Modal
          highContrast={highContrast}
          modal={_modal}
          onModalClose={() => setModal(undefined)}
        />
      )}
      {_viewSendSedModal && (
        <SendSEDModal
          highContrast={highContrast}
          attachments={_attachments}
          onModalClose={() => setViewSendSedModal(false)}
        />
      )}
      {_viewSaveSedModal && (
        <SaveSEDModal
          highContrast={highContrast}
          replySed={replySed}
          onModalClose={() => setViewSaveSedModal(false)}
        />
      )}
      <FlexDiv>
        <HighContrastLink
          href='#'
          onClick={onGoBackClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('label:back')}
        </HighContrastLink>
      </FlexDiv>
      <VerticalSeparatorDiv />
      <Row>
        <Column data-flex='2'>
          <Systemtittel>
            {replySed?.sedType}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <Formaal
            feil={validation.formaal}
            replySed={replySed}
            highContrast={highContrast}
          />
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv data-size='2' />
      {showFamily() && (
        <>
          <FamilyManager />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showVedtak() && (
        <>
          <Vedtak highContrast={highContrast} replySed={replySed} validation={validation}/>
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showMotregning() && (
        <>
          <Motregning highContrast={highContrast} replySed={replySed} validation={validation}/>
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showProsedyreVedUenighet() && (
        <>
          <ProsedyreVedUenighet highContrast={highContrast} replySed={replySed} validation={validation}/>
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showKravOmRefusjon() && (
        <>
          <KravOmRefusjon highContrast={highContrast} replySed={replySed} validation={validation}/>
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}

      {showInntekt() && (
        <Ekspanderbartpanel tittel={t('label:inntekt')}>
          <Inntekt
            fnr={fnr}
            highContrast={highContrast}
            inntekter={inntekter}
            onSelectedInntekt={onSelectedInntekt}
          />
        </Ekspanderbartpanel>
      )}
      <VerticalSeparatorDiv />
      <TextAreaDiv>
        <HighContrastTextArea
          data-test-id='c-step2-comment-text'
          id='c-step2-comment-text'
          className={classNames({ 'skjemaelement__input--harFeil': validation.comment })}
          label={t('label:comment-title')}
          placeholder={t('label:comment-placeholder')}
          onChange={(e: any) => setComment(e.target.value)}
          value={_comment}
          feil={validation.comment ? validation.comment.feilmelding : undefined}
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
        {gettingPreviewFile ? t('label:loading-file') : t('label:preview-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv data-size='2' />
      <ButtonsDiv>
        <div>
          <HighContrastHovedknapp
            mini
            onClick={sendReplySed}
            disabled={creatingSvarPaSed}
            spinner={creatingSvarPaSed}
          >
            {creatingSvarPaSed ? t('message:loading-sendingReplySed') : t('label:sendReplySed')}
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
            {t('label:createSedEditInRINA')}
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
      <ValidationBox validation={validation} />
    </Step2Div>
  )
}

export default Step2
