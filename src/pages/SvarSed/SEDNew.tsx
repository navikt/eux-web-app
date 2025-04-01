import { Alert, BodyLong, Button, Heading, Loader, Select } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FlexCenterDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  Margin,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Country } from '@navikt/land-verktoy'
import * as appActions from 'actions/app'
import * as personActions from 'actions/person'
import { personReset } from 'actions/person'
import * as sakActions from 'actions/sak'
import {
  sakReset,
  editSed,
  resetFilloutInfo,
  resetSentSed,
  createFagsakGenerell,
  createFagsakDagpenger
} from 'actions/sak'
import {loadReplySed, resetSaks, setCurrentSak} from 'actions/svarsed'
import { resetValidation, setValidation } from 'actions/validation'
import PersonSearch from 'applications/OpprettSak/PersonSearch/PersonSearch'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import * as types from 'constants/actionTypes'
import { AlertVariant } from 'declarations/components'
import { State } from 'declarations/reducers'

import {
  AdressePDL,
  BucTyper, CountryCodeLists, CountryCodes,
  Enhet,
  Enheter,
  Fagsak,
  Fagsaker,
  Institusjon,
  Kodemaps,
  Kodeverk,
  OpprettetSak,
  PersonInfoPDL, PersonInfoUtland, PersonMedFamilie,
  Sak, Saks,
  Sed,
  ServerInfo,
  Tema,
  Validation
} from 'declarations/types'
import _, {cloneDeep} from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import performValidation from 'utils/performValidation'
import { validateSEDNew, ValidationSEDNewProps } from './sedNewValidation'
import {FeatureToggles} from "../../declarations/app";
import {getAllowed} from "utils/allowedFeatures";
import CountryDropdown from "../../components/CountryDropdown/CountryDropdown";
import PersonPanel from "../../applications/OpprettSak/PersonPanel/PersonPanel";
import FamilieRelasjoner from "../../applications/OpprettSak/FamilieRelasjoner/FamilieRelasjoner";
import {Statsborgerskap} from "../../declarations/sed";

export interface SEDNewSelector {
  alertVariant: AlertVariant | undefined
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined

  enheter: Enheter | null | undefined
  serverInfo: ServerInfo | undefined

  sendingSak: boolean
  gettingFagsaker: boolean
  creatingFagsak: boolean
  searchingPerson: boolean
  gettingInstitusjoner: boolean

  buctyper: BucTyper | undefined
  fagsaker: Fagsaker | undefined | null

  filloutinfo: any | null | undefined
  kodemaps: Kodemaps | undefined
  institusjoner: Array<Institusjon> | undefined
  landkoder: Array<string> | undefined
  opprettetSak: OpprettetSak | undefined

  personMedFamilie: PersonMedFamilie | null | undefined
  sedtyper: Array<Kodeverk> | undefined
  sektor: Array<Kodeverk> | undefined
  tema: Tema | undefined

  valgtBucType: string | undefined
  valgteFamilieRelasjonerPDL: Array<PersonInfoPDL>
  valgteFamilieRelasjonerUtland: Array<PersonInfoUtland>
  valgtFnr: string | undefined
  valgtInstitusjon: string | undefined
  valgtLandkode: string | undefined
  valgtSaksId: string | undefined
  valgtSedType: string | undefined
  valgtSektor: string | undefined
  valgtTema: string | undefined
  valgtUnit: string | undefined

  saks: Saks | null | undefined
  currentSak: Sak | undefined

  validation: Validation
  featureToggles: FeatureToggles | null | undefined,

  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): SEDNewSelector => ({
  alertVariant: state.alert.stripeStatus as AlertVariant,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,

  enheter: state.app.enheter,
  serverInfo: state.app.serverinfo,
  buctyper: state.app.buctyper,

  kodemaps: state.app.kodemaps,
  sedtyper: state.app.sedtyper,
  sektor: state.app.sektor,
  tema: state.app.tema,

  sendingSak: state.loading.sendingSak,
  gettingFagsaker: state.loading.gettingFagsaker,
  creatingFagsak: state.loading.creatingFagsak,
  searchingPerson: state.loading.searchingPerson,
  gettingInstitusjoner: state.loading.gettingInstitusjoner,

  personMedFamilie: state.person.personMedFamilie,

  valgtBucType: state.sak.buctype,
  valgteFamilieRelasjonerPDL: state.sak.familierelasjonerPDL,
  valgteFamilieRelasjonerUtland: state.sak.familierelasjonerUtland,

  fagsaker: state.sak.fagsaker,
  filloutinfo: state.sak.filloutinfo,
  valgtFnr: state.sak.fnr,
  valgtInstitusjon: state.sak.institusjon,
  institusjoner: state.sak.institusjonList,
  landkoder: state.sak.landkoder,
  valgtLandkode: state.sak.landkode,
  opprettetSak: state.sak.opprettetSak,
  valgtSaksId: state.sak.saksId,
  valgtSedType: state.sak.sedtype,
  valgtSektor: state.sak.sektor,
  valgtTema: state.sak.tema,
  valgtUnit: state.sak.unit,

  saks: state.svarsed.saks,
  currentSak: state.svarsed.currentSak,

  validation: state.validation.status,
  featureToggles: state.app.featureToggles,

  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

export const MyContent = styled(Content)`
  @media (min-width: 1280px) {
    div.personInfo {
      display: none;
    }
  };
  align-items: center;
`

export const PersonInfoContent = styled(Content)`
  @media (max-width: 1280px) {
    display: none;
  };
`

const SEDNew = (): JSX.Element => {
  const {

    alertMessage,
    alertType,
    gettingFagsaker,
    creatingFagsak,
    gettingInstitusjoner,
    searchingPerson,

    enheter,
    sendingSak,
    buctyper,
    fagsaker,

    filloutinfo,
    sedtyper,
    institusjoner,
    kodemaps,
    opprettetSak,

    personMedFamilie,

    sektor,
    tema,
    valgtBucType,
    valgteFamilieRelasjonerPDL,
    valgteFamilieRelasjonerUtland,
    valgtFnr,
    valgtInstitusjon,
    valgtLandkode,
    valgtSaksId,
    valgtSedType,
    valgtSektor,
    valgtTema,
    valgtUnit,
    saks,
    currentSak,
    validation,
    featureToggles,

    cdmVersjonApp,
    countryCodes
  }: SEDNewSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const namespace = 'opprettsak'
  const navigate = useNavigate()
  const [isFnrValid, setIsFnrValid] = useState<boolean>(false)
  const currentYear = new Date().getFullYear()
  const [fagsakDagpengerYear, setFagsakDagpengerYear] = useState<any>(currentYear)

  let euEftaCountries = countryCodes ? countryCodes["v" + cdmVersjonApp as keyof CountryCodes]["euEftaLand" as keyof CountryCodeLists] : []
  const euEftaCountryCodes = euEftaCountries.map((c) => {
    return c.landkode
  })
  let statsborgerskapCountries = countryCodes ? countryCodes["v" + cdmVersjonApp as keyof CountryCodes]["statsborgerskap" as keyof CountryCodeLists] : []
  const statsborgerskapCountryCodes = statsborgerskapCountries.map((c) => {
    return c.landkode
  })

  const SedTypesWithEUEFTAOnlyAddress = [
    "DA006", "DA007", "DA008", "DA009",
    "S071", "S072", "S073", "S130", "S131",
    "U001", "U001CB", "U003", "U005", "U007", "U009"
  ]
  const [_showNonEUEftaAddressWarning, setShowNonEUEftaAddressWarning] = useState<boolean>(false)
  const [_notValidNationalityWarning, setNotValidNationalityWarning] = useState<string | undefined>(undefined)


  const temaer: Array<Kodeverk> = !kodemaps ? [] : !valgtSektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[valgtSektor] as keyof Tema].filter((k:Kodeverk) => {
    return k.kode !== "GEN"
  })
  const _buctyper: Array<Kodeverk> = !kodemaps ? [] : !valgtSektor ? [] : !buctyper ? [] : buctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor] as keyof BucTyper]
  const _sedtyper: Array<Kodeverk> = !kodemaps
    ? []
    : !valgtSektor
        ? []
        : !valgtBucType
            ? []
            : kodemaps.BUC2SEDS[valgtSektor][valgtBucType].reduce((acc: any, curr: any) => {
              const kode = _.find(sedtyper, (elem: any) => elem.kode === curr)
              acc.push(kode)
              return acc
            }, []) ?? []
  const visFagsakerListe: false | undefined | null | boolean = !_.isEmpty(valgtSektor) && !_.isEmpty(tema) && (!_.isEmpty(fagsaker) || (valgtSektor === "UB" && fagsaker && fagsaker.length >= 0))
  const visEnheter: boolean = valgtSektor === 'HZ' || valgtSektor === 'SI'

  const ALLOWED_TO_FILL_OUT = getAllowed("ALLOWED_TO_FILL_OUT", !!featureToggles?.featureAdmin)
  const allowedToFillOut = (sedType: string) => ALLOWED_TO_FILL_OUT.indexOf(sedType) >= 0

  const skjemaSubmit = (): void => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationSEDNewProps>(clonedvalidation, namespace, validateSEDNew, {
      fnr: valgtFnr,
      isFnrValid,
      sektor: valgtSektor,
      buctype: valgtBucType,
      sedtype: valgtSedType,
      landkode: valgtLandkode,
      institusjon: valgtInstitusjon,
      tema: valgtTema,
      familierelasjoner: [...valgteFamilieRelasjonerPDL, ...valgteFamilieRelasjonerUtland],
      saksId: valgtSaksId,
      visEnheter,
      unit: valgtUnit
    } as ValidationSEDNewProps)
    dispatch(setValidation(clonedvalidation))

    const ektefellePDL = valgteFamilieRelasjonerPDL!.find((r) => r.__rolle === "EKTE")
    const annenpersonPDL = valgteFamilieRelasjonerPDL!.find((r) => r.__rolle === "ANNEN")
    const barnPDL = valgteFamilieRelasjonerPDL!.filter((r) => r.__rolle === "BARN").map((barn) => {return {fnr: barn.fnr}})
    const barnUtland = valgteFamilieRelasjonerUtland!.filter((r) => r.__rolle === "BARN").map((barn) => {
      const barnInfo: PersonInfoUtland = cloneDeep(barn)
      delete barnInfo.__rolle
      return {
        info: barnInfo
      }
    })

    const barn = [...barnPDL, ...barnUtland]

    const ektefelleUtland = valgteFamilieRelasjonerUtland?.find((r: PersonInfoUtland) => r.__rolle === "EKTE")
    const annenpersonUtland = valgteFamilieRelasjonerUtland?.find((r: PersonInfoUtland) => r.__rolle === "ANNEN")

    const ektefelleInfo = cloneDeep(ektefelleUtland)
    delete ektefelleInfo?.__rolle

    const annenpersonInfo = cloneDeep(annenpersonUtland)
    delete annenpersonInfo?.__rolle

    const payload = {
      buctype: valgtBucType,
      sedtype: valgtSedType,
      mottakerId: valgtInstitusjon,
      mottakerlandkode: valgtLandkode,
      fagsak: fagsaker!.find((f) => f.id === valgtSaksId),
      ...(valgtUnit && {enhet: valgtUnit}),

      bruker: {
        fnr: valgtFnr
      },
      ...(ektefellePDL && { ektefelle: {fnr: ektefellePDL.fnr} }),
      ...(annenpersonPDL && { annenperson: {fnr: annenpersonPDL.fnr} }),
      ...(ektefelleUtland && { ektefelle: {info: ektefelleInfo} }),
      ...(annenpersonUtland && { annenperson: {info: annenpersonInfo} }),
      ...(barn && barn.length > 0 && { barn: barn }),
    }

    if (!hasErrors) {
      dispatch(sakActions.createSak(payload))
    }
  }

  const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('unit', e.target.value))
    if (validation[namespace + '-unit']) {
      dispatch(resetValidation(namespace + '-unit'))
    }
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setShowNonEUEftaAddressWarning(false)
    dispatch(sakActions.setProperty('unit', undefined))
    dispatch(sakActions.setProperty('sedtype', undefined))
    dispatch(sakActions.setProperty('buctype', undefined))
    dispatch(sakActions.setProperty('landkode', undefined))
    dispatch(sakActions.setProperty('institusjon', undefined))
    dispatch(sakActions.setProperty('institusjonList', undefined))
    dispatch(sakActions.setProperty('tema', undefined))
    dispatch(sakActions.resetFagsaker())
    dispatch(sakActions.setProperty('sektor', e.target.value))
    if (validation[namespace + '-sektor']) {
      dispatch(resetValidation(namespace + '-sektor'))
    }
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const buctype = event.target.value
    dispatch(sakActions.setProperty('sedtype', undefined))
    dispatch(sakActions.setProperty('buctype', buctype))
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

    setShowNonEUEftaAddressWarning(false)
    if(SedTypesWithEUEFTAOnlyAddress.includes(e)){
      const nonEuEftaAddresses = personMedFamilie?.adresser?.filter((a: AdressePDL) => {
        if(a.landkode && !(euEftaCountryCodes.indexOf(a.landkode) > -1)) {
          return a
        }
      })

      if(nonEuEftaAddresses && nonEuEftaAddresses.length > 0){
        setShowNonEUEftaAddressWarning(true)
      }
    }
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSedtypeSet(e.target.value)
  }

  const onLandkodeChange = (country: Country): void => {
    dispatch(sakActions.setProperty('institusjon', ''))
    const landKode = country.value3
    dispatch(sakActions.setProperty('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType!, landKode))
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
    setFagsakDagpengerYear(currentYear);
    if (!!personMedFamilie?.fnr && valgtSektor && valgtTema) {
      dispatch(sakActions.getFagsaker(personMedFamilie.fnr!, valgtSektor!, valgtTema!))
    }
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(sakActions.setProperty('saksId', event.target.value))
    if (validation[namespace + '-saksId']) {
      dispatch(resetValidation(namespace + '-saksId'))
    }
  }

  const onCreateFagsak = () => {
    if (!!personMedFamilie?.fnr && valgtTema) {
      dispatch(createFagsakGenerell(personMedFamilie.fnr!, valgtTema!))
    }
  }

  const onCreateFagsakDagpenger = () => {
    if (!!personMedFamilie?.fnr) {
      dispatch(createFagsakDagpenger(personMedFamilie.fnr!, {aar: fagsakDagpengerYear}))
    }
  }

  let nonValidNationalityCountries: any[] | undefined = []
  const onPersonFound = () => {
    setIsFnrValid(true)

    nonValidNationalityCountries = personMedFamilie?.statsborgerskap?.filter((s: Statsborgerskap) => {
      if(s.landkode && !(statsborgerskapCountryCodes.indexOf(s.landkode) > -1)) {
        return s
      }
    })

    if(nonValidNationalityCountries && nonValidNationalityCountries.length > 0){
      setNotValidNationalityWarning(t('message:error-non-valid-nationality', {statsborgerskap: nonValidNationalityCountries.map(s=> s.landkode).join(',')}))
    }
  }

  const fillOutSed = (opprettetSak: OpprettetSak) => {
    dispatch(personReset())
    dispatch(resetSentSed())
    dispatch(editSed(opprettetSak, {
      sed: {
        sedId: opprettetSak.sedId!,
        sedTittel: _sedtyper.find((s: Kodeverk) => s.kode === valgtSedType!)?.term as string,
        sedType: valgtSedType,
        status: 'new'
      } as Sed,
      sak: {
        sakId: opprettetSak.sakId,
        sakType: valgtBucType,
        sakTittel: _.find(_buctyper, s => s.kode === valgtBucType)?.term as string,
        erSakseier: "ja",
        motpart: [_.find(institusjoner, i => i.institusjonsID === valgtInstitusjon)?.navn as string]
      } as Sak
    }))
  }

  useEffect(() => {
    if(currentSak){
      dispatch(setCurrentSak(undefined))
    }
  }, [])

  useEffect(() => {
    //If saks is set because search from frontpage is not finished - reset
    if(saks){
      dispatch(resetSaks())
    }
  }, [saks])


  useEffect(() => {
    if (!_.isNil(filloutinfo)) {
      dispatch(loadReplySed(filloutinfo))
      dispatch(setCurrentSak(filloutinfo.sak))
      dispatch(resetFilloutInfo())
      navigate({
        pathname: '/svarsed/edit/sak/' + filloutinfo.sak.sakId + '/sed/' + filloutinfo.sed.sedId,
        search: window.location.search
      })
    }
  }, [filloutinfo])

  useEffect(() => {
    if(fagsaker && fagsaker.length === 1){
      dispatch(sakActions.setProperty('saksId', fagsaker[0].id))
    }
  }, [fagsaker])


  return (
    <Container>
      <Margin />
      <MyContent style={{ flex: 6 }}>
        <Row>
          <Column>
            <PersonSearch
              key={namespace + '-fnr-' + valgtFnr}
              alertMessage={alertMessage}
              alertType={alertType}
              alertTypesWatched={[types.PERSON_SEARCH_FAILURE]}
              data-testid={namespace + '-fnr'}
              error={validation[namespace + '-fnr']?.feilmelding}
              searchingPerson={searchingPerson}
              id={namespace + '-fnr'}
              initialFnr=''
              value={valgtFnr}
              parentNamespace={namespace}
              onFnrChange={() => {
                setShowNonEUEftaAddressWarning(false)
                setNotValidNationalityWarning(undefined)
                if (isFnrValid) {
                  setIsFnrValid(false)
                  dispatch(appActions.appReset()) // cleans person and sak reducer
                }
              }}
              onPersonFound={onPersonFound}
              onSearchPerformed={(fnr: string) => {
                setShowNonEUEftaAddressWarning(false)
                setNotValidNationalityWarning(undefined)
                dispatch(sakActions.sakReset())
                dispatch(sakActions.setProperty('fnr', fnr))
                dispatch(personActions.searchPersonMedFamilie(fnr))
              }}
              person={personMedFamilie}
            />
          </Column>
          <Column/>
        </Row>
        {!!_notValidNationalityWarning &&
          <>
            <VerticalSeparatorDiv size='2' />
            <Alert variant='warning'>
              {_notValidNationalityWarning}
            </Alert>
          </>
        }
        <VerticalSeparatorDiv size='2' />
        <Row className="personInfo">
          <Column>
            {personMedFamilie &&
              <PersonPanel className='neutral' person={personMedFamilie}/>
            }
          </Column>
        </Row>
        <VerticalSeparatorDiv size='2' />
        <Row>
          <Column>
            <Select
              data-testid={namespace + '-sektor'}
              disabled={_.isEmpty(personMedFamilie) || !!opprettetSak}
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
                data-testid={namespace + '-unit'}
                error={validation[namespace + '-unit']?.feilmelding}
                id={namespace + '-unit'}
                label={t('label:enhet')}
                onChange={onUnitChange}
                value={valgtUnit}
                disabled={!!opprettetSak}
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
        <Row>
          <Column>
            <Select
              data-testid={namespace + '-buctype'}
              disabled={_.isEmpty(valgtSektor) || _.isEmpty(personMedFamilie) || !!opprettetSak}
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
              data-testid={namespace + '-sedtype'}
              disabled={_.isEmpty(valgtBucType) || _.isEmpty(valgtSektor) || _.isEmpty(personMedFamilie) || !!opprettetSak}
              error={validation[namespace + '-sedtype']?.feilmelding}
              id={namespace + '-sedtype'}
              label={t('label:sed')}
              onChange={onSedtypeChange}
              value={valgtSedType}
            >
              <option value=''>
                {t('label:velg')}
              </option>)
              {_sedtyper && _sedtyper.map((k: Kodeverk) => {
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
        {_showNonEUEftaAddressWarning &&
          <Alert variant='error'>
            {t('message:error-non-euefta-address')}
          </Alert>
        }
        <VerticalSeparatorDiv />
        <Row>
          <Column>
            <CountryDropdown
              closeMenuOnSelect
              data-testid={namespace + '-landkode'}
              error={validation[namespace + '-landkode']?.feilmelding}
              id={namespace + '-landkode'}
              countryCodeListName="euEftaLand"
              label={t('label:land')}
              isDisabled={_.isEmpty(valgtBucType) || _.isEmpty(personMedFamilie) || !!opprettetSak}
              menuPortalTarget={document.body}
              onOptionSelected={onLandkodeChange}
              flagWave
              values={valgtLandkode}
            />
            <VerticalSeparatorDiv />
          </Column>
          <Column>
            <FlexCenterDiv>
              <Select
                data-testid={namespace + '-institusjon'}
                disabled={_.isEmpty(valgtLandkode) || gettingInstitusjoner || _.isEmpty(personMedFamilie) || !!opprettetSak}
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
            <FamilieRelasjoner
              validation={validation}
              namespace={namespace}
              personMedFamilie={personMedFamilie}
              valgteFamilieRelasjonerPDL={valgteFamilieRelasjonerPDL}
              valgteFamilieRelasjonerUtland={valgteFamilieRelasjonerUtland}
            />
          </>
        )}
        <VerticalSeparatorDiv />
        {valgtSektor && (
          <AlignStartRow>
            <Column>
              <FlexDiv>
                <div style={{ flex: 3 }}>
                  <Select
                    data-testid={namespace + '-tema'}
                    error={validation[namespace + '-tema']?.feilmelding}
                    id={namespace + '-tema'}
                    label={t('label:velg-tema')}
                    onChange={onTemaChange}
                    disabled={_.isEmpty(personMedFamilie) || !!opprettetSak}
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
                      disabled={gettingFagsaker || _.isEmpty(valgtTema) || _.isEmpty(personMedFamilie) || !!opprettetSak}
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
                  <Select
                    data-testid={namespace + '-saksId'}
                    error={validation[namespace + '-saksId']?.feilmelding}
                    id={namespace + '-saksId'}
                    label={t('label:velg-fagsak')}
                    onChange={onSakIDChange}
                    value={valgtSaksId}
                    disabled={!!opprettetSak}
                  >
                    <option value=''>
                      {t('label:velg')}
                    </option>
                    {fagsaker &&
                      fagsaker.map((f: Fagsak) => (
                        <option value={f.id} key={f.id}>
                          {f.nr || f.id}
                        </option>
                      ))
                    }
                  </Select>
                </>
              )}
              {valgtSektor !== "UB" && fagsaker && fagsaker.length === 0 &&
                <Button variant="secondary" onClick={onCreateFagsak} loading={creatingFagsak} className='nolabel' disabled={!!opprettetSak}>
                  {t("el:button-create-x", {x: "fagsak"})}
                </Button>
              }
              <VerticalSeparatorDiv />
              {valgtSektor === "UB" && fagsaker && fagsaker.length >= 0 &&
                <>
                  <Button variant="secondary" onClick={onCreateFagsakDagpenger} loading={creatingFagsak} disabled={!!opprettetSak}>
                    {t("el:button-create-x", {x: "fagsak"})}
                  </Button>
                  <VerticalSeparatorDiv size={0.2}/>
                  <Select disabled={!!opprettetSak} label="År" hideLabel={true} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFagsakDagpengerYear(e.currentTarget.value)}>
                    <option value={currentYear}>{currentYear}</option>
                    <option value={currentYear - 1}>{currentYear - 1}</option>
                    <option value={currentYear - 2}>{currentYear - 2}</option>
                    <option value={currentYear - 3}>{currentYear - 3}</option>
                    <option value={currentYear - 4}>{currentYear - 4}</option>
                  </Select>
                </>
              }
            </Column>
          </AlignStartRow>
        )}
        <VerticalSeparatorDiv />
        <Row>
          <Column>
            <FlexDiv>
              <Button
                variant='primary'
                disabled={_showNonEUEftaAddressWarning || sendingSak || !!opprettetSak || _.isEmpty(personMedFamilie)}
                onClick={skjemaSubmit}
              >
                {sendingSak && <Loader />}
                {t('label:opprett-sak-i-rina')}
              </Button>
              <HorizontalSeparatorDiv />

              <Button
                variant='tertiary'
                disabled={_.isEmpty(personMedFamilie)}
                onClick={() => {
                  setShowNonEUEftaAddressWarning(false)
                  setNotValidNationalityWarning(undefined)
                  dispatch(personReset())
                  dispatch(sakReset())
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
        <VerticalSeparatorDiv />
        {opprettetSak && opprettetSak.sakUrl && (
          <>
            <Row>
              <Column>
                <Alert variant='success'>
                  <PileDiv>
                    <div>
                      <BodyLong>
                        {t('label:saksnummer') + ': ' + opprettetSak.sakId + ' ' + t('label:er-opprettet')}.
                      </BodyLong>
                      <VerticalSeparatorDiv size='0.5' />
                    </div>
                    <FlexDiv>
                      <Button
                        variant='primary'
                        disabled={!(opprettetSak && allowedToFillOut(valgtSedType!))}
                        onClick={() => fillOutSed(opprettetSak!)}
                      >
                        {t('el:button-fill-sed')}
                      </Button>
                      <HorizontalSeparatorDiv />
                      {opprettetSak.sakUrl && (
                        <Button
                          variant='tertiary'
                          onClick={() =>
                            window.open(opprettetSak.sakUrl, '_blank')}
                        >
                          {t('label:gå-til-rina')}
                        </Button>
                      )}
                      <HorizontalSeparatorDiv />
                      {opprettetSak.sakId && (
                        <Button
                          variant='tertiary'
                          onClick={() =>
                            navigate({
                              pathname: '/vedlegg',
                              search: 'rinasaksnummer=' + opprettetSak.sakId + '&fnr=' + valgtFnr
                            })}
                        >
                          {t('label:legg-til-vedlegg-til-sed')}
                        </Button>
                      )}
                    </FlexDiv>
                  </PileDiv>
                </Alert>
              </Column>
            </Row>
            <VerticalSeparatorDiv size='2' />
          </>
        )}
      </MyContent>
      <PersonInfoContent style={{ flex: 2 }}>
        {personMedFamilie &&
          <PersonPanel className='neutral' person={personMedFamilie}/>
        }
      </PersonInfoContent>
      <Margin />
    </Container>
  )
}

export default SEDNew
