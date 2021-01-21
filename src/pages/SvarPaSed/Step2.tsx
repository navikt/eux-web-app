import { clientClear } from 'actions/alert'
import * as svarpasedActions from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
import classNames from 'classnames'
import Alert from 'components/Alert/Alert'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import FamilyManager from 'components/FamilyManager/FamilyManager'
import Inntekt from 'components/Inntekt/Inntekt'
import Purpose from 'components/Purpose/Purpose'
import * as types from 'constants/actionTypes'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Inntekt as IInntekt, Inntekter, ReplySed, Validation } from 'declarations/types'
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
import React, { useState } from 'react'
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

  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,

  creatingSedWithAttachments: state.loading.creatingSedWithAttachments,
  creatingSedEditInRINA: state.loading.creatingSedEditInRINA,
  savingSed: state.loading.savingSed,
  sendingSvarPaSed: state.loading.sendingSvarPaSed,

  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  inntekter: state.svarpased.inntekter,
  person: state.svarpased.person,
  svarPasedData: state.svarpased.svarPasedData,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold,
  replySed: state.svarpased.replySed,
  validation: state.svarpased.validation,

  highContrast: state.ui.highContrast
})

const mapStateTwo = (state: State): any => ({
  arbeidsforhold: state.svarpased.valgteArbeidsforhold,
  familieRelasjoner: state.svarpased.familierelasjoner,
  inntekter: state.svarpased.selectedInntekter,
  person: state.svarpased.person,
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

    saksnummerOrFnr,

    creatingSedWithAttachments,
    creatingSedEditInRINA,
    savingSed,
    sendingSvarPaSed,

    arbeidsforholdList,
    inntekter,
    person,

    svarPasedData,
    valgteArbeidsforhold,
    replySed,
    validation,

    highContrast
  }: any = useSelector<State, any>(mapState)

  const [_comment, setComment] = useState<string>('')
  const [_purpose, setPurpose] = useState<Array<string>>([])
  const [_replySed] = useState<ReplySed | undefined>(replySed)

  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const isValid = (validation: Validation): boolean => {
    return _.find(_.values(validation), (e) => e !== undefined) === undefined
  }

  const showFamily = () => {
    // return _replySed?.replySedType?.startsWith('F')
    return true
  }

  const sendReplySed = (): void => {

    if (_replySed) {
      const newValidation = validate({
        comment: _comment,
        purpose: _purpose,
        person: person
      })
      dispatch(svarpasedActions.setAllValidation(newValidation))
      if (isValid(newValidation)) {
        dispatch(svarpasedActions.sendSvarPaSedData(saksnummerOrFnr, _replySed!.querySedDocumentId, _replySed!.replySedType, data))
      }
    }
  }

  // TODO
  const createSedWithAttachments = () => {}

  // TODO
  const createSedEditInRINA = () => {}

  // TODO
  const saveSed = () => {}

  // TODO
  const onPreviewSed = () => {}

  const showArbeidsforhold = (): boolean => _replySed?.replySedType === 'U002' || _replySed?.replySedType === 'U007'

  const showInntekt = (): boolean => _replySed?.replySedType === 'U004'

  const onGoBackClick = () => {
    if (mode === '2') {
      dispatch(svarpasedActions.resetReplySed())
      setMode('1', 'back')
    }
  }

  const onSelectedInntekt = (items: Array<Item>) => {
    const inntekter: Inntekter = items.map(
      (item) =>
        ({
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

  return (
    <Step2Div>
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
        <Column style={{ flex: 2 }}>
          <Systemtittel>
            {_replySed?.replySedType} - {_replySed?.replySedDisplay}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <Purpose
            initialPurposes={_purpose}
            onPurposeChange={(p => setPurpose(p))}
            highContrast={highContrast}
            feil={validation.purpose}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {showFamily() && (
        <>
          <FamilyManager/>
          <VerticalSeparatorDiv />
        </>
      )}
      {showArbeidsforhold() && (
        <>
          <Ekspanderbartpanel tittel={t('ui:label-arbeidsforhold')}>
            <Arbeidsforhold
              getArbeidsforholdList={() => dispatch(svarpasedActions.getArbeidsforholdList(person?.fnr))}
              valgteArbeidsforhold={valgteArbeidsforhold}
              arbeidsforholdList={arbeidsforholdList}
              onArbeidsforholdClick={(item: any, checked: boolean) => dispatch(
                checked
                  ? svarpasedActions.addArbeidsforhold(item)
                  : svarpasedActions.removeArbeidsforhold(item)
              )}
            />
          </Ekspanderbartpanel>
          <VerticalSeparatorDiv />
        </>
      )}
      {showInntekt() && (
        <Ekspanderbartpanel tittel={t('ui:label-inntekt')}>
          <Inntekt
            fnr={person.fnr}
            highContrast={highContrast}
            inntekter={inntekter}
            onSelectedInntekt={onSelectedInntekt}
          />
        </Ekspanderbartpanel>
      )}
      <VerticalSeparatorDiv data-size='2' />
      <TextAreaDiv>
        <HighContrastTextArea
          data-test-id='c-svarpased-comment-textarea'
          id='c-svarpased-comment-textarea'
          className={classNames({'skjemaelement__input--harFeil' : validation.comment})}
          label={t('ui:label-comment-title')}
          placeholder={t('ui:label-comment-placeholder')}
          onChange={(e: any) => setComment(e.target.value)}
          value={_comment}
          feil={validation.comment ? t(validation.comment.feilmelding) : undefined}
        />
      </TextAreaDiv>
      <VerticalSeparatorDiv data-size='2' />
      <HighContrastFlatknapp
        mini
        kompakt
        onClick={onPreviewSed}
      >
        <Tilsette />
        <HorizontalSeparatorDiv data-size='0.5' />
        {t('ui:label-preview-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv data-size='2' />
      <ButtonsDiv>
        <div>
          <HighContrastHovedknapp
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
            onClick={createSedWithAttachments}
            disabled={creatingSedWithAttachments}
            spinner={creatingSedWithAttachments}
          >
            {t('ui:label-createSedWithAttachments')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        <div>
          <HighContrastKnapp
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
            onClick={saveSed}
            disabled={savingSed}
            spinner={savingSed}
          >
            {t('ui:label-saveSed')}
          </HighContrastKnapp>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
      </ButtonsDiv>
      <ValidationBox validation={validation}/>
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
