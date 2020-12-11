import { clientClear } from 'actions/alert'
import * as svarpasedActions from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import Alert from 'components/Alert/Alert'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import Family from 'components/Family/Family'
import Inntekt from 'components/Inntekt/Inntekt'
import SEDPanel from 'components/SEDPanel/SEDPanel'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HorizontalSeparatorDiv,
  LineSeparator,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Inntekt as IInntekt, Inntekter, Validation } from 'declarations/types'
import _ from 'lodash'
import Alertstripe from 'nav-frontend-alertstriper'
import { VenstreChevron } from 'nav-frontend-chevron'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Knapp } from 'nav-frontend-knapper'
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
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
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`

const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,

  familierelasjonKodeverk: state.app.familierelasjoner,
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,

  sendingSvarPaSed: state.loading.sendingSvarPaSed,

  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  inntekter: state.svarpased.inntekter,
  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  svarPasedData: state.svarpased.svarPasedData,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,
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

    familierelasjonKodeverk,
    saksnummerOrFnr,

    sendingSvarPaSed,

    arbeidsforholdList,
    inntekter,
    person,
    personRelatert,
    svarPasedData,
    valgteArbeidsforhold,
    valgteFamilieRelasjoner,
    replySed,

    highContrast
  }: any = useSelector<State, any>(mapState)
  const [_addFormal, setAddFormal] = useState<boolean>(false)
  const [_newFormal, setNewFormal] = useState<string>('')
  const [_formal, setFormal] = useState<Array<string>>([])
  const [_validation, setValidation] = useState<Validation>({})

  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const validate = (): Validation => {
    const validation: Validation = {
      replysed: !replySed
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

  const sendData = (): void => {
    if (isValid(validate())) {
      dispatch(svarpasedActions.sendSvarPaSedData(saksnummerOrFnr, replySed.queryDocumentId, replySed.replySedType, data))
    }
  }

  const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    dispatch(
      svarpasedActions.addFamilierelasjoner({
        ...relation,
        nasjonalitet: 'NO'
      })
    )
  }

  const showArbeidsforhold = (): boolean => replySed?.replySedType === 'U002' || replySed?.replySedType === 'U007'

  const showInntekt = (): boolean => replySed?.replySedType === 'U004'

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
    <>
      <Row>
        <Column>
          <HighContrastLink
            href='#'
            onClick={() => {
              if (mode === '2') {
                setMode('1', 'back', () => {
                  dispatch(svarpasedActions.resetReplySed())
                })
              }
            }}
          >
            <VenstreChevron />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('ui:form-back')}
          </HighContrastLink>
        </Column>

      </Row>
      <Row>
        <Column style={{ flex: 2 }}>
          <Systemtittel>
            {replySed?.replySedType} - {replySed?.replyDisplay}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <Undertittel>
            {t('ui:label-choosePurpose')}
          </Undertittel>
          <VerticalSeparatorDiv />
          {_formal && _formal.map(f => (
            <FlexDiv
              key={f}
            >
              <Normaltekst>
                {f}
              </Normaltekst>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setFormal(_.filter(_formal, _f => _f !== f))}
              >
                <Trashcan />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:form-remove')}
              </HighContrastFlatknapp>
            </FlexDiv>
          ))}
          {!_addFormal
            ? (
              <>
                <HighContrastFlatknapp
                  onClick={() => setAddFormal(!_addFormal)}
                >
                  <Tilsette />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('ui:form-addPurpose')}
                </HighContrastFlatknapp>
              </>
              )
            : (
              <FlexDiv>
                <HighContrastInput
                  bredde='XXL'
                  style={{ flex: 2 }}
                  value={_newFormal}
                  onChange={(e) => setNewFormal(e.target.value)}
                />
                <HorizontalSeparatorDiv data-size='0.5' />
                <FlexDiv>
                  <HighContrastKnapp
                    mini
                    kompakt
                    onClick={() => {
                      setFormal(_formal.concat(_newFormal))
                      setNewFormal('')
                    }}
                  >
                    <Tilsette />
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {t('ui:form-add')}
                  </HighContrastKnapp>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => setAddFormal(!_addFormal)}
                  >
                    {t('ui:form-cancel')}
                  </HighContrastFlatknapp>
                </FlexDiv>
              </FlexDiv>
              )}
        </Column>
        <VerticalSeparatorDiv />
        <LineSeparator>&nbsp;</LineSeparator>
        <VerticalSeparatorDiv />
        {replySed && (
          <Column>
            <SEDPanel replysed={replySed} />
          </Column>
        )}
      </Row>
      <VerticalSeparatorDiv />
      {!_.isNil(person) && (
        <>
          {replySed?.replySedType.startsWith('F') && (
            <>
              <Ekspanderbartpanel tittel={t('ui:label-familyRelationships')}>
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
          <VerticalSeparatorDiv />
          <Knapp
            onClick={sendData}
            disabled={sendingSvarPaSed}
            spinner={sendingSvarPaSed}
          >
            {sendingSvarPaSed ? t('ui:label-sendingReplySed') : t('ui:label-sendReplySed')}
          </Knapp>
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
        </>
      )}
    </>
  )
}

export default Step2
