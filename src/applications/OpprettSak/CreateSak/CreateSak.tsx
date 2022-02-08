import { ErrorFilled } from '@navikt/ds-icons'
import { Alert, Button, Heading, Link, Loader, Select } from '@navikt/ds-react'
import * as appActions from 'actions/app'
import { cleanPersons } from 'actions/person'
import * as personActions from 'actions/person'
import * as sakActions from 'actions/sak'
import { cleanData, resetSentSed } from 'actions/sak'
import { setReplySed } from 'actions/svarsed'
import { resetAllValidation, resetValidation } from 'actions/validation'
import Family from 'applications/OpprettSak/Family/Family'
import PersonSearch from 'applications/OpprettSak/PersonSearch/PersonSearch'
import Arbeidsgivere from 'components/Arbeidsgiver/Arbeidsgivere'
import * as types from 'constants/actionTypes'
import { FeatureToggles } from 'declarations/app'
import { AlertVariant } from 'declarations/components'
import { State } from 'declarations/reducers'
import { H001Sed, PeriodeMedForsikring, ReplySed } from 'declarations/sed'
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
  Tema,
  Validation
} from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import useGlobalValidation from 'hooks/useGlobalValidation'
import { Country } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FlexDiv,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  Margin,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link as DOMLink } from 'react-router-dom'
import { periodeMedForsikringToArbeidsgiver } from 'utils/arbeidsgiver'
import { validateOpprettSak, ValidationOpprettSakProps } from './validation'
import h001template from 'mocks/seds/h001template.json'
import styled from 'styled-components'

export interface CreateSakSelector {
  alertVariant: AlertVariant | undefined
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined

  enheter: Enheter | undefined
  serverInfo: ServerInfo | undefined

  sendingSak: boolean
  gettingFagsaker: boolean
  searchingPerson: boolean
  searchingRelatertPerson: boolean
  gettingArbeidsperioder: boolean
  gettingInstitusjoner: boolean

  arbeidsperioder: Arbeidsperioder | null | undefined
  buctyper: BucTyper | undefined
  fagsaker: FagSaker | undefined | null
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  featureToggles: FeatureToggles
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

  validation: Validation
}

const mapState = (state: State): CreateSakSelector => ({
  alertVariant: state.alert.stripeStatus as AlertVariant,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,

  enheter: state.app.enheter,
  serverInfo: state.app.serverinfo,
  buctyper: state.app.buctyper,
  familierelasjonKodeverk: state.app.familierelasjoner,
  featureToggles: state.app.featureToggles,
  kodemaps: state.app.kodemaps,
  landkoder: state.app.landkoder,
  sedtyper: state.app.sedtyper,
  sektor: state.app.sektor,
  tema: state.app.tema,

  sendingSak: state.loading.sendingSak,
  gettingFagsaker: state.loading.gettingFagsaker,
  searchingPerson: state.loading.searchingPerson,
  searchingRelatertPerson: state.loading.searchingRelatertPerson,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  gettingInstitusjoner: state.loading.gettingInstitusjoner,

  arbeidsperioder: state.arbeidsgiver.arbeidsperioder,

  person: state.person.person,
  personRelatert: state.person.personRelatert,

  valgteArbeidsgivere: state.sak.arbeidsgivere,
  valgtBucType: state.sak.buctype,
  valgteFamilieRelasjoner: state.sak.familierelasjoner,
  fagsaker: state.sak.fagsaker,
  valgtFnr: state.sak.fnr,
  valgtInstitusjon: state.sak.institusjon,
  institusjoner: state.sak.institusjonList,
  valgtLandkode: state.sak.landkode,
  opprettetSak: state.sak.opprettetSak,
  valgtSaksId: state.sak.saksId,
  valgtSedType: state.sak.sedtype,
  valgtSektor: state.sak.sektor,
  valgtTema: state.sak.tema,
  valgtUnit: state.sak.unit,

  validation: state.validation.status
})

export interface CreateSakProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
}

export const MyContent = styled(Content)`
  @media (min-width: 768px) {
   min-width: 800px;
   maxWidth: 1000px;
 }
  align-items: center;
`

const CreateSak: React.FC<CreateSakProps> = ({
  changeMode
}: CreateSakProps): JSX.Element => {
  const {
    alertVariant,
    alertMessage,
    alertType,
    gettingFagsaker,
    gettingInstitusjoner,
    searchingPerson,
    searchingRelatertPerson,
    enheter,
    serverInfo,
    sendingSak,
    arbeidsperioder,
    buctyper,
    fagsaker,
    familierelasjonKodeverk,
    featureToggles,
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
    valgtUnit,

    validation
  }: CreateSakSelector = useSelector<State, CreateSakSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const namespace = 'opprettsak'
  const [isFnrValid, setIsFnrValid] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationOpprettSakProps>(validateOpprettSak)

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !valgtSektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[valgtSektor] as keyof Tema]
  const _buctyper: Array<Kodeverk> = !kodemaps ? [] : !valgtSektor ? [] : !buctyper ? [] : buctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor] as keyof BucTyper]
  let _sedtyper: Array<Kodeverk | string> = !kodemaps ? [] : !valgtSektor ? [] : !valgtBucType ? [] : kodemaps.BUC2SEDS[valgtSektor][valgtBucType]
  const visFagsakerListe: boolean = !_.isEmpty(valgtSektor) && !_.isEmpty(tema) && !_.isEmpty(fagsaker)
  const visArbeidsgivere: boolean = EKV.Koder.sektor.FB === valgtSektor &&
    EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && !_.isEmpty(valgtSedType)
  const visEnheter: boolean = valgtSektor === 'HZ' || valgtSektor === 'SI'

  const [tempInfoForEdit, setTempInfoForEdit] = useState<any>(undefined)

  _sedtyper = _sedtyper.reduce((acc: any, curr: any) => {
    const kode = sedtyper?.find((elem: any) => elem.kode === curr)
    acc.push(kode)
    return acc
  }, [])

  const skjemaSubmit = (): void => {
    const valid: boolean = performValidation({
      fnr: valgtFnr,
      isFnrValid: isFnrValid,
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
      setTempInfoForEdit({
        person: _.cloneDeep(person),
        tema: valgtTema,
        fagsak: valgtSaksId
      })
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

  const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('unit', e.target.value))
    if (validation[namespace + '-unit']) {
      dispatch(resetValidation(namespace + '-unit'))
    }
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('unit', undefined))
    dispatch(sakActions.setProperty('sektor', e.target.value))
    if (validation[namespace + '-sektor']) {
      dispatch(resetValidation(namespace + '-sektor'))
    }
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const buctype = event.target.value
    dispatch(sakActions.setProperty('landkode', undefined))
    dispatch(sakActions.setProperty('sedtype', undefined))
    dispatch(sakActions.setProperty('institution', undefined))
    dispatch(sakActions.setProperty('buctype', buctype))
    dispatch(sakActions.getLandkoder(buctype))
    if (validation[namespace + '-buctype']) {
      dispatch(resetValidation(namespace + '-buctype'))
    }
    if (validation[namespace + '-landkode']) {
      dispatch(resetValidation(namespace + '-landkode'))
    }
  }

  const onSedtypeSet = (e: string): void => {
    dispatch(sakActions.setProperty('sedtype', e))
    if (validation[namespace + '-sedtype']) {
      dispatch(resetValidation(namespace + '-sedtype'))
    }
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSedtypeSet(e.target.value)
  }

  const onLandkodeChange = (country: Country): void => {
    const landKode = country.value
    dispatch(sakActions.setProperty('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
    if (validation[namespace + '-landkode']) {
      dispatch(resetValidation(namespace + '-landkode'))
    }
    if (validation[namespace + '-institusjon']) {
      dispatch(resetValidation(namespace + '-institusjon'))
    }
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('institusjon', event.target.value))
    if (validation[namespace + '-institusjon']) {
      dispatch(resetValidation(namespace + '-institusjon'))
    }
  }

  const onTemaChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('tema', event.target.value))
    dispatch(sakActions.resetFagsaker())
    dispatch(sakActions.setProperty('saksId', ''))
    if (validation[namespace + '-tema']) {
      dispatch(resetValidation(namespace + '-tema'))
    }
    if (validation[namespace + '-saksId']) {
      dispatch(resetValidation(namespace + '-saksId'))
    }
  }

  const onViewFagsakerClick = (): void => {
    dispatch(sakActions.getFagsaker(person?.fnr, valgtSektor, valgtTema))
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('saksId', event.target.value))
    if (validation[namespace + '-saksId']) {
      dispatch(resetValidation(namespace + '-saksId'))
    }
  }

  const createH001ReplySed = (saksnummer: string): ReplySed => {
    const h001sed: H001Sed = _.cloneDeep(h001template) as H001Sed
    h001sed.saksnummer = saksnummer
    h001sed.tema = tempInfoForEdit.tema
    h001sed.fagsakId = tempInfoForEdit.fagsak
    h001sed.bruker.personInfo.fornavn = tempInfoForEdit.person.fornavn
    h001sed.bruker.personInfo.etternavn = tempInfoForEdit.person.etternavn
    h001sed.bruker.personInfo.kjoenn = tempInfoForEdit.person.kjoenn
    h001sed.bruker.personInfo.foedselsdato = tempInfoForEdit.person.fdato
    h001sed.bruker.personInfo.statsborgerskap = [{ land: 'NO' }]
    h001sed.bruker.personInfo.pin = [{
      land: 'NO',
      identifikator: tempInfoForEdit.person.fnr
    }]
    return h001sed
  }

  const fillOutSed = (opprettetSak: OpprettetSak) => {
    const replySed = createH001ReplySed(opprettetSak.rinasaksnummer)
    replySed.sedId = '' + new Date().getTime()
    dispatch(setReplySed(replySed))
    changeMode('B', 'forward')
  }

  return (
    <Container>
      <Margin />
      <MyContent>
        <PersonSearch
          key={namespace + '-fnr-' + valgtFnr}
          alertMessage={alertMessage}
          alertType={alertType}
          alertTypesWatched={[types.PERSON_SEARCH_FAILURE]}
          className='slideInFromLeft'
          data-test-id={namespace + '-fnr'}
          error={validation[namespace + '-fnr']?.feilmelding}
          searchingPerson={searchingPerson}
          id={namespace + '-fnr'}
          initialFnr=''
          value={valgtFnr}
          parentNamespace={namespace}
          onFnrChange={() => {
            if (isFnrValid) {
              setIsFnrValid(false)
              dispatch(appActions.cleanData()) // cleans person and sak reducer
              dispatch(resetAllValidation())
            }
          }}
          onPersonFound={() => setIsFnrValid(true)}
          onSearchPerformed={(fnr: string) => {
            dispatch(sakActions.cleanData())
            dispatch(sakActions.setProperty('fnr', fnr))
            dispatch(personActions.searchPerson(fnr))
          }}
          onPersonRemoved={() => {
            dispatch(personActions.resetPerson())
            dispatch(resetAllValidation())
          }}
          person={person}
        />
        <VerticalSeparatorDiv size='2' />
        {!_.isEmpty(person) && (
          <>
            <Row className='slideInFromLeft' style={{ animationDelay: '0s' }}>
              <Column>
                <Select
                  data-test-id={namespace + '-sektor'}
                  error={validation[namespace + '-sektor']?.feilmelding}
                  id={namespace + '-sektor'}
                  label={t('label:sektor')}
                  onChange={onSektorChange}
                  value={valgtSektor ?? ''}
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
              <Column>
                {visEnheter && (
                  <Select
                    data-test-id={namespace + '-unit'}
                    error={validation[namespace + '-unit']?.feilmelding}
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
            <VerticalSeparatorDiv />
            <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                <Select
                  data-test-id={namespace + '-buctype'}
                  disabled={!!_.isEmpty(valgtSektor)}
                  error={validation[namespace + '-buctype']?.feilmelding}
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
              <Column>
                <Select
                  data-test-id={namespace + '-sedtype'}
                  disabled={!!_.isEmpty(valgtBucType) || !!_.isEmpty(valgtSektor)}
                  error={validation[namespace + '-sedtype']?.feilmelding}
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
            <VerticalSeparatorDiv />
            <Row className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
              <Column>
                <CountrySelect
                  closeMenuOnSelect
                  data-test-id={namespace + '-landkode'}
                  error={validation[namespace + '-landkode']?.feilmelding}
                  id={namespace + '-landkode'}
                  includeList={landkoder ? _.orderBy(landkoder, 'term').map((k: Kodeverk) => k.kode) : []}
                  label={t('label:land')}
                  lang='nb'
                  disabled={_.isEmpty(valgtBucType)}
                  menuPortalTarget={document.body}
                  onOptionSelected={onLandkodeChange}
                  flagWave
                  value={valgtLandkode}
                />
                <VerticalSeparatorDiv />
              </Column>
              <Column>
                <FlexCenterDiv>
                  <Select
                    data-test-id={namespace + '-institusjon'}
                    key={namespace + '-institusjon-' + valgtInstitusjon}
                    disabled={!!_.isEmpty(valgtLandkode) || gettingInstitusjoner}
                    error={validation[namespace + '-institusjon']?.feilmelding}
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
                  <HorizontalSeparatorDiv size='0.5' />
                  {gettingInstitusjoner && <Loader />}
                </FlexCenterDiv>
                <VerticalSeparatorDiv />
              </Column>
            </Row>
            <VerticalSeparatorDiv />
            {valgtSektor === 'FB' && (
              <>
                <VerticalSeparatorDiv />
                <Heading size='medium'>
                  {t('label:familierelasjon')}
                </Heading>
                <VerticalSeparatorDiv />
                <Family
                  alertVariant={alertVariant}
                  alertMessage={alertMessage}
                  alertType={alertType}
                  abroadPersonFormAlertTypesWatched={[
                    types.SAK_ABROADPERSON_ADD_FAILURE
                  ]}
                  TPSPersonFormAlertTypesWatched={[
                    types.PERSON_RELATERT_SEARCH_FAILURE,
                    types.SAK_TPSPERSON_ADD_FAILURE
                  ]}
                  familierelasjonKodeverk={familierelasjonKodeverk}
                  personRelatert={personRelatert}
                  searchingRelatertPerson={searchingRelatertPerson}
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
                  onRelationReset={() => dispatch(personActions.resetPersonRelated())}
                  onTPSPersonAddedFailure={() => dispatch({ type: types.SAK_TPSPERSON_ADD_FAILURE })}
                  onTPSPersonAddedSuccess={(relation: OldFamilieRelasjon) => {
                    dispatch(sakActions.addFamilierelasjoner(relation))
                    dispatch({ type: types.SAK_TPSPERSON_ADD_SUCCESS })
                  }}
                  onSearchFnr={(fnrQuery: string) => {
                    dispatch(personActions.resetPersonRelated())
                    dispatch(personActions.searchPersonRelated(fnrQuery))
                  }}
                />
              </>
            )}
            <VerticalSeparatorDiv />
            {valgtSektor && (
              <AlignStartRow classname='slideInFromLeft'>
                <Column>
                  <FlexDiv>
                    <div style={{ flex: 3 }}>
                      <Select
                        data-test-id={namespace + '-tema'}
                        error={validation[namespace + '-tema']?.feilmelding}
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
                    </div>
                    <HorizontalSeparatorDiv />
                    <PileDiv>
                      <VerticalSeparatorDiv size='2' />
                      <FlexDiv>
                        <Button
                          variant='secondary'
                          onClick={onViewFagsakerClick}
                          disabled={gettingFagsaker || !!_.isEmpty(valgtTema)}
                        >
                          {gettingFagsaker && <Loader />}
                          {gettingFagsaker ? t('message:loading-saker') : t('label:vis-saker')}
                        </Button>
                      </FlexDiv>
                    </PileDiv>
                  </FlexDiv>
                  <VerticalSeparatorDiv />
                </Column>
                <Column>
                  {visFagsakerListe && (
                    <>
                      {(fagsaker === null || (fagsaker !== undefined && _.isEmpty(fagsaker))) && (
                        <Alert variant='warning'>
                          {t('message:error-fagsak-notFound')}
                          {serverInfo && (
                            <Link
                              href={serverInfo?.gosysURL}
                              aria-label={t('label:lenke-til-gosys')}
                              target='_blank' rel='noreferrer'
                            >
                              {t('label:lenke-til-gosys')}
                            </Link>
                          )}
                          <VerticalSeparatorDiv />
                        </Alert>
                      )}
                      <Select
                        data-test-id={namespace + '-saksId'}
                        error={validation[namespace + '-saksId']?.feilmelding}
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
                    </>
                  )}
                  <VerticalSeparatorDiv />
                </Column>
              </AlignStartRow>
            )}
            <VerticalSeparatorDiv size='2' />
            {visArbeidsgivere && (
              <Arbeidsgivere
                namespace={namespace + '-arbeidsgivere'}
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
            <Row className='slideInFromLeft'>
              <Column>
                <FlexDiv>
                  <Button
                    variant='primary'
                    disabled={sendingSak}
                    onClick={skjemaSubmit}
                  >
                    {sendingSak && <Loader />}
                    {t('label:opprett-sak-i-rina')}
                  </Button>
                  <HorizontalSeparatorDiv />
                  {featureToggles?.featureSvarsedH001 && (
                    <>
                      <Button
                        variant='secondary'
                        disabled={!(opprettetSak && valgtSedType === 'H001')}
                        onClick={() => fillOutSed(opprettetSak!)}
                      >
                        {t('el:button-fill-sed')}
                      </Button>
                      <HorizontalSeparatorDiv />
                    </>
                  )}
                  <Button
                    variant='tertiary'
                    onClick={() => {
                      dispatch(cleanPersons())
                      dispatch(cleanData())
                    }}
                  >
                    {t('label:reset')}
                  </Button>
                </FlexDiv>
                <VerticalSeparatorDiv />
              </Column>
            </Row>
            <VerticalSeparatorDiv />
            <ValidationBox heading={t('validation:feiloppsummering')} validation={validation} />
          </>
        )}
        <VerticalSeparatorDiv />
        {opprettetSak && opprettetSak.url && (
          <>
            <Row>
              <Column>
                <Alert variant='success'>
                  <FlexDiv>
                    <FlexDiv>
                      <span>
                        {t('label:saksnummer') + ': ' + opprettetSak.rinasaksnummer + ' ' + t('label:er-opprettet')}.
                      </span>
                      <HorizontalSeparatorDiv />
                      {opprettetSak.url && (
                        <Link
                          className='vedlegg__lenke'
                          href={opprettetSak.url}
                          target='_blank' rel='noreferrer'
                        >
                          {t('label:gå-til-rina')}
                        </Link>
                      )}
                    </FlexDiv>
                    <HorizontalSeparatorDiv />
                    <div>
                      {opprettetSak.rinasaksnummer && (
                        <DOMLink
                          to={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer}
                        >
                          {t('label:legg-til-vedlegg-til-sed')}
                        </DOMLink>
                      )}
                    </div>
                    <HorizontalSeparatorDiv />
                    <div
                      style={{ cursor: 'pointer' }}
                      role='button'
                      tabIndex={0}
                      onKeyPress={() => dispatch(resetSentSed())} onClick={() => dispatch(resetSentSed())}
                    >
                      <ErrorFilled />
                    </div>
                  </FlexDiv>
                </Alert>
              </Column>
            </Row>
            <VerticalSeparatorDiv size='2' />
          </>
        )}
      </MyContent>
      <Margin />
    </Container>
  )
}

export default CreateSak
