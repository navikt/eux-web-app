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
import { FamilieRelasjon, Inntekt as IInntekt, Inntekter, Person, SedOversikt, Validation } from 'declarations/types'
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

const InputAndButtonDiv = styled.div`
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
  sendingSvarPaSed: state.loading.sendingSvarPaSed,
  queryingSvarSed: state.loading.queryingSvarSed,
  queryingSvarPaSedOversikt: state.loading.queryingSvarPaSedOversikt,

  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  inntekter: state.svarpased.inntekter,
  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  spørreSed: state.svarpased.spørreSed,
  svarSed: state.svarpased.svarSed,
  svarPaSedOversikt: state.svarpased.svarPaSedOversikt,
  // seds: state.svarpased.seds,
  svarPasedData: state.svarpased.svarPasedData,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold,
  valgtSvarSed: state.svarpased.valgtSvarSed
})

const mapStateTwo = (state: State): any => ({
  arbeidsforhold: state.svarpased.valgteArbeidsforhold,
  familieRelasjoner: state.svarpased.familierelasjoner,
  inntekter: state.svarpased.selectedInntekter,
  person: state.svarpased.person,
  sed: state.svarpased.valgtSvarSed
})

export interface SvarPaSedProps {
  location: any;
}



const SvarPaSed: React.FC<SvarPaSedProps> = ({
  location
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_person, setPerson] = useState<Person | null | undefined>(undefined)
  const [_fnr, setFnr] = useState<string>('')
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_saksnummer, setSaksnummer] = useState<string | undefined>(undefined)
  const [_validation, setValidation] = useState<Validation>({})
  const {
    alertStatus,
    alertMessage,
    alertType,

    familierelasjonKodeverk,

    gettingPerson,
    sendingSvarPaSed,
    queryingSvarSed,
    queryingSvarPaSedOversikt,

    arbeidsforholdList,
    inntekter,
    person,
    personRelatert,
    // seds,
    spørreSed,
    svarSed,
    svarPaSedOversikt,
    svarPasedData,
    valgteArbeidsforhold,
    valgteFamilieRelasjoner,
    valgtSvarSed
  }: any = useSelector<State, SvarpasedState>(mapState)
  const data: SvarpasedState = useSelector<State, SvarpasedState>(mapStateTwo)

  const onSaksnummerClick = () => {
    // dispatch(svarpasedActions.getSeds(_saksnummer))
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
      svarSed: !valgtSvarSed
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
      dispatch(svarpasedActions.sendSvarPaSedData(_saksnummer, valgtSvarSed.querySedDocumentId, valgtSvarSed.replySedType, data))
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

  const onSvarSedClick = () => {
    dispatch(svarpasedActions.querySvarSed(_saksnummer, valgtSvarSed.querySedDocumentId, valgtSvarSed.replySedType))
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

  const showArbeidsforhold = (): boolean => valgtSvarSed?.replySedType === 'U002' || valgtSvarSed?.replySedType === 'U007'

  const showInntekt = (): boolean => valgtSvarSed?.replySedType === 'U004'

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
      if (rinasaksnummerParam) {
        setSaksnummer(rinasaksnummerParam)
        // dispatch(svarpasedActions.getSeds(rinasaksnummerParam))
        dispatch(svarpasedActions.getSvarSedOversikt(rinasaksnummerParam))
      }
      setMounted(true)
    }
  }, [dispatch, _mounted, location.search])

  // when I have fnr:
//
  useEffect(() => {
    if (person === undefined && !gettingPerson && !_.isNil(svarSed)) {
      const pin = _.find(svarSed.bruker.personInfo.pin, p => p.land === 'NO')
      if (pin) {
        const fnr = pin.identifikator
        dispatch(svarpasedActions.getPerson(fnr))
        dispatch(svarpasedActions.getArbeidsforholdList(fnr))
      }
    }
  }, [person, _person, gettingPerson, svarSed])

  useEffect(() => {
    if (!_.isNil(person) && !_fnr && _person === undefined) {
      setPerson(person)
      setFnr(person.fnr)
    }
  }, [person, person, _fnr])

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <InputAndButtonDiv>
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
              disabled={queryingSvarPaSedOversikt}
              spinner={queryingSvarPaSedOversikt}
              onClick={onSaksnummerClick}
            >
              {queryingSvarPaSedOversikt ? t('ui:form-getting') : t('ui:form-get')}
            </Knapp>
          </InputAndButtonDiv>
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
                <InputAndButtonDiv>
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
                        key={sed.querySedDocumentId}
                        value={sed.replySedType}
                        selected={valgtSvarSed ? valgtSvarSed.querySedDocumentId === sed.querySedDocumentId : false}
                      >
                        {sed.replySedType} - {sed.replySedDisplay}
                      </option>
                    ))}
                  </SedSelect>
                  {valgtSvarSed && (
                    <>
                      <HorizontalSeparatorDiv data-size='2' />
                      <Knapp
                        disabled={queryingSvarSed}
                        spinner={queryingSvarSed}
                        onClick={onSvarSedClick}
                      >
                        {queryingSvarSed ? t('ui:form-getting') : t('ui:form-get')}
                      </Knapp>
                    </>
                  )}
                </InputAndButtonDiv>
              )}
              {!_.isNil(svarSed) && (
                <>
                  <VerticalSeparatorDiv data-size='2' />
                  <PersonSearch
                    alertStatus={alertStatus}
                    alertMessage={alertMessage}
                    alertType={alertType}
                    alertTypesWatched={[types.SVARPASED_PERSON_GET_FAILURE]}
                    className='slideAnimate'
                    data-test-id='svarpased__fnr'
                    gettingPerson={gettingPerson}
                    key={'svarpased__fnr__' + _fnr}
                    id='svarpased__fnr'
                    initialFnr={_fnr}
                    onFnrChange={(fnr: string) => {
                      setFnr(fnr)
                      dispatch(appActions.cleanData())
                      setPerson(null)
                    }}
                    onSearchPerformed={(fnr: string) => {
                      setFnr('')
                      setPerson(undefined)
                      dispatch(svarpasedActions.getPerson(fnr))
                      dispatch(svarpasedActions.getArbeidsforholdList(fnr))
                    }}
                    onPersonRemoved={() => {
                      dispatch(svarpasedActions.resetPerson())
                      setPerson(null)
                    }}
                    onAlertClose={() => dispatch(clientClear())}
                    person={_person}
                    resetAllValidation={() => resetValidation()}
                    validation={_validation.fnr}
                  />
                </>
              )}
              <VerticalSeparatorDiv />
            </>
          )}
          <VerticalSeparatorDiv />
          {!_.isNil(_person) && (
            <>
              {valgtSvarSed?.replySedType.startsWith('F') && (
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
