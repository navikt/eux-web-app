import { clientClear } from 'actions/alert'
import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import Alert from 'components/Alert/Alert'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import Family from 'components/Family/Family'
import Inntekt from 'components/Inntekt/Inntekt'
import PersonSearch from 'components/PersonSearch/PersonSearch'
import {
  Column,
  Container,
  Content,
  HorizontalSeparatorDiv,
  Margin,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Inntekt as IInntekt, Inntekter, SedOversikt, Validation } from 'declarations/types'
import _ from 'lodash'
import Alertstripe from 'nav-frontend-alertstriper'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Knapp } from 'nav-frontend-knapper'
import { Feiloppsummering, FeiloppsummeringFeil, Input, Select } from 'nav-frontend-skjema'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SvarpasedState } from 'reducers/svarpased'
import styled from 'styled-components'
import { Item } from 'tabell'

const SaksnummerDiv = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
`
const SaksnummerInput = styled(Input)`
  margin-right: 1rem;
`

const SedSelect = styled(Select)`
  width: 25%;
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

  gettingPerson: state.loading.gettingPerson,
  gettingSaksnummer: state.loading.gettingSaksnummer,
  sendingSvarPaSed: state.loading.sendingSvarPaSed,

  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  inntekter: state.svarpased.inntekter,
  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  spørreSed: state.svarpased.spørreSed,
  svarSed: state.svarpased.svarSed,
  svarPaSedOversikt: state.svarpased.svarPaSedOversikt,
  //seds: state.svarpased.seds,
  svarPasedData: state.svarpased.svarPasedData,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold
})

const mapStateTwo = (state: State): any => ({
  arbeidsforhold: state.svarpased.valgteArbeidsforhold,
  familieRelasjoner: state.svarpased.familierelasjoner,
  inntekter: state.svarpased.selectedInntekter,
  person: state.svarpased.person,
  sed: state.svarpased.svarSed
})

export interface SvarPaSedProps {
  location: any;
}

const SvarPaSed: React.FC<SvarPaSedProps> = ({
  location
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [, setIsFnrValid] = useState<boolean>(false)
  const [_fnr, setFnr] = useState<string>('')
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_saksnummer, setSaksnummer] = useState<string | undefined>(undefined)
  const [_validation, setValidation] = useState<Validation>({})
  const {
    alertStatus,
    alertMessage,
    alertType,

    familierelasjonKodeverk,

    gettingSaksnummer,
    gettingPerson,
    sendingSvarPaSed,

    arbeidsforholdList,
    inntekter,
    person,
    personRelatert,
    //seds,
    spørreSed,
    svarSed,
    svarPaSedOversikt,
    svarPasedData,
    valgteArbeidsforhold,
    valgteFamilieRelasjoner
  }: any = useSelector<State, any>(mapState)
  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const onSaksnummerClick = () => {
    //dispatch(svarpasedActions.getSeds(_saksnummer))
    dispatch(svarpasedActions.getSvarSedOversikt(_saksnummer))
  }

  const validate = (): Validation => {
    const validation: Validation = {
      saksnummer: !_saksnummer
        ? {
          feilmelding: t('ui:validation-noSaksnummer'),
          skjemaelementId: 'svarpased__saksnummer-input'
        } as FeiloppsummeringFeil
        : undefined,
      svarSed: !svarSed
        ? {
          feilmelding: t('ui:validation-noSedtype'),
          skjemaelementId: 'svarpased__svarsed-select'
        } as FeiloppsummeringFeil
        : undefined
    }
    setValidation(validation)
    return validation
  }

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

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== undefined) === undefined
  }

  const sendData = (): void => {
    if (isValid(validate())) {
      dispatch(svarpasedActions.sendSvarPaSedData(_saksnummer, svarSed.queryDocumentId, svarSed.replySedType, data))
    }
  }

  const onSpørreSedChange = (e: any) => {
    const selectedSed: string | undefined = e.target.value
    if (selectedSed) {
      dispatch(svarpasedActions.setSpørreSed(selectedSed))
    }
  }

  const onSvarSedChange = (e: any) => {
    if (svarPaSedOversikt && spørreSed) {
      const selectedSed: SedOversikt | undefined = _.find(svarPaSedOversikt[spørreSed], (s: SedOversikt) => s.replySedType === e.target.value)
      resetValidation('svarSed')
      if (selectedSed) {
        dispatch(svarpasedActions.setSvarSed(selectedSed))
      }
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

  const showArbeidsforhold = (): boolean => svarSed?.replySedType === 'U002' || svarSed?.replySedType === 'U007'

  const showInntekt = (): boolean => svarSed?.replySedType === 'U004'

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

  useEffect(() => {
    if (!_mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummerParam: string | null = params.get('rinasaksnummer')
      const fnrParam : string | null = params.get('fnr')
      if (rinasaksnummerParam) {
        setSaksnummer(rinasaksnummerParam)
        //dispatch(svarpasedActions.getSeds(rinasaksnummerParam))
        dispatch(svarpasedActions.getSvarSedOversikt(rinasaksnummerParam))
      }
      if (fnrParam) {
        setFnr(fnrParam)
        dispatch(svarpasedActions.getPerson(fnrParam))
        dispatch(svarpasedActions.getArbeidsforholdList(fnrParam))
      }
      setMounted(true)
    }
  }, [dispatch, _mounted, location.search])

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <SaksnummerDiv>
            <SaksnummerInput
              bredde='M'
              data-test-id='svarpased__saksnummer-input'
              id='svarpased__saksnummer-input'
              label='Saksnummer'
              value={_saksnummer}
              feil={_validation.saksnummer ? _validation.saksnummer.feilmelding : undefined}
              onChange={(e: any) => {
                setSaksnummer(e.target.value)
                resetValidation('saksnummer')
              }}
            />
            <Knapp
              spinner={gettingSaksnummer}
              onClick={onSaksnummerClick}
            >
              {t('ui:form-get')}
            </Knapp>
          </SaksnummerDiv>
          <VerticalSeparatorDiv />
          {svarPaSedOversikt && (
            <>
              <SedSelect
                data-test-id='svarpased__sporresed-select'
                id='svarpased__sporresed-select'
                label={t('ui:label-chooseSpørreSed')}
                onChange={onSpørreSedChange}
                feil={_validation.spørreSed ? _validation.spørreSed.feilmelding : undefined}
              >
                <option key=''>-</option>
                {Object.keys(svarPaSedOversikt)?.map((sed: string) => (
                  <option
                    key={sed}
                    value={sed}
                    selected={spørreSed ? spørreSed === sed : false}
                  >
                    {sed}
                  </option>
                ))}
              </SedSelect>
              <VerticalSeparatorDiv />
              {spørreSed && (
                <SedSelect
                  data-test-id='svarpased__svarsed-select'
                  id='svarpased__svarsed-select'
                  label={t('ui:label-chooseSvarSed')}
                  onChange={onSvarSedChange}
                  feil={_validation.svarSed ? _validation.svarSed.feilmelding : undefined}
                >
                  <option key=''>-</option>
                  {svarPaSedOversikt[spørreSed].map((sed: SedOversikt) => (
                    <option
                      key={sed.queryDocumentId}
                      value={sed.replySedType}
                      selected={svarSed ? svarSed.queryDocumentId === sed.queryDocumentId : false}
                    >
                      {sed.replySedType} - {sed.replyDisplay}
                    </option>
                  ))}
                </SedSelect>
              )}
              <VerticalSeparatorDiv />
            </>
          )}
          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            alertTypesWatched={[types.SVARPASED_PERSON_GET_FAILURE]}
            className='slideAnimate'
            gettingPerson={gettingPerson}
            initialFnr={_fnr}
            id='svarpased__pearsonsearch'
            onFnrChange={() => {
              setIsFnrValid(false)
              dispatch(appActions.cleanData())
            }}
            onPersonFound={() => setIsFnrValid(true)}
            onSearchPerformed={(fnr) => dispatch(svarpasedActions.getPerson(fnr))}
            onPersonRemoved={() => dispatch(svarpasedActions.resetPerson())}
            onAlertClose={() => dispatch(clientClear())}
            person={person}
            resetAllValidation={() => resetValidation()}
            validation={_validation.fnr}
          />
          <VerticalSeparatorDiv />
          {!_.isNil(person) && (
            <>
              {svarSed?.replySedType.startsWith('F') && (
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
                {sendingSvarPaSed ? t('ui:label-sendingSvarSed') : t('ui:label-sendSvarSed')}
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
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default SvarPaSed
