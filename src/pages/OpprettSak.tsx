import * as appActions from 'actions/app'
import * as formActions from 'actions/form'
import * as sakActions from 'actions/sak'
import AbortModal from 'components/AbortModal/AbortModal'
import Family from 'components/Family/Family'
import PersonSearch from 'components/PersonSearch/PersonSearch'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { Enheter, FagSaker, Person, Validation } from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IkonArbeidsforhold from 'resources/images/ikon-arbeidsforhold'
import { formatterDatoTilNorsk } from 'utils/dato'
import classNames from 'classnames'
import './OpprettSak.css'

export interface OpprettSakProps {
  history: any;
}

export interface OpprettSakSelector {
  arbeidsforhold: any;
  buctyper: any;
  fagsaker: FagSaker | undefined | null;
  institusjoner: any;
  kodemaps: any;
  landkoder: any;
  opprettetSak: any;
  sektor: any;
  enheter: Enheter | undefined;
  person: Person | undefined;
  sedtyper: any;
  sendingSak: boolean;
  serverInfo: any;
  tema: any;

  valgtFnr: any;
  valgtUnit: any;
  valgtBucType: any;
  valgtSedType: any;
  valgtSektor: any;
  valgtLandkode: any;
  valgtInstitusjon: any;
  valgtSaksId: any;
  valgtTema: any,
  valgteFamilieRelasjoner: any;
  valgteArbeidsforhold: any;
}

const mapState = (state: State): OpprettSakSelector => ({
  enheter: state.app.enheter,
  serverInfo: state.app.serverinfo,

  sendingSak: state.loading.sendingSak,

  arbeidsforhold: state.sak.arbeidsforhold,
  buctyper: state.sak.buctyper,
  fagsaker: state.sak.fagsaker,
  kodemaps: state.sak.kodemaps,
  institusjoner: state.sak.institusjoner,
  landkoder: state.sak.landkoder,
  opprettetSak: state.sak.opprettetSak,
  person: state.sak.person,
  sedtyper: state.sak.sedtyper,
  sektor: state.sak.sektor,
  tema: state.sak.tema,

  valgteArbeidsforhold: state.form.arbeidsforhold,
  valgtBucType: state.form.buctype,
  valgteFamilieRelasjoner: state.form.familierelasjoner,
  valgtFnr: state.form.fnr,
  valgtInstitusjon: state.form.institusjon,
  valgtLandkode: state.form.landkode,
  valgtSaksId: state.form.saksId,
  valgtSedType: state.form.sedtype,
  valgtSektor: state.form.sektor,
  valgtTema: state.form.tema,
  valgtUnit: state.form.unit
})

const OpprettSak: React.FC<OpprettSakProps> = ({ history } : OpprettSakProps): JSX.Element => {
  const {
    enheter, serverInfo, sendingSak, arbeidsforhold, buctyper, fagsaker, sedtyper, institusjoner, kodemaps,
    landkoder, opprettetSak, person, sektor, tema, valgteArbeidsforhold, valgtBucType, valgteFamilieRelasjoner,
    valgtFnr, valgtInstitusjon, valgtLandkode, valgtSaksId, valgtSedType, valgtSektor, valgtTema, valgtUnit
  }: OpprettSakSelector = useSelector<State, OpprettSakSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [visModal, setVisModal] = useState(false)
  const [validation, setValidation] = useState<{[k: string]: any}>({})
  const [isFnrValid, setIsFnrValid] = useState<boolean>(false)

  const temaer = (!kodemaps ? [] : (!valgtSektor ? [] : tema[kodemaps.SEKTOR2FAGSAK[valgtSektor]]))
  const _buctyper = (!kodemaps ? [] : (!valgtSektor ? [] : buctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor]]))
  let _sedtyper = (!kodemaps ? [] : ((!valgtSektor || !valgtBucType) ? [] : kodemaps.BUC2SEDS[valgtSektor][valgtBucType]))

  if (!(_sedtyper && _sedtyper.length)) {
    _sedtyper = []
  }
  _sedtyper = _sedtyper.reduce((acc: any, curr: any) => {
    const kode = sedtyper?.find((elem: any) => elem.kode === curr)
    acc.push(kode)
    return acc
  }, [])

  const isSomething = (value: any): boolean => (!_.isNil(value) && !_.isEmpty(value))
  const visFagsakerListe: boolean = isSomething(valgtSektor) && isSomething(tema) && isSomething(fagsaker)
  const visArbeidsforhold: boolean = EKV.Koder.sektor.FB === valgtSektor && EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && isSomething(valgtSedType)

  const validate = (): Validation => {
    const validation: Validation = {
      fnr: !valgtFnr ? t('ui:validation-noFnr') : (!isFnrValid ? t('ui:validation-uncheckedFnr') : null),
      sektor: !valgtSektor ? t('ui:validation-noSektor') : null,
      buctype: !valgtBucType ? t('ui:validation-noBuctype') : null,
      sedtype: !valgtSedType ? t('ui:validation-noSedtype') : null,
      landkode: !valgtLandkode ? t('ui:validation-noLand') : null,
      institusjon: !valgtInstitusjon ? t('ui:validation-noInstitusjonsID') : null,
      tema: !valgtTema ? t('ui:validation-noTema') : null,
      saksId: !valgtSaksId ? t('ui:validation-noSaksId') : null
    }
    setValidation(validation)
    return validation
  }

  const resetAllValidation = () => {
    setValidation({})
  }

  const resetValidation = (key: Array<string> | string): void => {
    const newValidation = _.cloneDeep(validation)
    if (_.isString(key)) {
      newValidation[key] = null
    }
    if (_.isArray(key)) {
      key.forEach(k => {
        newValidation[k] = null
      })
    }
    setValidation(newValidation)
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), e => e !== null) === undefined
  }

  const skjemaSubmit = (): void => {
    if (isValid(validate())) {
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
        arbeidsforhold: valgteArbeidsforhold
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
    dispatch(appActions.cleanData())
    history.push('/')
  }

  const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('unit')
    dispatch(formActions.set('unit', e.target.value))
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('sektor')
    resetValidation('unit')
    dispatch(formActions.set('unit', undefined))
    dispatch(formActions.set('sektor', e.target.value))
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation(['buctype', 'landkode'])
    const buctype = event.target.value
    dispatch(formActions.set('buctype', buctype))
    dispatch(formActions.set('landkode', undefined))
    dispatch(formActions.set('sedtype', undefined))
    dispatch(formActions.set('institution', undefined))
    dispatch(sakActions.getLandkoder(buctype))
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('sedtype')
    dispatch(formActions.set('sedtype', e.target.value))
  }

  const onSedtypeSet = (e: string): void => {
    resetValidation('sedtype')
    dispatch(formActions.set('sedtype', e))
  }

  const onLandkodeChange = (country: any): void => {
    resetValidation(['landkode', 'institusjon'])
    const landKode = country.value
    dispatch(formActions.set('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('institusjon')
    dispatch(formActions.set('institusjon', event.target.value))
  }

  const onTemaChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation(['tema', 'saksId'])
    dispatch(formActions.set('tema', event.target.value))
    dispatch(formActions.set('fagsaker', undefined))
  }

  const onViewFagsakerClick = (): void => {
    dispatch(sakActions.getFagsaker(person?.fnr, valgtSektor, valgtTema))
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('saksId')
    dispatch(formActions.set('saksId', event.target.value))
  }

  const getArbeidsforhold = (): void => {
    dispatch(sakActions.getArbeidsforhold(person?.fnr))
  }

  const onArbeidsforholdClick = (item: any, checked: boolean): void => {
    if (checked) {
      dispatch(formActions.addArbeidsforhold(item))
    } else {
      dispatch(formActions.removeArbeidsforhold(item))
    }
  }

  return (
    <TopContainer className='opprettsak'>
      <Ui.Nav.Row className='m-0 p-4'>
        <div className='col-sm-1' />
        <div className='col-sm-10'>
          <Ui.Nav.Systemtittel className='mb-4'>
            {t('ui:title-newcase')}
          </Ui.Nav.Systemtittel>
          <PersonSearch
            className='slideAnimate'
            validation={validation}
            resetAllValidation={resetAllValidation}
            onFnrChange={() => setIsFnrValid(false)}
            onPersonFound={() => setIsFnrValid(true)}
          />
          {person ? (
            <Ui.Nav.Row>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0s' }}>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-sektor'
                  label={t('ui:label-sektor')}
                  disabled={!person}
                  onChange={onSektorChange}
                  value={valgtSektor}
                  feil={validation.sektor}
                >
                  <option value=''>{t('ui:form-choose')}</option>)
                  {sektor ? _.orderBy(sektor, 'term').map((element: any) => (
                    <option value={element.kode} key={element.kode}>{element.term}</option>)
                  ) : null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0.15s' }}>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-enhet'
                  disabled={!(valgtSektor === 'HZ' || valgtSektor === 'SI')}
                  label={t('ui:label-unit')}
                  onChange={onUnitChange}
                  value={valgtUnit}
                  feil={validation.unit}
                >
                  <option value=''>{t('ui:form-choose')}</option>)
                  {sektor ? _.orderBy(enheter, 'navn').map((element: any) => (
                    <option value={element.enhetId} key={element.enhetId}>{element.navn}</option>)
                  ) : null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0.15s' }}>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-buctype'
                  label={t('ui:label-buc')}
                  disabled={!isSomething(valgtSektor)}
                  onChange={onBuctypeChange}
                  value={valgtBucType}
                  feil={validation.buctype}
                >
                  <option value=''>{t('ui:form-choose')}</option>)
                  {_buctyper ? _.orderBy(_buctyper, 'kode').map((element: any) => (
                    <option value={element.kode} key={element.kode}>{element.kode} - {element.term}</option>)
                  ) : null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0.3s' }}>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-sedtype'
                  label={t('ui:label-sed')}
                  disabled={!isSomething(valgtBucType) || !isSomething(valgtSektor)}
                  onChange={onSedtypeChange}
                  value={valgtSedType}
                  feil={validation.sedtype}
                >
                  <option value=''>{t('ui:form-choose')}</option>)
                  {_sedtyper ? _sedtyper.map((element: any) => {
                    // if only one element, select it
                    if (_sedtyper.length === 1 && valgtSedType !== element.kode) {
                      onSedtypeSet(element.kode)
                    }
                    return <option value={element.kode} key={element.kode}>{element.kode} - {element.term}</option>
                  }) : null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0.45s' }}>
                <Ui.CountrySelect
                  className='mb-4'
                  label={t('ui:label-landkode')}
                  lang='nb'
                  placeholder={t('ui:form-choose')}
                  menuPortalTarget={document.body}
                  disabled={!isSomething(person)}
                  includeList={landkoder ? _.orderBy(landkoder, 'term').map((element: any) => element.kode) : []}
                  onOptionSelected={onLandkodeChange}
                  value={valgtLandkode}
                  error={validation.landkode}
                />
              </div>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0.6s' }}>
                <Ui.Nav.Select
                  id='id-institusjon'
                  className='mb-4'
                  disabled={!isSomething(valgtLandkode)}
                  value={valgtInstitusjon}
                  onChange={onInstitusjonChange}
                  label={t('ui:label-institusjon')}
                  feil={validation.institusjon}
                >
                  <option value=''>{t('ui:form-choose')}</option>)
                  {institusjoner ? _.orderBy(institusjoner, 'term').map((element: any) => (
                    <option value={element.institusjonsID} key={element.institusjonsID}>{element.navn}</option>)
                  ) : null}
                </Ui.Nav.Select>
              </div>
              {valgtSektor === 'FB' ? (
                <div className='col-xs-12 mb-4 slideAnimate'>
                  <Family />
                </div>
              ) : null}
              {valgtSektor ? (
                <>
                  <div className='col-xs-12'>
                    <div className={classNames('slideAnimate', 'opprettsak__tema', { feil: !!validation.tema })}>
                      <div className='w-50 mr-3'>
                        <Ui.Nav.Select
                          id='id-behandlings-tema'
                          className='mb-4'
                          label={t('ui:label-tema')}
                          value={valgtTema}
                          onChange={onTemaChange}
                          feil={validation.tema}
                        >
                          <option value=''>{t('ui:form-choose')}</option>)
                          {temaer ? temaer.map((element: any) => (
                            <option value={element.kode} key={element.kode}>{element.term}</option>)
                          ) : null}
                        </Ui.Nav.Select>
                      </div>
                      <div className='w-50'>
                        <div className='d-flex' style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <Ui.Nav.Knapp
                              className='mb-4'
                              onClick={onViewFagsakerClick}
                              disabled={!isSomething(valgtTema)}
                            >
                              {t('ui:form-seeCases')}
                            </Ui.Nav.Knapp>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {fagsaker === null || (fagsaker !== undefined && _.isEmpty(fagsaker)) ? (
                    <div className='col-xs-12 mb-4'>
                      <Ui.Nav.AlertStripe type='advarsel'>
                        {t('ui:error-fagsak-notFound')}
                        <Ui.Nav.Lenke
                          className='mb-4'
                          href={serverInfo.gosysURL}
                          ariaLabel={t('ui:form-createNewCaseInGosys')}
                          target='_blank'
                        >
                          {t('ui:form-createNewCaseInGosys')}
                        </Ui.Nav.Lenke>
                      </Ui.Nav.AlertStripe>
                    </div>
                  ) : null}
                </>
              ) : null}
              {visFagsakerListe ? (
                <>
                  <div className='col-xs-6'>
                    <Ui.Nav.Select
                      id='id-fagsaker'
                      className='mb-4'
                      label={t('ui:label-fagsak')}
                      value={valgtSaksId}
                      onChange={onSakIDChange}
                      feil={validation.saksId}
                    >
                      <option value=''>{t('ui:form-choose')}</option>
                      {fagsaker ? _.orderBy(fagsaker, 'fagsakNr').map(element => (
                        <option value={element.saksID} key={element.saksID}>{element.fagsakNr ? element.fagsakNr : element.saksID}</option>)
                      ) : null}
                    </Ui.Nav.Select>
                  </div>
                  <div className='col-xs-6' />
                </>
              ) : null}
              {visArbeidsforhold ? (
                <>
                  <div className='col-xs-6 arbeidsforhold'>
                    <Ui.Nav.Row>
                      <div className='col-xs-6'>
                        <strong>{t('ui:label-aaRegistered')}</strong><br />{t('ui:label-arbeidsforhold')}
                      </div>
                      <div className='col-xs-6'>
                        <Ui.Nav.Knapp onClick={getArbeidsforhold}>
                          {t('ui:form-search')}
                        </Ui.Nav.Knapp>
                      </div>
                    </Ui.Nav.Row>
                    {arbeidsforhold ? arbeidsforhold.map((arbeidsforholdet: any, index: number) => {
                      const { arbeidsforholdIDnav, navn, orgnr, ansettelsesPeriode: { fom, tom } } = arbeidsforholdet
                      const arbeidsForholdErValgt = valgteArbeidsforhold.find((item: any) => item.arbeidsforholdIDnav === arbeidsforholdIDnav)
                      return (
                        <Ui.Nav.Panel key={index} className='mt-4' border>
                          <div className='arbeidsforhold-item'>
                            <div className='arbeidsforhold-desc'>
                              <div className='mr-3'>
                                <IkonArbeidsforhold />
                              </div>
                              <div>
                                <strong>{navn}</strong>
                                <br />
                                {t('ui:label-orgnummer')}:&nbsp;{orgnr}
                                <br />
                                {t('ui:label-startDate')}:&nbsp;{formatterDatoTilNorsk(fom)}
                                <br />
                                {t('ui:label-endDate')}:&nbsp;{formatterDatoTilNorsk(tom)}
                              </div>
                            </div>
                            <div>
                              <Ui.Nav.Checkbox
                                checked={arbeidsForholdErValgt}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onArbeidsforholdClick(arbeidsforholdet, e.target.checked)}
                                label={t('ui:form-choose')}
                              />
                            </div>
                          </div>
                        </Ui.Nav.Panel>
                      )
                    }) : null}
                  </div>
                  <div className='col-xs-6' />
                </>
              ) : null}
              <div className='col-xs-12 buttons mt-4 slideAnimate' style={{ animationDelay: '0.75s' }}>
                <Ui.Nav.Hovedknapp
                  className='mr-4'
                  disabled={sendingSak}
                  onClick={skjemaSubmit}
                  spinner={sendingSak}
                >
                  {t('ui:form-createCaseInRina')}
                </Ui.Nav.Hovedknapp>
                <Ui.Nav.Flatknapp aria-label='Navigasjonslink tilbake til forsiden' onClick={openModal}>
                  {t('ui:form-resetForm')}
                </Ui.Nav.Flatknapp>
              </div>
              {opprettetSak && opprettetSak.url ? (
                <div className='col-xs-12'>
                  <Ui.Nav.AlertStripe className='mt-4 w-50' type='suksess'>
                    <div>
                      {opprettetSak.rinasaksnummer ? (
                        <Link to={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer}>
                          {t('ui:form-caseNumber') + ': ' + opprettetSak.rinasaksnummer}
                        </Link>
                      ) : <span>{t('ui:form-caseNumber') + ': ' + opprettetSak.rinasaksnummer}</span>}

                      <span className='ml-1 mr-1'>{t('ui:label-is-created')}.</span>
                      {opprettetSak.url ? (
                        <Ui.Nav.Lenke className='vedlegg__lenke ml-1 mr-1' href={opprettetSak.url} target='_blank'>
                          {t('ui:form-goToRina')}
                        </Ui.Nav.Lenke>
                      ) : null}
                    </div>
                  </Ui.Nav.AlertStripe>
                </div>
              ) : null}
            </Ui.Nav.Row>
          ) : null}
          <AbortModal
            onAbort={onAbort}
            isOpen={visModal}
            closeModal={closeModal}
          />
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

OpprettSak.propTypes = {
  history: PT.any.isRequired
}

export default OpprettSak
