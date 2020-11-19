import { clientClear } from 'actions/alert'
import * as appActions from 'actions/app'
import * as sakActions from 'actions/sak'
import classNames from 'classnames'
import AbortModal from 'components/AbortModal/AbortModal'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import Family from 'components/Family/Family'
import PersonSearch from 'components/PersonSearch/PersonSearch'
import {
  Cell,
  Container,
  Content,
  HorizontalSeparatorDiv,
  Margin,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Enheter, FagSaker, FamilieRelasjon, Person, Validation } from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import Panel from 'nav-frontend-paneler'
import { Select } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const AlignCenterCell = styled(Cell)`
  display: flex;
  align-items: center;
`
const FamilyPanel = styled(Panel)`
  border: 1px solid lightgray;
  border-radius: 5px;
  background-color: white;
  padding: 1rem;
`

export interface OpprettSakProps {
  history: any;
}

export interface OpprettSakSelector {
  alertStatus: any;
  alertMessage: any;
  alertType: any;

  enheter: Enheter | undefined;
  serverInfo: any;

  sendingSak: boolean;
  gettingPerson: boolean;

  arbeidsforholdList: any;
  buctyper: any;
  fagsaker: FagSaker | undefined | null;
  familierelasjonKodeverk: any;
  kodemaps: any;
  institusjoner: any;
  landkoder: any;
  opprettetSak: any;
  person: Person | undefined;
  personRelatert: Person | undefined;
  sedtyper: any;
  sektor: any;
  tema: any;

  valgteArbeidsforhold: any;
  valgtBucType: any;
  valgteFamilieRelasjoner: any;
  valgtFnr: any;
  valgtInstitusjon: any;
  valgtLandkode: any;
  valgtSaksId: any;
  valgtSedType: any;
  valgtSektor: any;
  valgtTema: any;
  valgtUnit: any;
}

const mapState = (state: State): OpprettSakSelector => ({
  alertStatus: state.alert.clientErrorStatus,
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

  const [_visModal, setVisModal] = useState(false)
  const [_validation, setValidation] = useState<{ [k: string]: any }>({})
  const [_isFnrValid, setIsFnrValid] = useState<boolean>(false)

  const temaer = !kodemaps ? [] : !valgtSektor ? [] : tema[kodemaps.SEKTOR2FAGSAK[valgtSektor]]
  const _buctyper = !kodemaps ? [] : !valgtSektor ? [] : buctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor]]
  let _sedtyper = !kodemaps ? [] : !valgtSektor || !valgtBucType ? [] : kodemaps.BUC2SEDS[valgtSektor][valgtBucType]

  if (!(_sedtyper && _sedtyper.length)) {
    _sedtyper = []
  }
  _sedtyper = _sedtyper.reduce((acc: any, curr: any) => {
    const kode = sedtyper?.find((elem: any) => elem.kode === curr)
    acc.push(kode)
    return acc
  }, [])

  const isSomething = (value: any): boolean =>
    !_.isNil(value) && !_.isEmpty(value)
  const visFagsakerListe: boolean =
    isSomething(valgtSektor) && isSomething(tema) && isSomething(fagsaker)
  const visArbeidsforhold: boolean =
    EKV.Koder.sektor.FB === valgtSektor &&
    EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType &&
    isSomething(valgtSedType)
  const visEnheter = valgtSektor === 'HZ' || valgtSektor === 'SI'

  const validate = (): { [k: string]: any } => {
    const validation: { [k: string]: any } = {
      fnr: !valgtFnr
        ? t('ui:validation-noFnr')
        : !_isFnrValid
            ? t('ui:validation-uncheckedFnr')
            : null,
      sektor: !valgtSektor ? t('ui:validation-noSektor') : null,
      buctype: !valgtBucType ? t('ui:validation-noBuctype') : null,
      sedtype: !valgtSedType ? t('ui:validation-noSedtype') : null,
      landkode: !valgtLandkode ? t('ui:validation-noLand') : null,
      institusjon: !valgtInstitusjon
        ? t('ui:validation-noInstitusjonsID')
        : null,
      tema: !valgtTema ? t('ui:validation-noTema') : null,
      saksId: !valgtSaksId ? t('ui:validation-noSaksId') : null,
      unit: visEnheter && !valgtUnit ? t('ui:validation-noUnit') : null
    }
    setValidation(validation)
    return validation
  }

  const resetAllValidation = () => {
    setValidation({})
  }

  const resetValidation = (key: Array<string> | string): void => {
    const newValidation = _.cloneDeep(_validation)
    if (_.isString(key)) {
      newValidation[key] = null
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = null
      })
    }
    setValidation(newValidation)
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== null) === undefined
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
    resetValidation('unit')
    dispatch(sakActions.setProperty('unit', undefined))
    dispatch(sakActions.setProperty('sektor', e.target.value))
  }

  const onBuctypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    resetValidation(['buctype', 'landkode'])
    const buctype = event.target.value
    dispatch(sakActions.setProperty('buctype', buctype))
    dispatch(sakActions.setProperty('landkode', undefined))
    dispatch(sakActions.setProperty('sedtype', undefined))
    dispatch(sakActions.setProperty('institution', undefined))
    dispatch(sakActions.getLandkoder(buctype))
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('sedtype')
    dispatch(sakActions.setProperty('sedtype', e.target.value))
  }

  const onSedtypeSet = (e: string): void => {
    resetValidation('sedtype')
    dispatch(sakActions.setProperty('sedtype', e))
  }

  const onLandkodeChange = (country: any): void => {
    resetValidation(['landkode', 'institusjon'])
    const landKode = country.value
    dispatch(sakActions.setProperty('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const onInstitusjonChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
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

  const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    dispatch(
      sakActions.addFamilierelasjoner({
        ...relation,
        nasjonalitet: 'NO'
      })
    )
  }

  const deleteRelation = (relation: FamilieRelasjon): void => {
    dispatch(sakActions.removeFamilierelasjoner(relation))
  }

  return (
    <TopContainer className='opprettsak'>
      <Container>
        <Margin />
        <Content>
          <Systemtittel>{t('ui:title-newcase')}</Systemtittel>
          <VerticalSeparatorDiv />
          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            alertTypesWatched={[types.SAK_PERSON_GET_FAILURE]}
            initialFnr=''
            person={person}
            gettingPerson={gettingPerson}
            className='slideAnimate'
            validation={_validation}
            resetAllValidation={resetAllValidation}
            onFnrChange={() => {
              setIsFnrValid(false)
              dispatch(appActions.cleanData())
            }}
            onPersonFound={() => setIsFnrValid(true)}
            onSearchPerformed={(_fnr) => {
              dispatch(sakActions.setProperty('fnr', _fnr))
              dispatch(sakActions.getPerson(_fnr))
            }}
            onPersonRemoved={() => {
              dispatch(sakActions.resetPerson())
            }}
            onAlertClose={() => dispatch(clientClear())}
          />
          {person && (
            <>
              <Row>
                <Cell className='slideAnimate' style={{ animationDelay: '0s' }}>
                  <Select
                    id='id-sektor'
                    label={t('ui:label-sektor')}
                    disabled={!person}
                    onChange={onSektorChange}
                    value={valgtSektor}
                    feil={_validation.sektor}
                  >
                    <option value=''>{t('ui:form-choose')}</option>
                    {sektor &&
                      _.orderBy(sektor, 'term').map((element: any) => (
                        <option value={element.kode} key={element.kode}>
                          {element.term}
                        </option>
                      ))}
                  </Select>
                  <VerticalSeparatorDiv />
                </Cell>
                <HorizontalSeparatorDiv />
                <Cell
                  className='slideAnimate'
                  style={{ animationDelay: '0.15s' }}
                >
                  {visEnheter && (
                    <Select
                      id='id-enhet'
                      label={t('ui:label-unit')}
                      onChange={onUnitChange}
                      value={valgtUnit}
                      feil={_validation.unit}
                    >
                      <option value=''>{t('ui:form-choose')}</option>
                      {sektor &&
                        _.orderBy(enheter, 'navn').map((element: any) => (
                          <option value={element.enhetId} key={element.enhetId}>
                            {element.navn}
                          </option>
                        ))}
                    </Select>
                  )}
                  <VerticalSeparatorDiv />
                </Cell>
              </Row>
              <Row>
                <Cell
                  className='slideAnimate'
                  style={{ animationDelay: '0.15s' }}
                >
                  <Select
                    id='id-buctype'
                    label={t('ui:label-buc')}
                    disabled={!isSomething(valgtSektor)}
                    onChange={onBuctypeChange}
                    value={valgtBucType}
                    feil={_validation.buctype}
                  >
                    <option value=''>{t('ui:form-choose')}</option>
                    {_buctyper &&
                      _.orderBy(_buctyper, 'kode').map((element: any) => (
                        <option value={element.kode} key={element.kode}>
                          {element.kode} - {element.term}
                        </option>
                      ))}
                  </Select>
                  <VerticalSeparatorDiv />
                </Cell>
                <HorizontalSeparatorDiv />
                <Cell
                  className='slideAnimate'
                  style={{ animationDelay: '0.3s' }}
                >
                  <Select
                    id='id-sedtype'
                    label={t('ui:label-sed')}
                    disabled={
                      !isSomething(valgtBucType) || !isSomething(valgtSektor)
                    }
                    onChange={onSedtypeChange}
                    value={valgtSedType}
                    feil={_validation.sedtype}
                  >
                    <option value=''>{t('ui:form-choose')}</option>)
                    {_sedtyper &&
                      _sedtyper.map((element: any) => {
                        // if only one element, select it
                        if (
                          _sedtyper.length === 1 &&
                          valgtSedType !== element.kode
                        ) {
                          onSedtypeSet(element.kode)
                        }
                        return (
                          <option value={element.kode} key={element.kode}>
                            {element.kode} - {element.term}
                          </option>
                        )
                      })}
                  </Select>
                  <VerticalSeparatorDiv />
                </Cell>
              </Row>
              <Row>
                <Cell
                  className='slideAnimate'
                  style={{ animationDelay: '0.45s' }}
                >
                  <CountrySelect
                    label={t('ui:label-landkode')}
                    lang='nb'
                    placeholder={t('ui:form-choose')}
                    menuPortalTarget={document.body}
                    disabled={!isSomething(person)}
                    includeList={
                      landkoder
                        ? _.orderBy(landkoder, 'term').map(
                            (element: any) => element.kode
                          )
                        : []
                    }
                    onOptionSelected={onLandkodeChange}
                    value={valgtLandkode}
                    error={_validation.landkode}
                  />
                  <VerticalSeparatorDiv />
                </Cell>
                <HorizontalSeparatorDiv />
                <Cell
                  className='slideAnimate'
                  style={{ animationDelay: '0.6s' }}
                >
                  <Select
                    id='id-institusjon'
                    disabled={!isSomething(valgtLandkode)}
                    value={valgtInstitusjon}
                    onChange={onInstitusjonChange}
                    label={t('ui:label-institusjon')}
                    feil={_validation.institusjon}
                  >
                    <option value=''>{t('ui:form-choose')}</option>)
                    {institusjoner &&
                      _.orderBy(institusjoner, 'term').map((element: any) => (
                        <option
                          value={element.institusjonsID}
                          key={element.institusjonsID}
                        >
                          {element.navn}
                        </option>
                      ))}
                  </Select>
                  <VerticalSeparatorDiv />
                </Cell>
              </Row>
              <Row>
                {valgtSektor === 'FB' && (
                  <Cell className='slideAnimate'>
                    <Systemtittel>
                      {t('ui:label-familyRelationships')}
                    </Systemtittel>
                    <VerticalSeparatorDiv />
                    <FamilyPanel>
                      <Family
                        alertStatus={alertStatus}
                        alertMessage={alertMessage}
                        alertType={alertType}
                        abroadPersonFormAlertTypesWatched={[types.SAK_ABROADPERSON_ADD_FAILURE]}
                        TPSPersonFormAlertTypesWatched={[
                          types.SAK_PERSON_RELATERT_GET_FAILURE,
                          types.SAK_TPSPERSON_ADD_FAILURE
                        ]}
                        familierelasjonKodeverk={familierelasjonKodeverk}
                        personRelatert={personRelatert}
                        person={person}
                        valgteFamilieRelasjoner={valgteFamilieRelasjoner}
                        onAbroadPersonAddedFailure={() => dispatch({ type: types.SAK_ABROADPERSON_ADD_FAILURE })}
                        onAbroadPersonAddedSuccess={(_relation) => {
                          dispatch(sakActions.addFamilierelasjoner(_relation))
                          dispatch({
                            type: types.SAK_ABROADPERSON_ADD_SUCCESS
                          })
                        }}
                        onRelationAdded={(value: any) => addTpsRelation(value)}
                        onRelationRemoved={(value: any) => deleteRelation(value)}
                        onRelationReset={() => dispatch(sakActions.resetPersonRelatert())}
                        onTPSPersonAddedFailure={() => dispatch({ type: types.SAK_TPSPERSON_ADD_FAILURE })}
                        onTPSPersonAddedSuccess={(e: any) => {
                          dispatch(sakActions.addFamilierelasjoner(e))
                          dispatch({ type: types.SAK_TPSPERSON_ADD_SUCCESS })
                        }}
                        onAlertClose={() => dispatch(clientClear())}
                        onSearchFnr={(sok) => {
                          dispatch(sakActions.resetPersonRelatert())
                          dispatch(sakActions.getPersonRelated(sok))
                        }}
                      />
                    </FamilyPanel>
                    <VerticalSeparatorDiv />
                  </Cell>
                )}
              </Row>
              {valgtSektor && (
                <Row>
                  <Cell
                    className={classNames('slideAnimate', {
                      feil: !!_validation.tema
                    })}
                  >
                    <Select
                      id='id-behandlings-tema'
                      label={t('ui:label-tema')}
                      value={valgtTema}
                      onChange={onTemaChange}
                      feil={_validation.tema}
                    >
                      <option value=''>{t('ui:form-choose')}</option>)
                      {temaer &&
                        temaer.map((element: any) => (
                          <option value={element.kode} key={element.kode}>
                            {element.term}
                          </option>
                        ))}
                    </Select>
                    <VerticalSeparatorDiv />
                  </Cell>
                  <HorizontalSeparatorDiv />
                  <AlignCenterCell>
                    <Knapp
                      onClick={onViewFagsakerClick}
                      disabled={!isSomething(valgtTema)}
                    >
                      {t('ui:form-seeCases')}
                    </Knapp>
                    <VerticalSeparatorDiv />
                  </AlignCenterCell>
                </Row>
              )}
              {(fagsaker === null ||
                (fagsaker !== undefined && _.isEmpty(fagsaker))) &&
                (
                  <Row>
                    <AlertStripe type='advarsel'>
                      {t('ui:error-fagsak-notFound')}
                      <Lenke
                        href={serverInfo.gosysURL}
                        ariaLabel={t('ui:form-createNewCaseInGosys')}
                        target='_blank'
                      >
                        {t('ui:form-createNewCaseInGosys')}
                      </Lenke>
                      <VerticalSeparatorDiv />
                    </AlertStripe>
                    <VerticalSeparatorDiv />
                  </Row>
                )}
              {visFagsakerListe && (
                <Row>
                  <Cell>
                    <Select
                      id='id-fagsaker'
                      label={t('ui:label-fagsak')}
                      value={valgtSaksId}
                      onChange={onSakIDChange}
                      feil={_validation.saksId}
                    >
                      <option value=''>{t('ui:form-choose')}</option>
                      {fagsaker &&
                        _.orderBy(fagsaker, 'fagsakNr').map((element) => (
                          <option value={element.saksID} key={element.saksID}>
                            {element.fagsakNr
                              ? element.fagsakNr
                              : element.saksID}
                          </option>
                        ))}
                    </Select>
                    <VerticalSeparatorDiv />
                  </Cell>
                  <Cell />
                </Row>
              )}
              {visArbeidsforhold && (
                <Arbeidsforhold
                  getArbeidsforholdList={() => {
                    dispatch(sakActions.getArbeidsforholdList(person?.fnr))
                  }}
                  valgteArbeidsforhold={valgteArbeidsforhold}
                  arbeidsforholdList={arbeidsforholdList}
                  onArbeidsforholdClick={(item: any, checked: boolean) => dispatch(
                    checked
                      ? sakActions.addArbeidsforhold(item)
                      : sakActions.removeArbeidsforhold(item)
                  )}
                />
              )}
              <VerticalSeparatorDiv />
              <Row className='slideAnimate' style={{ animationDelay: '0.75s' }}>
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
              {opprettetSak && opprettetSak.url && (
                <Row>
                  <Cell>
                    <VerticalSeparatorDiv />
                    <AlertStripe type='suksess'>
                      <div>
                        <span>
                          {t('ui:form-caseNumber') +
                            ': ' +
                            opprettetSak.rinasaksnummer}
                        </span>
                        <span className='ml-1 mr-1'>
                          {t('ui:label-is-created')}.
                        </span>
                        {opprettetSak.url && (
                          <Lenke
                            className='vedlegg__lenke ml-1 mr-1'
                            href={opprettetSak.url}
                            target='_blank'
                          >
                            {t('ui:form-goToRina')}
                          </Lenke>
                        )}
                      </div>
                      <div>
                        {opprettetSak.rinasaksnummer && (
                          <Link
                            to={
                              '/vedlegg?rinasaksnummer=' +
                              opprettetSak.rinasaksnummer
                            }
                          >
                            {t('ui:label-add-as-attachment-to-sed')}
                          </Link>
                        )}
                      </div>
                    </AlertStripe>
                  </Cell>
                  <Cell />
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
