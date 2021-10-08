import * as appActions from 'actions/app'
import * as sakActions from 'actions/sak'
import Family from 'applications/OpprettSak/Family/Family'
import PersonSearch from 'applications/OpprettSak/PersonSearch/PersonSearch'
import classNames from 'classnames'
import AbortModal from 'components/AbortModal/AbortModal'
import Arbeidsgivere from 'components/Arbeidsgiver/Arbeidsgivere'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import { PeriodeMedForsikring } from 'declarations/sed'
import {
  Arbeidsgiver,
  Arbeidsperioder,
  BucTyper,
  Enhet,
  Enheter,
  FagSak,
  FagSaker,
  Institusjon,
  Kodemaps,
  Kodeverk,
  OldFamilieRelasjon,
  OpprettetSak,
  Person,
  ServerInfo,
  Tema
} from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import { History } from 'history'
import useValidation from 'hooks/useValidation'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Feiloppsummering, FeiloppsummeringFeil, Select } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastKnapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  Margin,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { periodeMedForsikringToArbeidsgiver } from 'utils/arbeidsgiver'
import { validateOpprettSak, ValidationOpprettSakProps } from './validationOpprettSak'

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
  gettingFagsaker: boolean
  gettingPerson: boolean
  gettingArbeidsperioder: boolean

  arbeidsperioder: Arbeidsperioder | null | undefined
  buctyper: BucTyper | undefined
  fagsaker: FagSaker | undefined | null
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  kodemaps: Kodemaps | undefined
  institusjoner: Array<Institusjon> | undefined
  landkoder: Array<Kodeverk> | undefined
  opprettetSak: OpprettetSak | undefined
  person: Person | null | undefined
  personRelatert: Person | null | undefined
  sedtyper: Array<Kodeverk> | undefined
  sektor: Array<Kodeverk> | undefined
  tema: Tema | undefined

  valgteArbeidsgivere: Array<Arbeidsgiver>
  valgtBucType: string | undefined
  valgteFamilieRelasjoner: Array<OldFamilieRelasjon>
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
  gettingFagsaker: state.loading.gettingFagsaker,
  gettingPerson: state.loading.gettingPerson,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,

  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,

  valgteArbeidsgivere: state.sak.arbeidsgivere,
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
    gettingFagsaker,
    gettingPerson,
    enheter,
    serverInfo,
    sendingSak,
    arbeidsperioder,
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
    valgteArbeidsgivere,
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

  const namespace = 'opprettsak'
  const [_visModal, setVisModal] = useState<boolean>(false)
  const [_isFnrValid, setIsFnrValid] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationOpprettSakProps>({}, validateOpprettSak)

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
  const visArbeidsgivere: boolean = EKV.Koder.sektor.FB === valgtSektor &&
    EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && isSomething(valgtSedType)
  const visEnheter: boolean = valgtSektor === 'HZ' || valgtSektor === 'SI'

  const skjemaSubmit = (): void => {
    const valid: boolean = performValidation({
      fnr: valgtFnr,
      isFnrValid: _isFnrValid,
      sektor: valgtSektor,
      buctype: valgtBucType,
      sedtype: valgtSedType,
      landkode: valgtLandkode,
      institusjon: valgtInstitusjon,
      namespace: namespace,
      tema: valgtTema,
      saksId: valgtSaksId,
      visEnheter: visEnheter,
      unit: valgtUnit
    } as ValidationOpprettSakProps)

    if (valid) {
      dispatch(sakActions.createSak({
        buctype: valgtBucType,
        fnr: valgtFnr,
        landKode: valgtLandkode,
        institusjonsID: valgtInstitusjon,
        saksID: valgtSaksId,
        sedtype: valgtSedType,
        sektor: valgtSektor,
        tema: valgtTema,
        familierelasjoner: valgteFamilieRelasjoner,
        arbeidsgivere: valgteArbeidsgivere,
        enhet: valgtUnit
      }))
    }
  }

  const openModal = (): void => {
    setVisModal(true)
  }

  const closeModal = (): void => {
    setVisModal(false)
  }

  const onAbort = (): void => {
    dispatch(sakActions.cleanData())
    dispatch(appActions.cleanData())
    history.push('/')
  }

  const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    _resetValidation(namespace + '-unit')
    dispatch(sakActions.setProperty('unit', e.target.value))
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    _resetValidation(namespace + '-sektor')
    dispatch(sakActions.setProperty('unit', undefined))
    dispatch(sakActions.setProperty('sektor', e.target.value))
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const buctype = event.target.value
    _resetValidation(namespace + '-buctype')
    _resetValidation(namespace + '-landkode')
    dispatch(sakActions.setProperty('landkode', undefined))
    dispatch(sakActions.setProperty('sedtype', undefined))
    dispatch(sakActions.setProperty('institution', undefined))
    dispatch(sakActions.setProperty('buctype', buctype))
    dispatch(sakActions.getLandkoder(buctype))
  }

  const onSedtypeSet = (e: string): void => {
    _resetValidation(namespace + '-sedtype')
    dispatch(sakActions.setProperty('sedtype', e))
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSedtypeSet(e.target.value)
  }

  const onLandkodeChange = (country: Country): void => {
    _resetValidation(namespace + '-landkode')
    _resetValidation(namespace + '-institusjon')
    const landKode = country.value
    dispatch(sakActions.setProperty('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    _resetValidation(namespace + '-institusjon')
    dispatch(sakActions.setProperty('institusjon', event.target.value))
  }

  const onTemaChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    _resetValidation(namespace + '-tema')
    _resetValidation(namespace + '-saksId')
    dispatch(sakActions.setProperty('tema', event.target.value))
    dispatch(sakActions.resetFagsaker())
    dispatch(sakActions.setProperty('saksId', ''))
  }

  const onViewFagsakerClick = (): void => {
    dispatch(sakActions.getFagsaker(person?.fnr, valgtSektor, valgtTema))
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    _resetValidation(namespace + '-saksId')
    dispatch(sakActions.setProperty('saksId', event.target.value))
  }

  const isValid: boolean = _.find(_.values(_validation), (e) => e !== undefined) === undefined

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <Systemtittel>
            {t('label:opprett-sak')}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <PersonSearch
            alertMessage={alertMessage}
            alertType={alertType}
            alertTypesWatched={[types.SAK_PERSON_GET_FAILURE]}
            className='slideInFromLeft'
            data-test-id={namespace + '-fnr'}
            feil={_validation[namespace + '-fnr']?.feilmelding}
            gettingPerson={gettingPerson}
            id={namespace + '-fnr'}
            initialFnr=''
            onFnrChange={() => {
              setIsFnrValid(false)
              dispatch(sakActions.cleanData())
              dispatch(appActions.cleanData())
            }}
            onPersonFound={() => setIsFnrValid(true)}
            onSearchPerformed={(fnr: string) => {
              dispatch(sakActions.setProperty('fnr', fnr))
              dispatch(sakActions.cleanData())
              dispatch(sakActions.getPerson(fnr))
            }}
            onPersonRemoved={() => dispatch(sakActions.resetPerson())}
            person={person}
            resetAllValidation={() => _resetValidation()}
          />
          {isSomething(person) && (
            <>
              <Row>
                <Column
                  className='slideInFromLeft'
                  style={{ animationDelay: '0s' }}
                >
                  <Select
                    data-test-id={namespace + '-sektor'}
                    feil={_validation[namespace + '-sektor']?.feilmelding}
                    id={namespace + '-sektor'}
                    label={t('label:sektor')}
                    onChange={onSektorChange}
                    value={valgtSektor}
                  >
                    <option value=''>
                      {t('label:velg')}
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
                  className='slideInFromLeft'
                  style={{ animationDelay: '0.15s' }}
                >
                  {visEnheter && (
                    <Select
                      data-test-id={namespace + '-unit'}
                      feil={_validation[namespace + '-unit']?.feilmelding}
                      id={namespace + '-unit'}
                      label={t('label:enhet')}
                      onChange={onUnitChange}
                      value={valgtUnit}
                    >
                      <option value=''>
                        {t('label:velg')}
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
                  className='slideInFromLeft'
                  style={{ animationDelay: '0.3s' }}
                >
                  <Select
                    data-test-id={namespace + '-buctype'}
                    disabled={!isSomething(valgtSektor)}
                    feil={_validation[namespace + '-buctype']?.feilmelding}
                    id={namespace + '-buctype'}
                    label={t('label:buc')}
                    onChange={onBuctypeChange}
                    value={valgtBucType}
                  >
                    <option value=''>
                      {t('label:velg')}
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
                  className='slideInFromLeft'
                  style={{ animationDelay: '0.45s' }}
                >
                  <Select
                    data-test-id={namespace + '-sedtype'}
                    disabled={!isSomething(valgtBucType) || !isSomething(valgtSektor)}
                    feil={_validation[namespace + '-sedtype']?.feilmelding}
                    id={namespace + '-sedtype'}
                    label={t('label:sed')}
                    onChange={onSedtypeChange}
                    value={valgtSedType}
                  >
                    <option value=''>
                      {t('label:velg')}
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
                  className='slideInFromLeft'
                  style={{ animationDelay: '0.6s' }}
                >
                  <CountrySelect
                    closeMenuOnSelect
                    data-test-id={namespace + '-landkode'}
                    error={_validation[namespace + '-landkode']?.feilmelding}
                    id={namespace + '-landkode'}
                    includeList={landkoder ? _.orderBy(landkoder, 'term').map((k: Kodeverk) => k.kode) : []}
                    label={t('label:land')}
                    lang='nb'
                    disabled={_.isEmpty(valgtBucType)}
                    menuPortalTarget={document.body}
                    onOptionSelected={onLandkodeChange}
                    placeholder={t('label:velg')}
                    flagWave
                    value={valgtLandkode}
                  />
                  <VerticalSeparatorDiv />
                </Column>
                <HorizontalSeparatorDiv />
                <Column
                  className='slideInFromLeft'
                  style={{ animationDelay: '0.75s' }}
                >
                  <Select
                    data-test-id={namespace + '-institusjon'}
                    key={namespace + '-institusjon-' + valgtInstitusjon}
                    disabled={!isSomething(valgtLandkode)}
                    feil={_validation[namespace + '-institusjon']?.feilmelding}
                    id={namespace + '-institusjon'}
                    label={t('label:mottaker-institusjon')}
                    onChange={onInstitusjonChange}
                    value={valgtInstitusjon}
                  >
                    <option value=''>
                      {t('label:velg')}
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
                  <Column className='slideInFromLeft'>
                    <Systemtittel>
                      {t('label:familierelasjon')}
                    </Systemtittel>
                    <VerticalSeparatorDiv />
                    <HighContrastPanel border>
                      <Family
                        alertStatus={alertStatus}
                        alertMessage={alertMessage}
                        alertType={alertType}
                        abroadPersonFormAlertTypesWatched={[
                          types.SAK_ABROADPERSON_ADD_FAILURE
                        ]}
                        TPSPersonFormAlertTypesWatched={[
                          types.SAK_PERSON_RELATERT_SEARCH_FAILURE,
                          types.SAK_TPSPERSON_ADD_FAILURE
                        ]}
                        familierelasjonKodeverk={familierelasjonKodeverk}
                        personRelatert={personRelatert}
                        person={person}
                        valgteFamilieRelasjoner={valgteFamilieRelasjoner}
                        onAbroadPersonAddedFailure={() => dispatch({ type: types.SAK_ABROADPERSON_ADD_FAILURE })}
                        onAbroadPersonAddedSuccess={(relation: OldFamilieRelasjon) => {
                          dispatch(sakActions.addFamilierelasjoner(relation))
                          dispatch({ type: types.SAK_ABROADPERSON_ADD_SUCCESS })
                        }}
                        onRelationAdded={(relation: OldFamilieRelasjon) => {
                          /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
                          dispatch(
                            sakActions.addFamilierelasjoner({
                              ...relation,
                              nasjonalitet: 'NO'
                            })
                          )
                        }}
                        onRelationRemoved={(relation: OldFamilieRelasjon) => dispatch(sakActions.removeFamilierelasjoner(relation))}
                        onRelationReset={() => dispatch(sakActions.resetPersonRelatert())}
                        onTPSPersonAddedFailure={() => dispatch({ type: types.SAK_TPSPERSON_ADD_FAILURE })}
                        onTPSPersonAddedSuccess={(relation: OldFamilieRelasjon) => {
                          dispatch(sakActions.addFamilierelasjoner(relation))
                          dispatch({ type: types.SAK_TPSPERSON_ADD_SUCCESS })
                        }}
                        onSearchFnr={(fnrQuery: string) => {
                          dispatch(sakActions.resetPersonRelatert())
                          dispatch(sakActions.getPersonRelated(fnrQuery))
                        }}
                      />
                    </HighContrastPanel>
                    <VerticalSeparatorDiv />
                  </Column>
                )}
              </Row>
              {valgtSektor && (
                <AlignStartRow>
                  <Column
                    className={classNames('slideInFromLeft', { feil: !!_validation.tema })}
                  >
                    <Select
                      data-test-id={namespace + '-tema'}
                      feil={_validation[namespace + '-tema']?.feilmelding}
                      id={namespace + '-tema'}
                      label={t('label:velg-tema')}
                      onChange={onTemaChange}
                      value={valgtTema}
                    >
                      <option value=''>
                        {t('label:velg')}
                      </option>)
                      {temaer && temaer.map((k: Kodeverk) => (
                        <option value={k.kode} key={k.kode}>
                          {k.term}
                        </option>
                      ))}
                    </Select>
                    <VerticalSeparatorDiv />
                  </Column>
                  <Column>
                    <PileDiv>
                      <VerticalSeparatorDiv size='2' />
                      <FlexDiv>
                        <HighContrastKnapp
                          onClick={onViewFagsakerClick}
                          spinner={gettingFagsaker}
                          disabled={gettingFagsaker || !isSomething(valgtTema)}
                        >
                          {gettingFagsaker ? t('message:loading-saker') : t('label:vis-saker')}
                        </HighContrastKnapp>
                      </FlexDiv>
                    </PileDiv>
                  </Column>
                </AlignStartRow>
              )}
              {(fagsaker === null || (fagsaker !== undefined && _.isEmpty(fagsaker))) && (
                <Row>
                  <AlertStripe type='advarsel'>
                    {t('message:error-fagsak-notFound')}
                    {serverInfo && (
                      <Lenke
                        href={serverInfo?.gosysURL}
                        ariaLabel={t('label:lenke-til-gosys')}
                        target='_blank'
                      >
                        {t('label:lenke-til-gosys')}
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
                      data-test-id={namespace + '-saksId'}
                      feil={_validation[namespace + '-saksId']?.feilmelding}
                      id={namespace + '-saksId'}
                      label={t('label:velg-fagsak')}
                      onChange={onSakIDChange}
                      value={valgtSaksId}
                    >
                      <option value=''>
                        {t('label:velg')}
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
              {visArbeidsgivere && (
                <Arbeidsgivere
                  namespace='arbeidsgivere'
                  searchable
                  fnr={person?.fnr}
                  valgteArbeidsgivere={valgteArbeidsgivere}
                  arbeidsperioder={arbeidsperioder}
                  onArbeidsgiverSelect={(a: PeriodeMedForsikring, checked: boolean) => dispatch(
                    checked
                      ? sakActions.addArbeidsgiver(periodeMedForsikringToArbeidsgiver(a))
                      : sakActions.removeArbeidsgiver(periodeMedForsikringToArbeidsgiver(a))
                  )}
                />
              )}
              <VerticalSeparatorDiv />
              <Row
                className='slideInFromLeft'
                style={{ animationDelay: '0.9s' }}
              >
                <HighContrastHovedknapp
                  disabled={sendingSak}
                  onClick={skjemaSubmit}
                  spinner={sendingSak}
                >
                  {t('label:opprett-sak-i-rina')}
                </HighContrastHovedknapp>
                <HorizontalSeparatorDiv />
                <HighContrastFlatknapp
                  aria-label='Navigasjonslink tilbake til forsiden'
                  onClick={openModal}
                >
                  {t('label:avslutt-utfylling')}
                </HighContrastFlatknapp>
              </Row>
              {!isValid && (
                <>
                  <VerticalSeparatorDiv size='2' />
                  <Row>
                    <Column>
                      <Feiloppsummering
                        data-test-id='opprettsak__feiloppsummering'
                        tittel={t('message:validation-feiloppsummering')}
                        feil={Object.values(_validation).filter(v => v !== undefined) as Array<FeiloppsummeringFeil>}
                      />
                    </Column>
                    <HorizontalSeparatorDiv size='2' />
                    <Column />
                  </Row>
                </>
              )}
            </>
          )}
          {opprettetSak && opprettetSak.url && (
            <Row>
              <Column>
                <VerticalSeparatorDiv />
                <AlertStripe type='suksess'>
                  <FlexDiv>
                    <span>
                      {t('label:saksnummer') + ': ' + opprettetSak.rinasaksnummer}
                    </span>
                    <HorizontalSeparatorDiv size='0.25' />
                    <span>
                      {t('label:er-opprettet')}.
                    </span>
                    <HorizontalSeparatorDiv size='0.25' />
                    {opprettetSak.url && (
                      <Lenke
                        className='vedlegg__lenke'
                        href={opprettetSak.url}
                        target='_blank'
                      >
                        {t('label:gå-til-rina')}
                      </Lenke>
                    )}
                  </FlexDiv>
                  <div>
                    {opprettetSak.rinasaksnummer && (
                      <Link
                        to={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer}
                      >
                        {t('label:legg-til-vedlegg-til-sed')}
                      </Link>
                    )}
                  </div>
                </AlertStripe>
              </Column>
              <Column />
            </Row>
          )}
          <AbortModal
            closeModal={closeModal}
            isOpen={_visModal}
            onAbort={onAbort}
          />
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
