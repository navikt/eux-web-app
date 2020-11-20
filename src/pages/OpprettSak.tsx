import { clientClear } from 'actions/alert'
import * as appActions from 'actions/app'
import * as sakActions from 'actions/sak'
import classNames from 'classnames'
import AbortModal from 'components/AbortModal/AbortModal'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import Family from 'components/Family/Family'
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
import {
  Arbeidsforholdet,
  BucTyper,
  Enhet,
  Enheter,
  FagSak,
  FagSaker,
  FamilieRelasjon,
  Institusjon,
  Kodemaps,
  Kodeverk,
  OpprettetSak,
  Person,
  ServerInfo,
  Tema,
  Validation
} from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import { History } from 'history'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import Panel from 'nav-frontend-paneler'
import { Feiloppsummering, FeiloppsummeringFeil, Select } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const AlignCenterColumn = styled(Column)`
  display: flex;
  align-items: center;
`
const FamilyPanel = styled(Panel)`
  border: 1px solid lightgray;
  border-radius: 5px;
  background-color: white;
  padding: 1rem;
`
const FlexDiv = styled.div`
  display: flex;
`

export interface OpprettSakProps {
  history: History
}

export interface OpprettSakSelector {
  alertStatus: AlertStatus | undefined
  alertMessage: string | undefined
  alertType: string | undefined

  enheter: Enheter | undefined
  serverInfo: ServerInfo | undefined

  sendingSak: boolean
  gettingPerson: boolean

  arbeidsforholdList: Array<Arbeidsforholdet> | undefined
  buctyper: BucTyper | undefined
  fagsaker: FagSaker | undefined | null
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  kodemaps: Kodemaps | undefined
  institusjoner: Array<Institusjon> | undefined
  landkoder: Array<Kodeverk> | undefined
  opprettetSak: OpprettetSak | undefined
  person: Person | undefined
  personRelatert: Person | undefined
  sedtyper: Array<Kodeverk> | undefined
  sektor: Array<Kodeverk> | undefined
  tema: Tema | undefined

  valgteArbeidsforhold: Array<Arbeidsforholdet>
  valgtBucType: string | undefined
  valgteFamilieRelasjoner: Array<FamilieRelasjon>
  valgtFnr: string | undefined
  valgtInstitusjon: string | undefined
  valgtLandkode: string | undefined
  valgtSaksId: string | undefined
  valgtSedType: string | undefined
  valgtSektor: string | undefined
  valgtTema: string | undefined
  valgtUnit: string | undefined
}

const mapState = (state: State): OpprettSakSelector => ({
  alertStatus: state.alert.clientErrorStatus as AlertStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,

  enheter: state.app.enheter,
  serverInfo: state.app.serverinfo,
  buctyper: state.app.buctyper,
  familierelasjonKodeverk: state.app.familierelasjoner,
  kodemaps: state.app.kodemaps,
  landkoder: state.app.landkoder,
  sedtyper: state.app.sedtyper,
  sektor: state.app.sektor,
  tema: state.app.tema,

  sendingSak: state.loading.sendingSak,
  gettingPerson: state.loading.gettingPerson,

  arbeidsforholdList: state.sak.arbeidsforholdList,
  valgteArbeidsforhold: state.sak.arbeidsforhold,
  valgtBucType: state.sak.buctype,
  valgteFamilieRelasjoner: state.sak.familierelasjoner,
  fagsaker: state.sak.fagsaker,
  valgtFnr: state.sak.fnr,
  valgtInstitusjon: state.sak.institusjon,
  institusjoner: state.sak.institusjonList,
  valgtLandkode: state.sak.landkode,
  opprettetSak: state.sak.opprettetSak,
  person: state.sak.person,
  personRelatert: state.sak.personRelatert,
  valgtSaksId: state.sak.saksId,
  valgtSedType: state.sak.sedtype,
  valgtSektor: state.sak.sektor,
  valgtTema: state.sak.tema,
  valgtUnit: state.sak.unit
})

const OpprettSak: React.FC<OpprettSakProps> = ({
  history
}: OpprettSakProps): JSX.Element => {
  const {
    alertStatus,
    alertMessage,
    alertType,
    gettingPerson,
    enheter,
    serverInfo,
    sendingSak,
    arbeidsforholdList,
    buctyper,
    fagsaker,
    familierelasjonKodeverk,
    sedtyper,
    institusjoner,
    kodemaps,
    landkoder,
    opprettetSak,
    person,
    personRelatert,
    sektor,
    tema,
    valgteArbeidsforhold,
    valgtBucType,
    valgteFamilieRelasjoner,
    valgtFnr,
    valgtInstitusjon,
    valgtLandkode,
    valgtSaksId,
    valgtSedType,
    valgtSektor,
    valgtTema,
    valgtUnit
  }: OpprettSakSelector = useSelector<State, OpprettSakSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_visModal, setVisModal] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})
  const [_isFnrValid, setIsFnrValid] = useState<boolean>(false)

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !valgtSektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[valgtSektor] as keyof Tema]
  const _buctyper: Array<Kodeverk> = !kodemaps ? [] : !valgtSektor ? [] : !buctyper ? [] : buctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor] as keyof BucTyper]
  let _sedtyper: Array<Kodeverk | string> = !kodemaps ? [] : !valgtSektor ? [] : !valgtBucType ? [] : kodemaps.BUC2SEDS[valgtSektor][valgtBucType]

  if (!(_sedtyper && _sedtyper.length)) {
    _sedtyper = []
  }
  _sedtyper = _sedtyper.reduce((acc: any, curr: any) => {
    const kode = sedtyper?.find((elem: any) => elem.kode === curr)
    acc.push(kode)
    return acc
  }, [])

  const isSomething = (value: any): boolean => !_.isNil(value) && !_.isEmpty(value)
  const visFagsakerListe: boolean = isSomething(valgtSektor) && isSomething(tema) && isSomething(fagsaker)
  const visArbeidsforhold: boolean = EKV.Koder.sektor.FB === valgtSektor &&
    EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && isSomething(valgtSedType)
  const visEnheter: boolean = valgtSektor === 'HZ' || valgtSektor === 'SI'

  const validate = (): Validation => {
    const validation: Validation = {
      fnr: !valgtFnr
        ? {
          feilmelding: t('ui:validation-noFnr'),
          skjemaelementId: 'opprettsak__fnr'
        } as FeiloppsummeringFeil
        : !_isFnrValid
            ? {
              feilmelding: t('ui:validation-uncheckedFnr'),
              skjemaelementId: 'opprettsak__fnr'
            } as FeiloppsummeringFeil
            : undefined,
      sektor: !valgtSektor
        ? {
          feilmelding: t('ui:validation-noSektor'),
          skjemaelementId: 'opprettsak__sektor'
        } as FeiloppsummeringFeil
        : undefined,
      buctype: !valgtBucType
        ? {
          feilmelding: t('ui:validation-noBuctype'),
          skjemaelementId: 'opprettsak__buctype'
        } as FeiloppsummeringFeil
        : undefined,
      sedtype: !valgtSedType
        ? {
          feilmelding: t('ui:validation-noSedtype'),
          skjemaelementId: 'opprettsak__sedtype'
        } as FeiloppsummeringFeil
        : undefined,
      landkode: !valgtLandkode
        ? {
          feilmelding: t('ui:validation-noLand'),
          skjemaelementId: 'opprettsak__landkode'
        } as FeiloppsummeringFeil
        : undefined,
      institusjon: !valgtInstitusjon
        ? {
          feilmelding: t('ui:validation-noInstitusjonsID'),
          skjemaelementId: 'opprettsak__institusjon'
        } as FeiloppsummeringFeil
        : undefined,
      tema: !valgtTema
        ? {
          feilmelding: t('ui:validation-noTema'),
          skjemaelementId: 'opprettsak__tema'
        } as FeiloppsummeringFeil
        : undefined,
      saksId: !valgtSaksId
        ? {
          feilmelding: t('ui:validation-noSaksId'),
          skjemaelementId: 'opprettsak__saksId'
        } as FeiloppsummeringFeil
        : undefined,
      unit: visEnheter && !valgtUnit
        ? {
          feilmelding: t('ui:validation-noUnit'),
          skjemaelementId: 'opprettsak__unit'
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

  const skjemaSubmit = (): void => {
    if (isValid(validate())) {
      const payload = {
        buctype: valgtBucType,
        fnr: valgtFnr,
        landKode: valgtLandkode,
        institusjonsID: valgtInstitusjon,
        saksID: valgtSaksId,
        sedtype: valgtSedType,
        sektor: valgtSektor,
        tema: valgtTema,
        familierelasjoner: valgteFamilieRelasjoner,
        arbeidsforhold: valgteArbeidsforhold,
        enhet: valgtUnit
      }
      dispatch(sakActions.createSak(payload))
    }
  }

  const openModal = (): void => {
    setVisModal(true)
  }

  const closeModal = (): void => {
    setVisModal(false)
  }

  const onAbort = (): void => {
    dispatch(appActions.cleanData())
    history.push('/')
  }

  const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('unit')
    dispatch(sakActions.setProperty('unit', e.target.value))
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('sektor')
    dispatch(sakActions.setProperty('unit', undefined))
    dispatch(sakActions.setProperty('sektor', e.target.value))
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const buctype = event.target.value
    resetValidation(['buctype', 'landkode'])
    dispatch(sakActions.setProperty('landkode', undefined))
    dispatch(sakActions.setProperty('sedtype', undefined))
    dispatch(sakActions.setProperty('institution', undefined))
    dispatch(sakActions.setProperty('buctype', buctype))
    dispatch(sakActions.getLandkoder(buctype))
  }

  const onSedtypeSet = (e: string): void => {
    resetValidation('sedtype')
    dispatch(sakActions.setProperty('sedtype', e))
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSedtypeSet(e.target.value)
  }

  const onLandkodeChange = (country: any): void => {
    resetValidation(['landkode', 'institusjon'])
    const landKode = country.value
    dispatch(sakActions.setProperty('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('institusjon')
    dispatch(sakActions.setProperty('institusjon', event.target.value))
  }

  const onTemaChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation(['tema', 'saksId'])
    dispatch(sakActions.setProperty('tema', event.target.value))
    dispatch(sakActions.resetFagsaker())
    dispatch(sakActions.setProperty('saksId', ''))
  }

  const onViewFagsakerClick = (): void => {
    dispatch(sakActions.getFagsaker(person?.fnr, valgtSektor, valgtTema))
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('saksId')
    dispatch(sakActions.setProperty('saksId', event.target.value))
  }

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <Systemtittel>
            {t('ui:title-newcase')}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            alertTypesWatched={[types.SAK_PERSON_GET_FAILURE]}
            className='slideAnimate'
            data-test-id='opprettsak__fnr'
            gettingPerson={gettingPerson}
            id='opprettsak__fnr'
            initialFnr=''
            onFnrChange={() => {
              setIsFnrValid(false)
              dispatch(appActions.cleanData())
            }}
            onPersonFound={() => setIsFnrValid(true)}
            onSearchPerformed={(fnr: string) => {
              dispatch(sakActions.setProperty('fnr', fnr))
              dispatch(sakActions.getPerson(fnr))
            }}
            onPersonRemoved={() => dispatch(sakActions.resetPerson())}
            onAlertClose={() => dispatch(clientClear())}
            person={person}
            resetAllValidation={() => resetValidation()}
            validation={_validation.fnr}
          />
          {isSomething(person) && (
            <>
              <Row>
                <Column
                  className='slideAnimate'
                  style={{ animationDelay: '0s' }}
                >
                  <Select
                    data-test-id='opprettsak__sektor'
                    feil={_validation.sektor ? _validation.sektor.feilmelding : undefined}
                    id='opprettsak__sektor'
                    label={t('ui:label-sektor')}
                    onChange={onSektorChange}
                    value={valgtSektor}
                  >
                    <option value=''>
                      {t('ui:form-choose')}
                    </option>
                    {sektor &&
                      _.orderBy(sektor, 'term').map((k: Kodeverk) => (
                        <option value={k.kode} key={k.kode}>
                          {k.term}
                        </option>
                      ))}
                  </Select>
                  <VerticalSeparatorDiv />
                </Column>
                <HorizontalSeparatorDiv />
                <Column
                  className='slideAnimate'
                  style={{ animationDelay: '0.15s' }}
                >
                  {visEnheter && (
                    <Select
                      data-test-id='oprettsak__unit'
                      feil={_validation.unit ? _validation.unit.feilmelding : undefined}
                      id='oprettsak__unit'
                      label={t('ui:label-unit')}
                      onChange={onUnitChange}
                      value={valgtUnit}
                    >
                      <option value=''>
                        {t('ui:form-choose')}
                      </option>
                      {sektor &&
                        _.orderBy(enheter, 'navn').map((e: Enhet) => (
                          <option value={e.enhetId} key={e.enhetId}>
                            {e.navn}
                          </option>
                        ))}
                    </Select>
                  )}
                  <VerticalSeparatorDiv />
                </Column>
              </Row>
              <Row>
                <Column
                  className='slideAnimate'
                  style={{ animationDelay: '0.3s' }}
                >
                  <Select
                    data-test-id='opprettsak__buctype'
                    disabled={!isSomething(valgtSektor)}
                    feil={_validation.buctype ? _validation.buctype.feilmelding : undefined}
                    id='opprettsak__buctype'
                    label={t('ui:label-buc')}
                    onChange={onBuctypeChange}
                    value={valgtBucType}
                  >
                    <option value=''>
                      {t('ui:form-choose')}
                    </option>
                    {_buctyper &&
                      _.orderBy(_buctyper, 'kode').map((k: Kodeverk) => (
                        <option value={k.kode} key={k.kode}>
                          {k.kode} - {k.term}
                        </option>
                      ))}
                  </Select>
                  <VerticalSeparatorDiv />
                </Column>
                <HorizontalSeparatorDiv />
                <Column
                  className='slideAnimate'
                  style={{ animationDelay: '0.45s' }}
                >
                  <Select
                    data-test-id='opprettsak__sedtype'
                    disabled={!isSomething(valgtBucType) || !isSomething(valgtSektor)}
                    feil={_validation.sedtype ? _validation.sedtype?.feilmelding : undefined}
                    id='opprettsak__sedtype'
                    label={t('ui:label-sed')}
                    onChange={onSedtypeChange}
                    value={valgtSedType}
                  >
                    <option value=''>
                      {t('ui:form-choose')}
                    </option>)
                    {_sedtyper && _sedtyper.map((k: string | Kodeverk) => {
                      // if only one element, select it
                      if (_sedtyper.length === 1 && valgtSedType !== (k as Kodeverk).kode) {
                        onSedtypeSet((k as Kodeverk).kode)
                      }
                      return (
                        <option value={(k as Kodeverk).kode} key={(k as Kodeverk).kode}>
                          {(k as Kodeverk).kode} - {(k as Kodeverk).term}
                        </option>
                      )
                    })}
                  </Select>
                  <VerticalSeparatorDiv />
                </Column>
              </Row>
              <Row>
                <Column
                  className='slideAnimate'
                  style={{ animationDelay: '0.6s' }}
                >
                  <CountrySelect
                    data-test-id='opprettsak__landkode'
                    error={_validation.landkode ? _validation.landkode.feilmelding : undefined}
                    id='opprettsak__landkode'
                    includeList={landkoder ? _.orderBy(landkoder, 'term').map((k: Kodeverk) => k.kode) : []}
                    label={t('ui:label-landkode')}
                    lang='nb'
                    menuPortalTarget={document.body}
                    onOptionSelected={onLandkodeChange}
                    placeholder={t('ui:form-choose')}
                    value={valgtLandkode}
                  />
                  <VerticalSeparatorDiv />
                </Column>
                <HorizontalSeparatorDiv />
                <Column
                  className='slideAnimate'
                  style={{ animationDelay: '0.75s' }}
                >
                  <Select
                    data-test-id='opprettsak__institusjon'
                    disabled={!isSomething(valgtLandkode)}
                    feil={_validation.institusjon ? _validation.institusjon.feilmelding : undefined}
                    id='opprettsak__institusjon'
                    label={t('ui:label-institusjon')}
                    onChange={onInstitusjonChange}
                    value={valgtInstitusjon}
                  >
                    <option value=''>
                      {t('ui:form-choose')}
                    </option>)
                    {institusjoner &&
                      _.orderBy(institusjoner, 'term').map((i: Institusjon) => (
                        <option
                          value={i.institusjonsID}
                          key={i.institusjonsID}
                        >
                          {i.navn}
                        </option>
                      ))}
                  </Select>
                  <VerticalSeparatorDiv />
                </Column>
              </Row>
              <Row>
                {valgtSektor === 'FB' && (
                  <Column className='slideAnimate'>
                    <Systemtittel>
                      {t('ui:label-familyRelationships')}
                    </Systemtittel>
                    <VerticalSeparatorDiv />
                    <FamilyPanel>
                      <Family
                        alertStatus={alertStatus}
                        alertMessage={alertMessage}
                        alertType={alertType}
                        abroadPersonFormAlertTypesWatched={[
                          types.SAK_ABROADPERSON_ADD_FAILURE
                        ]}
                        TPSPersonFormAlertTypesWatched={[
                          types.SAK_PERSON_RELATERT_GET_FAILURE,
                          types.SAK_TPSPERSON_ADD_FAILURE
                        ]}
                        familierelasjonKodeverk={familierelasjonKodeverk}
                        personRelatert={personRelatert}
                        person={person}
                        valgteFamilieRelasjoner={valgteFamilieRelasjoner}
                        onAbroadPersonAddedFailure={() => dispatch({ type: types.SAK_ABROADPERSON_ADD_FAILURE })}
                        onAbroadPersonAddedSuccess={(relation: FamilieRelasjon) => {
                          dispatch(sakActions.addFamilierelasjoner(relation))
                          dispatch({ type: types.SAK_ABROADPERSON_ADD_SUCCESS })
                        }}
                        onRelationAdded={(relation: FamilieRelasjon) => {
                          /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
                          dispatch(
                            sakActions.addFamilierelasjoner({
                              ...relation,
                              nasjonalitet: 'NO'
                            })
                          )
                        }}
                        onRelationRemoved={(relation: FamilieRelasjon) => dispatch(sakActions.removeFamilierelasjoner(relation))}
                        onRelationReset={() => dispatch(sakActions.resetPersonRelatert())}
                        onTPSPersonAddedFailure={() => dispatch({ type: types.SAK_TPSPERSON_ADD_FAILURE })}
                        onTPSPersonAddedSuccess={(relation: FamilieRelasjon) => {
                          dispatch(sakActions.addFamilierelasjoner(relation))
                          dispatch({ type: types.SAK_TPSPERSON_ADD_SUCCESS })
                        }}
                        onAlertClose={() => dispatch(clientClear())}
                        onSearchFnr={(fnrQuery: string) => {
                          dispatch(sakActions.resetPersonRelatert())
                          dispatch(sakActions.getPersonRelated(fnrQuery))
                        }}
                      />
                    </FamilyPanel>
                    <VerticalSeparatorDiv />
                  </Column>
                )}
              </Row>
              {valgtSektor && (
                <Row>
                  <Column
                    className={classNames('slideAnimate', { feil: !!_validation.tema })}
                  >
                    <Select
                      data-test-id='opprettsak__tema'
                      feil={_validation.tema ? _validation.tema.feilmelding : undefined}
                      id='opprettsak__tema'
                      label={t('ui:label-tema')}
                      onChange={onTemaChange}
                      value={valgtTema}
                    >
                      <option value=''>
                        {t('ui:form-choose')}
                      </option>)
                      {temaer && temaer.map((k: Kodeverk) => (
                        <option value={k.kode} key={k.kode}>
                          {k.term}
                        </option>
                      ))}
                    </Select>
                    <VerticalSeparatorDiv />
                  </Column>
                  <HorizontalSeparatorDiv />
                  <AlignCenterColumn>
                    <Knapp
                      onClick={onViewFagsakerClick}
                      disabled={!isSomething(valgtTema)}
                    >
                      {t('ui:form-seeCases')}
                    </Knapp>
                    <VerticalSeparatorDiv />
                  </AlignCenterColumn>
                </Row>
              )}
              {(fagsaker === null || (fagsaker !== undefined && _.isEmpty(fagsaker))) && (
                <Row>
                  <AlertStripe type='advarsel'>
                    {t('ui:error-fagsak-notFound')}
                    {serverInfo && (
                      <Lenke
                        href={serverInfo?.gosysURL}
                        ariaLabel={t('ui:form-createNewCaseInGosys')}
                        target='_blank'
                      >
                        {t('ui:form-createNewCaseInGosys')}
                      </Lenke>
                    )}
                    <VerticalSeparatorDiv />
                  </AlertStripe>
                  <VerticalSeparatorDiv />
                </Row>
              )}
              {visFagsakerListe && (
                <Row>
                  <Column>
                    <Select
                      data-test-id='opprettsak__fagsaker'
                      feil={_validation.saksId ? _validation.saksId.feilmelding : undefined}
                      id='opprettsak__fagsaker'
                      label={t('ui:label-fagsak')}
                      onChange={onSakIDChange}
                      value={valgtSaksId}
                    >
                      <option value=''>
                        {t('ui:form-choose')}
                      </option>
                      {fagsaker &&
                        _.orderBy(fagsaker, 'fagsakNr').map((f: FagSak) => (
                          <option value={f.saksID} key={f.saksID}>
                            {f.fagsakNr || f.saksID}
                          </option>
                        ))}
                    </Select>
                    <VerticalSeparatorDiv />
                  </Column>
                  <Column />
                </Row>
              )}
              {visArbeidsforhold && (
                <Arbeidsforhold
                  getArbeidsforholdList={() => dispatch(sakActions.getArbeidsforholdList(person?.fnr))}
                  valgteArbeidsforhold={valgteArbeidsforhold}
                  arbeidsforholdList={arbeidsforholdList}
                  onArbeidsforholdClick={(a: Arbeidsforholdet, checked: boolean) => dispatch(
                    checked
                      ? sakActions.addArbeidsforhold(a)
                      : sakActions.removeArbeidsforhold(a)
                  )}
                />
              )}
              <VerticalSeparatorDiv />
              <Row
                className='slideAnimate'
                style={{ animationDelay: '0.9s' }}
              >
                <Hovedknapp
                  disabled={sendingSak}
                  onClick={skjemaSubmit}
                  spinner={sendingSak}
                >
                  {t('ui:form-createCaseInRina')}
                </Hovedknapp>
                <HorizontalSeparatorDiv />
                <Flatknapp
                  aria-label='Navigasjonslink tilbake til forsiden'
                  onClick={openModal}
                >
                  {t('ui:form-resetForm')}
                </Flatknapp>
              </Row>
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
              {opprettetSak && opprettetSak.url && (
                <Row>
                  <Column>
                    <VerticalSeparatorDiv />
                    <AlertStripe type='suksess'>
                      <FlexDiv>
                        <span>
                          {t('ui:form-caseNumber') + ': ' + opprettetSak.rinasaksnummer}
                        </span>
                        <HorizontalSeparatorDiv data-size='0.25' />
                        <span>
                          {t('ui:label-is-created')}.
                        </span>
                        <HorizontalSeparatorDiv data-size='0.25' />
                        {opprettetSak.url && (
                          <Lenke
                            className='vedlegg__lenke'
                            href={opprettetSak.url}
                            target='_blank'
                          >
                            {t('ui:form-goToRina')}
                          </Lenke>
                        )}
                      </FlexDiv>
                      <div>
                        {opprettetSak.rinasaksnummer && (
                          <Link
                            to={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer}
                          >
                            {t('ui:label-add-as-attachment-to-sed')}
                          </Link>
                        )}
                      </div>
                    </AlertStripe>
                  </Column>
                  <Column />
                </Row>
              )}
              <AbortModal
                onAbort={onAbort}
                isOpen={_visModal}
                closeModal={closeModal}
              />
            </>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

OpprettSak.propTypes = {
  history: PT.any.isRequired
}

export default OpprettSak
