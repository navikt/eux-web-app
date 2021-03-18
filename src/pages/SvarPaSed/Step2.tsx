import { clientClear } from 'actions/alert'
import { getPreviewFile } from 'actions/svarpased'
import * as svarpasedActions from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
import classNames from 'classnames'
import Alert from 'components/Alert/Alert'
import FamilyManager from 'components/FamilyManager/FamilyManager'
import Formaal from 'components/Formaal/Formaal'
import Inntekt from 'components/Inntekt/Inntekt'
import * as types from 'constants/actionTypes'
import { AlertStatus, ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Inntekt as IInntekt, Inntekter, Validation } from 'declarations/types'
import _ from 'lodash'
import Alertstripe from 'nav-frontend-alertstriper'
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
import FileFC, { File } from 'forhandsvisningsfil'
import Modal from 'components/Modal/Modal'

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

const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const TextAreaDiv = styled.div`
  textarea {
    width: 100%;
  }
`

const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,

  rinasaksnummerOrFnr: state.app.params.rinasaksnummerOrFnr,

  creatingSedWithAttachments: state.loading.creatingSedWithAttachments,
  creatingSedEditInRINA: state.loading.creatingSedEditInRINA,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  savingSed: state.loading.savingSed,
  sendingSvarPaSed: state.loading.sendingSvarPaSed,

  inntekter: state.svarpased.inntekter,
  previewFile: state.svarpased.previewFile,
  replySed: state.svarpased.replySed,
  svarPasedData: state.svarpased.svarPasedData,
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
    alertStatus,
    alertMessage,
    alertType,

    rinasaksnummerOrFnr,

    creatingSedWithAttachments,
    creatingSedEditInRINA,
    gettingPreviewFile,
    savingSed,
    sendingSvarPaSed,

    inntekter,
    previewFile,
    replySed,
    svarPasedData,
    validation,

    highContrast
  }: any = useSelector<State, any>(mapState)

  const [_comment, setComment] = useState<string>('')
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<any | undefined>(undefined)

  const fnr = _.find(replySed?.bruker?.personInfo.pin, p => p.land === 'NO')?.fnr

  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const isValid = (validation: Validation): boolean => _.find(_.values(validation), (e) => e !== undefined) === undefined

  const showFamily = (): boolean => replySed?.replySedType?.startsWith('F') || false

  const showInntekt = (): boolean => replySed?.replySedType === 'U004'

  const sendReplySed = (): void => {
    if (replySed) {
      const newValidation = validate({
        comment: _comment,
        t: t,
        replySed: replySed
      })
      dispatch(svarpasedActions.setAllValidation(newValidation))
      if (isValid(newValidation)) {
        dispatch(svarpasedActions.sendSvarPaSedData(rinasaksnummerOrFnr, replySed!.querySedDocumentId, replySed!.replySedType, data))
      }
    }
  }

  // TODO
  const createSedWithAttachments = () => {}

  // TODO
  const createSedEditInRINA = () => {}

  // TODO
  const saveSed = () => {}

  const showModal = (previewFile: File) => {
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
      showModal(_previewFile)
    }
  }

  const onGoBackClick = () => {
    if (mode === '2') {
      dispatch(svarpasedActions.resetReplySed())
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
      showModal(previewFile)
    }
  }, [ previewFile, _previewFile])

  return (
    <Step2Div>
      {_modal && (
        <Modal
          modal={_modal}
          onModalClose={() => setModal(undefined)}
        />
      )}
      <FlexDiv>
        <HighContrastLink
          href='#'
          onClick={onGoBackClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('ui:label-back')}
        </HighContrastLink>
      </FlexDiv>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <Systemtittel>
            {replySed ? replySed.replySedType + ' - ' + replySed.replySedDisplay : ''}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <Formaal
            feil={validation.formaal}
            replySed={replySed}
            highContrast={highContrast}
          />
        </Column>
        <Column/>
      </Row>
      <VerticalSeparatorDiv data-size='2' />
      {showFamily() && (
        <>
          <FamilyManager />
          <VerticalSeparatorDiv data-size='2' />
        </>
      )}
      {showInntekt() && (
        <Ekspanderbartpanel tittel={t('ui:label-inntekt')}>
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
          data-test-id='c-svarpased-comment-textarea'
          id='c-svarpased-comment-textarea'
          className={classNames({ 'skjemaelement__input--harFeil': validation.comment })}
          label={t('ui:label-comment-title')}
          placeholder={t('ui:label-comment-placeholder')}
          onChange={(e: any) => setComment(e.target.value)}
          value={_comment}
          feil={validation.comment ? validation.comment.feilmelding : undefined}
        />
      </TextAreaDiv>
      <VerticalSeparatorDiv data-size='2' />
      <HighContrastFlatknapp
        mini
        kompakt
        disabled={gettingPreviewFile}
        spinner={gettingPreviewFile}
        onClick={onPreviewSed}
      >
        <Tilsette />
        <HorizontalSeparatorDiv data-size='0.5' />
          {gettingPreviewFile ? t('ui:label-loading-file') : t('ui:label-preview-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv data-size='2' />
      <ButtonsDiv>
        <div>
          <HighContrastHovedknapp
            mini
            onClick={sendReplySed}
            disabled={sendingSvarPaSed}
            spinner={sendingSvarPaSed}
          >
            {sendingSvarPaSed ? t('ui:loading-sendingReplySed') : t('ui:label-sendReplySed')}
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
            {t('ui:label-addAttachments')}
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
            {t('ui:label-createSedEditInRINA')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        <div>
          <HighContrastKnapp
            mini
            onClick={saveSed}
            disabled={savingSed}
            spinner={savingSed}
          >
            {t('ui:label-saveSed')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
      </ButtonsDiv>
      <ValidationBox validation={validation} />
      {alertMessage && alertType && [types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE].indexOf(alertType) >= 0 && (
        <AlertstripeDiv>
          <Alert
            type='client'
            fixed={false}
            message={t(alertMessage)}
            status={alertStatus as AlertStatus}
            onClose={() => dispatch(clientClear())}
          />
        </AlertstripeDiv>
      )}
      {!_.isNil(svarPasedData) && (
        <Alertstripe type='suksess'>
          {svarPasedData.message}
        </Alertstripe>
      )}
    </Step2Div>
  )
}

export default Step2
