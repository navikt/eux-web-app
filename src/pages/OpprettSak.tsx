import * as appActions from 'actions/app'
import * as formActions from 'actions/form'
import * as sakActions from 'actions/sak'
import AbortModal from 'components/AbortModal/AbortModal'
import Family from 'components/Family/Family'
import PersonSearch from 'components/PersonSearch/PersonSearch'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { Person, Validation } from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IkonArbeidsforhold from 'resources/images/ikon-arbeidsforhold'
import { formatterDatoTilNorsk } from 'utils/dato'
import './OpprettSak.css'

export interface OpprettSakProps {
  history: any;
}

export interface OpprettSakSelector {
  arbeidsforhold: any;
  buctyper: any;
  fagsaker: any;
  institusjoner: any;
  kodemaps: any;
  landkoder: any;
  opprettetSak: any;
  sektor: any;
  personer: Person | undefined;
  sedtyper: any;
  sendingSak: boolean;
  serverInfo: any;
  tema: any;

  valgtFnr: any;
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
  // kodeverk data
  buctyper: state.sak.buctyper,
  sedtyper: state.sak.sedtyper,
  kodemaps: state.sak.kodemaps,
  landkoder: state.sak.landkoder,
  sektor: state.sak.sektor,
  tema: state.sak.tema,

  fagsaker: state.sak.fagsaker,
  institusjoner: state.sak.institusjoner,
  opprettetSak: state.sak.opprettetSak,
  personer: state.sak.personer,
  sendingSak: state.loading.sendingSak,
  serverInfo: state.app.serverinfo,
  arbeidsforhold: state.sak.arbeidsforhold,

  // entered data
  valgtFnr: state.form.fnr,
  valgtBucType: state.form.buctype,
  valgtSedType: state.form.sedtype,
  valgtSektor: state.form.sektor,
  valgtLandkode: state.form.landkode,
  valgtInstitusjon: state.form.institusjon,
  valgtSaksId: state.form.saksId,
  valgtTema: state.form.tema,
  valgteFamilieRelasjoner: state.form.familierelasjoner,
  valgteArbeidsforhold: state.form.arbeidsforhold
})

const OpprettSak: React.FC<OpprettSakProps> = ({ history } : OpprettSakProps): JSX.Element => {
  const {
    arbeidsforhold, buctyper, sedtyper, fagsaker, institusjoner, kodemaps, landkoder, opprettetSak, personer, sektor, sendingSak,
    serverInfo, tema, valgteArbeidsforhold, valgtBucType, valgtFnr, valgteFamilieRelasjoner, valgtInstitusjon, valgtLandkode, valgtSedType, valgtSektor, valgtSaksId, valgtTema
  }: OpprettSakSelector = useSelector<State, OpprettSakSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [visModal, setVisModal] = useState(false)
  const [validation, setValidation] = useState<{[k: string]: any}>({})
  console.log('resetting validation')
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

  const isSomething = (value: any) => (!_.isNil(value) && !_.isEmpty(value))
  const visFagsakerListe = isSomething(valgtSektor) && isSomething(tema) && isSomething(fagsaker)
  const visArbeidsforhold = EKV.Koder.sektor.FB === valgtSektor && EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && isSomething(valgtSedType)

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

  const resetValidation = (key: string) => {
    setValidation({
      ...validation,
      [key]: null
    })
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), e => e !== null) === undefined
  }

  const skjemaSubmit = () => {
    if (isValid(validate())) {
      dispatch(sakActions.createSak({
        fnr: valgtFnr,
        buctype: valgtBucType,
        sedtype: valgtSedType,
        sektor: valgtSektor,
        landkode: valgtLandkode,
        institusjon: valgtInstitusjon,
        saksId: valgtSaksId,
        tema: valgtTema,
        familierelasjoner: valgteFamilieRelasjoner,
        arbeidsforhold: valgteArbeidsforhold
      }))
    }
  }

  const openModal = () => {
    setVisModal(true)
  }

  const closeModal = () => {
    setVisModal(false)
  }

  const onAbort = () => {
    dispatch(appActions.cleanData())
    history.push('/')
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidation('sektor')
    dispatch(formActions.set('sektor', e.target.value))
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidation('buctype')
    resetValidation('landkode')
    const buctype = event.target.value
    dispatch(formActions.set('buctype', buctype))
    dispatch(formActions.set('landkode', ''))
    dispatch(sakActions.getLandkoder(buctype))
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidation('sedtype')
    dispatch(formActions.set('sedtype', e.target.value))
  }

  const onLandkodeChange = (country: any) => {
    resetValidation('landkode')
    const landKode = country.value
    dispatch(formActions.set('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidation('institusjon')
    dispatch(formActions.set('institusjon', event.target.value))
  }

  const onTemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidation('tema')
    resetValidation('fagsaker')
    dispatch(formActions.set('tema', event.target.value))
    dispatch(formActions.set('fagsaker', undefined))
  }

  const onViewFagsakerClick = () => {
    dispatch(sakActions.getFagsaker(personer?.fnr, valgtSektor, valgtTema))
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    resetValidation('saksId')
    dispatch(formActions.set('saksId', event.target.value))
  }

  const getArbeidsforhold = () => {
    dispatch(sakActions.getArbeidsforhold(personer?.fnr))
  }

  const onArbeidsforholdClick = (item: any, checked: boolean) => {
    if (checked) {
      dispatch(formActions.addArbeidsforhold(item))
    } else {
      dispatch(formActions.removeArbeidsforhold(item))
    }
  }

  return (
    <TopContainer className='opprettsak'>
      <Ui.Nav.Row>
        <div className='col-sm-1' />
        <div className='col-sm-10'>
          <Ui.Nav.Systemtittel className='mb-4'>Opprett Sak</Ui.Nav.Systemtittel>
          <PersonSearch
            className='slideAnimate'
            validation={validation}
            resetValidation={resetValidation}
            onFnrChange={() => setIsFnrValid(false)}
            onPersonFound={() => setIsFnrValid(true)}
          />
          {personer ? (
            <Ui.Nav.Row>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0s' }}>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-sektor'
                  label={t('ui:label-sektor')}
                  disabled={!personer}
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
              <div className='col-xs-6' />
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
                  {_sedtyper ? _sedtyper.map((element: any) => (
                    <option value={element.kode} key={element.kode}>{element.kode} - {element.term}</option>)
                  ) : null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6 slideAnimate' style={{ animationDelay: '0.45s' }}>
                <Ui.CountrySelect
                  className='mb-4'
                  label={t('ui:label-landkode')}
                  lang='nb'
                  disabled={!isSomething(personer)}
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
              <div className='col-xs-12'>
                {valgtSektor === 'FB' ? <Family /> : null}
              </div>
              {valgtSektor ? (
                <div className='d-flex mt-4 ml-3 mr-3 w-100 slideAnimate' style={{ alignItems: 'flex-end' }}>
                  <div className='w-50 mr-3'>
                    <Ui.Nav.Select
                      id='id-behandlings-tema'
                      className='mb-4'
                      label={t('ui:label-tema')}
                      value={valgtTema}
                      onChange={onTemaChange}
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
                      <div>
                        <Ui.Nav.Lenke
                          className='mb-4'
                          href={serverInfo.gosysURL}
                          ariaLabel={t('ui:form-createNewCaseInGosys')}
                          target='_blank'
                        >
                          {t('ui:form-createNewCaseInGosys')}
                        </Ui.Nav.Lenke>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {visFagsakerListe ? (
                <div className='d-flex w-100'>
                  <div className='col-xs-6'>
                    <Ui.Nav.Select
                      id='id-fagsaker'
                      className='mb-4'
                      label={t('ui:label-fagsak')}
                      value={valgtSaksId}
                      onChange={onSakIDChange}
                    >
                      <option value=''>{t('ui:form-choose')}</option>
                      {fagsaker ? _.orderBy(fagsaker, 'fagsakNr').map(element => (
                        <option value={element.saksID} key={element.saksID}>{element.fagsakNr ? element.fagsakNr : element.saksID}</option>)
                      ) : null}
                    </Ui.Nav.Select>
                  </div>
                  <div className='col-xs-6' />
                </div>
              ) : null}
              {visArbeidsforhold ? (
                <>
                  <div className='col-xs-6 arbeidsforhold'>
                    <Ui.Nav.Row>
                      <div className='col-xs-6'>
                        <strong>{t('ui:label-aaResistered')}</strong><br />{t('ui:label-arbeidsforhold')}
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onArbeidsforholdClick(arbeidsforholdIDnav, e.target.checked)}
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
                  <Ui.Nav.AlertStripe type='suksess'>
                    <div>
                      {t('ui:form-caseNumber')}: {opprettetSak.rinasaksnummer}
                      {opprettetSak.url ? (
                        <Ui.Nav.Lenke href={opprettetSak.url} target='_blank' className='vedlegg__lenke'>
                          {t('ui:form-goToRina')}
                        </Ui.Nav.Lenke>
                      ) : null}
                      {opprettetSak.rinasaksnummer ? (
                        <Link to={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer}>
                          {t('ui:form-caseNumber') + ': ' + opprettetSak.rinasaksnummer}
                        </Link>
                      ) : <span>{t('ui:form-caseNumber') + ': ' + opprettetSak.rinasaksnummer}</span>}
                    </div>
                  </Ui.Nav.AlertStripe>
                </div>
              ) : null}
            </Ui.Nav.Row>
          ) : null}
          <AbortModal
            onAbort={onAbort}
            visModal={visModal}
            closeModal={closeModal}
          />
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

OpprettSak.propTypes = {
}

export default OpprettSak