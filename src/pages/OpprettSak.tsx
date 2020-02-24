import * as formActions from 'actions/form'
import * as sakActions from 'actions/sak'
import AbortModal from 'components/AbortModal/AbortModal'
import PersonSearch from 'components/PersonSearch/PersonSearch'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import * as EKV from 'eessi-kodeverk'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ArbeidsforholdController } from '../components/sak'
import FamilieRelasjonsComponent from '../felles-komponenter/skjema/PersonOgFamilieRelasjoner'
import { StatusLinje } from '../felles-komponenter/statuslinje'
import './OpprettSak.css'

export interface OpprettSakProps {
  history: any;
}

export interface OpprettSakSelector {
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

  // entered data
  valgtBucType: state.form.buctype,
  valgtSedType: state.form.sedtype,
  valgtSektor: state.form.sektor,
  valgtLandkode: state.form.landkode,
  valgtInstitusjon: state.form.institusjon,
  valgtSaksId: state.form.saksId,
  valgtTema: state.form.tema,
  valgteFamilieRelasjoner: state.form.tilleggsopplysninger.familierelasjoner,
  valgteArbeidsforhold: state.form.tilleggsopplysninger.arbeidsforhold
})

/*
  buctyper: BucTyper | undefined;
  familierelasjoner: FamilieRelasjoner | undefined;
  kjoenn: Kjoenn | undefined;
  landkoder: Landkoder | undefined;
  sektor: Sektor | undefined;
  sedtyper: SedTyper | undefined;
  tema: Tema | undefined;
  kodemaps: Kodemaps | undefined;
}
 */

const OpprettSak: React.FC<OpprettSakProps> = ({ history } : OpprettSakProps): JSX.Element => {
  const {
    buctyper, sedtyper, fagsaker, institusjoner, kodemaps, landkoder, opprettetSak, personer, sektor, sendingSak,
    serverInfo, tema, valgtBucType, valgtInstitusjon, valgtLandkode, valgtSedType, valgtSektor, valgtSaksId, valgtTema,
  }: OpprettSakSelector = useSelector<State, OpprettSakSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [visModal, setVisModal] = useState(false)
  const [validation, setValidation] = useState<{[k: string]: any}>({})

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
  const redigerbart = isSomething(valgtSektor) && isSomething(valgtBucType) && isSomething(valgtSedType) && isSomething(valgtLandkode) && isSomething(valgtInstitusjon) && isSomething(valgtSaksId)
  const visFagsakerListe =  isSomething(valgtSektor) &&  isSomething(tema) &&  isSomething(fagsaker)
  const visArbeidsforhold = () => (EKV.Koder.sektor.FB === valgtSektor && EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && valgtSedType)

  const doValidation = (): any => {
    setValidation({
      sektor: !valgtSektor ? t('ui:validation-noSektor') : null,
      buctype: !valgtBucType ? t('ui:validation-noBuctype') : null,
      sedtype: !valgtSedType ? t('ui:validation-noSedtype') : null,
      land: !valgtLandkode ? t('ui:validation-noLand') : null,
      institusjonsID: !valgtInstitusjon ? t('ui:validation-noInstitusjonsID') : null,
    })
  }

  const isValid = (): boolean => {
    return _.find(_.values(validation), e => e !== null) !== undefined
  }

  const skjemaSubmit = (values: any) => {
    doValidation()
    if (!isValid()) return
    const vaskedeVerdier = {
      ...values, valgtInstitusjon, valgtLandkode, valgtSaksId
    }
    dispatch(sakActions.createSak(vaskedeVerdier))
  }

  const openModal = () => {
    setVisModal(true)
  }

  const closeModal = () => {
    setVisModal(false)
  }

  const onAbort = () => {
    dispatch({ type: types.APP_CLEAN_DATA })
    history.push('/')
  }

  const onSektorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(formActions.set('sektor', e.target.value))
  }

  const onBuctypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const buctype = event.target.value
    dispatch(formActions.set('buctype', buctype))
    dispatch(formActions.set('landkode', ''))
    dispatch(sakActions.getLandkoder(buctype))
  }

  const onSedtypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(formActions.set('sedtype', e.target.value))
  }

  const onLandkodeChange = (country: any) => {
    const landKode = country.value
    dispatch(formActions.set('landkode', landKode))
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const institusjon = event.target.value
    dispatch(formActions.set('institusjon', institusjon))
  }

  const onTemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tema = event.target.value
    dispatch(formActions.set('tema', tema))
    dispatch(formActions.set('fagsaker', []))
  }

  const onViewFagsakerClick = () => {
    dispatch(sakActions.getFagsaker(personer?.fnr, valgtSektor, valgtTema))
  }

  const onSakIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const saksId = event.target.value
    dispatch(formActions.set('saksId', saksId))
  }

  return (
    <TopContainer className='opprettsak'>
      <Ui.Nav.Row>
        <div className='col-sm-1' />
        <div className='col-sm-10'>
          <Ui.Nav.Systemtittel className='mb-4'>Opprett Sak</Ui.Nav.Systemtittel>
          <PersonSearch className='w-50' />
          {personer ? (
            <Ui.Nav.Row>
              <div className='col-xs-6'>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-sektor'
                  name='sektor'
                  label={t('ui:label-sektor')}
                  disabled={!personer}
                  onChange={onSektorChange}
                  value={valgtSektor}
                  feil={validation.sektor}
                >
                  <option value={''}>{t('ui:form-choose')}</option>)
                  {sektor ? _.orderBy(sektor, 'term').map((element: any) => (
                    <option value={element.kode} key={element.kode}>{element.term}</option>)
                  ): null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6'/>
              <div className='col-xs-6'>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-buctype'
                  name='buctype'
                  label={t('ui:label-buc')}
                  disabled={!isSomething(valgtSektor)}
                  onChange={onBuctypeChange}
                  value={valgtBucType}
                >
                  <option value={''}>{t('ui:form-choose')}</option>)
                  {_buctyper ? _.orderBy(_buctyper, 'kode').map((element: any) => (
                    <option value={element.kode} key={element.kode}>{element.kode}-{element.term}</option>)
                  ): null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6'>
                <Ui.Nav.Select
                  className='mb-4'
                  id='id-sedtype'
                  name='sedtype'
                  label={t('ui:label-sed')}
                  disabled={!isSomething(valgtBucType) || !isSomething(valgtSektor)}
                  onChange={onSedtypeChange}
                  value={valgtSedType}
                >
                  <option value={''}>{t('ui:form-choose')}</option>)
                  {_sedtyper ? _sedtyper.map((element: any) => (
                    <option value={element.kode} key={element.kode}>{element.kode}-{element.term}</option>)
                  ): null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-6'>
                <Ui.CountrySelect
                  className='mb-4'
                  label={t('ui:label-landkode')}
                  lang='nb'
                  disabled={!isSomething(personer)}
                  includeList={landkoder ? _.orderBy(landkoder, 'term').map((element: any) => element.kode) : []}
                  onOptionSelected={onLandkodeChange}
                />
              </div>
              <div className='col-xs-6'>
                <Ui.Nav.Select
                  id='id-institusjon'
                  disabled={!isSomething(valgtLandkode)}
                  value={valgtInstitusjon}
                  onChange={onInstitusjonChange}
                  label={t('ui:label-institusjon')}
                >
                  <option value={''}>{t('ui:form-choose')}</option>)
                  {institusjoner ? _.orderBy(institusjoner, 'term').map((element: any) => (
                    <option value={element.institusjonsID} key={element.institusjonsID}>{element.navn}</option>)
                  ): null}
                </Ui.Nav.Select>
              </div>
              <div className='col-xs-12'>
                {valgtSektor === 'FB' ? <FamilieRelasjonsComponent /> : null}
              </div>
              {valgtSektor ? (
                <div className='d-flex w-100' style={{alignItems: 'flex-end'}}>
                  <div className='w-50 mr-3'>
                    <Ui.Nav.Select
                      id="id-behandlings-tema"
                      label={t('ui:label-tema')}
                      value={valgtTema}
                      onChange={onTemaChange}
                    >
                      <option value={''}>{t('ui:form-choose')}</option>)
                      {temaer ? temaer.map((element: any) => (
                        <option value={element.kode} key={element.kode}>{element.term}</option>)
                      ) : null}
                    </Ui.Nav.Select>
                  </div>
                  <div className='w-50'>
                    <div className='d-flex' style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
                      <div>
                        <Ui.Nav.Knapp
                          onClick={onViewFagsakerClick}
                          disabled={!isSomething(valgtTema)}
                        >
                          {t('ui:form-seeCases')}
                        </Ui.Nav.Knapp>
                      </div>
                      <div>
                        <Ui.Nav.Lenke href={serverInfo.gosysURL} ariaLabel={t('ui:form-createNewCaseInGosys')} target='_blank'>
                          t('ui:form-createNewCaseInGosys')
                        </Ui.Nav.Lenke>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {visFagsakerListe ? (
                <Ui.Nav.Select
                  id="id-fagsaker"
                  label="Velg fagsak"
                  value={valgtSaksId}
                  onChange={onSakIDChange}
                >
                  <option value={''}>{t('ui:form-choose')}</option>
                  {fagsaker ? _.orderBy(fagsaker,'fagsakNr').map(element => (
                    <option value={element.saksID} key={element.saksID}>{element.fagsakNr ? element.fagsakNr : element.saksID}</option>)
                  ): null}
                </Ui.Nav.Select>
              ): null}
              {visArbeidsforhold ? (
                <ArbeidsforholdController fnr={personer.fnr}/>
              ): null}
              <div className='col-xs-6 opprettsak__statuslinje'>
                <Ui.Nav.Hovedknapp
                  disabled={!redigerbart || sendingSak}
                  onClick={skjemaSubmit}
                  spinner={sendingSak}
                >
                  {t('ui:form-createCaseInRina')}
                </Ui.Nav.Hovedknapp>
              </div>
              <div className='col-xs-6'>
                <Ui.Nav.Flatknapp aria-label='Navigasjonslink tilbake til forsiden' onClick={() => openModal()}>
                  AVSLUTT UTFYLLING
                </Ui.Nav.Flatknapp>
              </div>
              {opprettetSak && opprettetSak.url ? (
                <div className={'col-xs-12'}>
                  <StatusLinje status='OK' tittel={`Saksnummer: ${opprettetSak.rinasaksnummer}`}
                               rinaURL={opprettetSak.url}
                               routePath={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer}/>
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
        </Ui.Nav.Row>
      </TopContainer>
  )
}

OpprettSak.propTypes = {
}

export default OpprettSak
