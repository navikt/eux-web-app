import { clientClear } from 'actions/alert'
import * as svarpasedActions from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
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
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import {
  Column, HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SvarpasedState } from 'reducers/svarpased'
import styled from 'styled-components'
import { Item } from 'tabell'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Step2Div = styled.div`
`

const ButtonsDiv = styled.div`
  display: flex;
  width: 20px;
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

    highContrast
  }: any = useSelector<State, any>(mapState)

  const [_comment, setComment] = useState<string>('')
  const [_purpose, setPurpose] = useState<Array<string>>([])
  const [_replySed] = useState<ReplySed | undefined>(replySed)
  const [_validation, setValidation] = useState<Validation>({})

  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const validate = (): Validation => {
    const validation: Validation = {
      replysed: !_replySed
        ? {
          feilmelding: t('ui:validation-noSedtype'),
          skjemaelementId: 'svarpased__replysed-select'
        } as FeiloppsummeringFeil
        : undefined
    }
    setValidation(validation)
    return validation
  }
  /*
  const resetValidation = (key?: Array<string> | string): void => {
    const newValidation = _.cloneDeep(_validation)
    if (!key) {
      setValidation({})
    }
    if (_.isString(key)) {
      newValidation[key] = undefined
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = undefined
      })
    }
    setValidation(newValidation)
  }
*/
  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== undefined) === undefined
  }

  const showFamily = () => {
    //return _replySed?.replySedType?.startsWith('F')
    return true
  }

  const sendReplySed = (): void => {
    if (_replySed && isValid(validate())) {
      dispatch(svarpasedActions.sendSvarPaSedData(saksnummerOrFnr, _replySed!.querySedDocumentId, _replySed!.replySedType, data))
    }
  }
  const createSedWithAttachments = () => {}

  const createSedEditInRINA = () => {}

  const saveSed = () => {}

  const onPreviewSed = () => {}

  /*const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    /*dispatch(
      svarpasedActions.addFamilierelasjoner({
        ...relation,
        nasjonalitet: 'NO'
      })
    )
  }*/

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
          {t('ui:form-back')}
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
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {showFamily() && (
        <>
          <FamilyManager
            person={person}

          />
            {/*<Ekspanderbartpanel tittel={t('ui:label-familyRelationships')}>
            <Family
              alertStatus={alertStatus}
              alertMessage={alertMessage}
              alertType={alertType}
              abroadPersonFormAlertTypesWatched={[types.SVARPASED_ABROADPERSON_ADD_FAILURE]}
              TPSPersonFormAlertTypesWatched={[
                types.SVARPASED_PERSON_RELATERT_GET_FAILURE,
                types.SVARPASED_TPSPERSON_ADD_FAILURE
              ]}
              familierelasjonKodeverk={familierelasjonKodeverk}
              personRelatert={personRelatert}
              person={person}
              valgteFamilieRelasjoner={valgteFamilieRelasjoner}
              onAbroadPersonAddedFailure={() => dispatch({ type: types.SVARPASED_ABROADPERSON_ADD_FAILURE })}
              onAbroadPersonAddedSuccess={(_relation) => {
                dispatch(svarpasedActions.addFamilierelasjoner(_relation))
                dispatch({ type: types.SVARPASED_ABROADPERSON_ADD_SUCCESS })
              }}
              onRelationAdded={(relation: FamilieRelasjon) => addTpsRelation(relation)}
              onRelationRemoved={(relation: FamilieRelasjon) => dispatch(svarpasedActions.removeFamilierelasjoner(relation))}
              onRelationReset={() => dispatch(svarpasedActions.resetPersonRelatert())}
              onTPSPersonAddedFailure={() => dispatch({ type: types.SVARPASED_TPSPERSON_ADD_FAILURE })}
              onTPSPersonAddedSuccess={(e: any) => {
                dispatch(svarpasedActions.addFamilierelasjoner(e))
                dispatch({ type: types.SVARPASED_TPSPERSON_ADD_SUCCESS })
              }}
              onAlertClose={() => dispatch(clientClear())}
              onSearchFnr={(sok) => {
                dispatch(svarpasedActions.resetPersonRelatert())
                dispatch(svarpasedActions.getPersonRelated(sok))
              }}
            />
          </Ekspanderbartpanel>
          */}
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
      <VerticalSeparatorDiv data-size='2'/>
      <TextAreaDiv>
        <HighContrastTextArea
          label={t('ui:form-comment-title')}
          placeholder={t('ui:form-comment-placeholder')}
          onChange={(e: any) => setComment(e.target.value)}
          value={_comment}
        />
      </TextAreaDiv>
      <VerticalSeparatorDiv data-size='2'/>
      <HighContrastFlatknapp
        mini
        kompakt
        onClick={onPreviewSed}
      >
        <Tilsette />
        <HorizontalSeparatorDiv data-size='0.5' />
        {t('ui:form-preview-sed')}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv data-size='2'/>
      <ButtonsDiv>
        <HighContrastHovedknapp
          onClick={sendReplySed}
          disabled={sendingSvarPaSed}
          spinner={sendingSvarPaSed}
        >
          {sendingSvarPaSed ? t('ui:label-sendingReplySed') : t('ui:label-sendReplySed')}
        </HighContrastHovedknapp>
        <HorizontalSeparatorDiv/>
        <HighContrastKnapp
          onClick={createSedWithAttachments}
          disabled={creatingSedWithAttachments}
          spinner={creatingSedWithAttachments}
        >
          {t('ui:label-createSedWithAttachments')}
        </HighContrastKnapp>
        <HorizontalSeparatorDiv/>
        <HighContrastKnapp
          onClick={createSedEditInRINA}
          disabled={creatingSedEditInRINA}
          spinner={creatingSedEditInRINA}
        >
          {t('ui:label-createSedEditInRINA')}
        </HighContrastKnapp>
        <HorizontalSeparatorDiv/>
        <HighContrastKnapp
          onClick={saveSed}
          disabled={savingSed}
          spinner={savingSed}
        >
          {t('ui:label-saveSed')}
        </HighContrastKnapp>
      </ButtonsDiv>
        {!isValid(_validation) && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <Row>
            <Column>
              <Feiloppsummering
                data-test-id='opprettsak__feiloppsummering'
                tittel={t('ui:validation-feiloppsummering')}
                feil={Object.values(_validation).filter(v => v !== undefined) as Array<FeiloppsummeringFeil>}
              />
            </Column>
            <HorizontalSeparatorDiv data-size='2' />
            <Column />
          </Row>
        </>
      )}
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
