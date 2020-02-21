import * as formActions from 'actions/form'
import * as sakActions from 'actions/sak'
import PersonFind from 'components/PersonFind/PersonFind'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import * as EKV from 'eessi-kodeverk'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import FamilieRelasjonsComponent from '../felles-komponenter/skjema/PersonOgFamilieRelasjoner'
import { StatusLinje } from '../felles-komponenter/statuslinje'
import AvsluttModal from '../komponenter/AvsluttModal'
import './OpprettSak.css'
import { ArbeidsforholdController, BehandlingsTemaer, Fagsaker } from './sak'

const btnStyle = {
  margin: '1.85em 0 0 0',
};

const sortBy = (key: any) => (a: any, b: any) => {
  if (a[key] > b[key]) return 1;
  return ((b[key] > a[key]) ? -1 : 0);
};

export interface OpprettSakSelector {
  allbuctyper: any;
  allsedtyper: any;
  fagsaker: any;
  fnrErGyldig: any;
  fnrErSjekket: any;
  inntastetFnr: any;
  institusjoner: any;
  kodemaps: any;
  landkoder: any;
  opprettetSak: any;
  sektor: any;
  sendingSak: boolean;
  serverInfo: any;
  valgtBucType: any;
  valgtSedType: any;
  valgtSektor: any;
  valgteFamilieRelasjoner: any;
  valgteArbeidsforhold: any;
}

const mapState =(state: State): OpprettSakSelector => ({
  allbuctyper: state.sak.buctyper,
  allsedtyper: state.sak.sedtyper,
  fagsaker: state.sak.fagsaker,
  fnrErGyldig:  state.form.fnrErGyldig,
  fnrErSjekket: state.form.fnrErSjekket,
  inntastetFnr: state.form.fnr,
  institusjoner: state.sak.institusjoner,
  kodemaps: state.sak.kodemaps,
  landkoder: state.sak.landkoder,
  opprettetSak: state.sak.opprettetSak,
  sektor: state.sak.sektor,
  sendingSak: state.loading.sendingSak,
  serverInfo: state.sak.serverinfo,
  valgtBucType: state.form.buctype,
  valgtSedType: state.form.sedtype,
  valgtSektor: state.form.sektor,
  valgteFamilieRelasjoner: state.form.tilleggsopplysninger.familierelasjoner,
  valgteArbeidsforhold: state.form.tilleggsopplysninger.arbeidsforhold
});

const OpprettSak: React.FC<any> = (): JSX.Element => {
  const {
    allbuctyper, allsedtyper, fagsaker, fnrErGyldig, fnrErSjekket, inntastetFnr, institusjoner, kodemaps, landkoder, opprettetSak,
    sektor, sendingSak, serverInfo, valgtBucType, valgtSedType, valgtSektor
  }: OpprettSakSelector = useSelector<State, OpprettSakSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [landKode, setLandKode] = useState('')
  const [institusjonsID, setInstitusjonsID] = useState('')
  const [tema, setTema] = useState('')
  const [saksID, setSaksID] = useState('')
  const [visModal, setVisModal] = useState(false)

  const temar = (!kodemaps ? [] : (!valgtSektor ? [] : tema[kodemaps.SEKTOR2FAGSAK[valgtSektor]]))
  const buctyper = (!kodemaps ? [] : (!valgtSektor ? [] : allbuctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor]]))
  let sedtyper =  (!kodemaps ? [] : (!valgtSektor ? [] : allbuctyper[kodemaps.SEKTOR2FAGSAK[valgtSektor][valgtBucType]]))
  if (!(sedtyper && sedtyper.length)) {
    sedtyper = []
  }
  sedtyper = sedtyper.reduce((acc: any, curr: any) => {
    const kode = allsedtyper?.find((elem: any) => elem.kode === curr)
    acc.push(kode)
    return acc
  }, [])

  const erFagomroedeValgt = valgtSektor && valgtSektor.length > 0
  const erBUCValgt = !_.isNil(valgtBucType)
  const erSEDValgt = !_.isNil(valgtSedType)
  const erLandValgt = landKode.length > 0
  const erMottakerInstitusjonValgt = institusjonsID.length > 0
  const erFagsakValgt = saksID.length > 0
  const redigerbart = erFagomroedeValgt && erBUCValgt && erSEDValgt && erLandValgt && erMottakerInstitusjonValgt && erFagsakValgt
  const oppgittFnrErValidert = (fnrErGyldig && fnrErSjekket)

  const visFagsakerListe = () => (valgtSektor?.length > 0 && tema?.length > 0 && fagsaker?.length > 0)
  const visArbeidsforhold = () => (EKV.Koder.sektor.FB === valgtSektor && EKV.Koder.buctyper.family.FB_BUC_01 === valgtBucType && valgtSedType)

  const oppdaterBucKode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const buctype = event.target.value
    dispatch(formActions.set('buctype', buctype))
    dispatch(sakActions.getLandkoder(buctype))
    setLandKode('')
  }

  const oppdaterLandKode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const landKode = event.target.value
    setLandKode(landKode)
    dispatch(sakActions.getInstitusjoner(valgtBucType, landKode))
  }

  const oppdaterInstitusjonKode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const institusjonsID = event.target.value;
    setInstitusjonsID(institusjonsID)
  }

  const oppdaterTemaListe = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tema = event.target.value;
    setTema(tema)
    dispatch(formActions.set('fagsaker', []))
  }

  const oppdaterFagsakListe = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const saksID = event.target.value;
    setSaksID(saksID)
  }

  const visFagsaker = () => {
    dispatch(sakActions.getFagsaker(inntastetFnr, valgtSektor, tema))
  }

  const validation = (): boolean => {
    /*// const { fnr, sektor, sedtype, land, institusjonsID } = values;
    const fnrValidNumberMsg = _.isNumber(values.fnr) ? 'Du må taste inn fødselsnummer.' : null;
    // const fnrErUgyldig = (values.fnrErGyldig === false && values.fnrErSjekket) ? 'Fødselsnummeret er ikke gyldig.' : null;
    const sektor = !values.sektor ? 'Du må velge sektor.' : null;
    const buctype = !values.buctype ? 'Du må velge buctype.' : null;
    const sedtype = !values.sedtype ? 'Du må velge sedtype.' : null;
    const land = !values.land ? 'Du må velge land.' : null;
    const institusjonsID = !values.institusjonsID ? 'Du må velge institusjon.' : null;

    return {
      fnr: fnrValidNumberMsg, // || fnrErUgyldig,
      sektor,
      buctype,
      sedtype,
      land,
      institusjonsID,
    };*/
    return true
  }

  const skjemaSubmit = (values: any) => {
    if (!validation()) return
    const vaskedeVerdier = {
      ...values, institusjonsID, landKode, saksID
    }
    delete vaskedeVerdier.fnrErGyldig
    delete vaskedeVerdier.fnrErSjekket
    dispatch(sakActions.createSak(vaskedeVerdier))
  }

  const overrideDefaultSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  const erSedtyperGyldig = (sedtyper: Array<any>): boolean => {
    return sedtyper && sedtyper.length > 0 && sedtyper[0]
  }

  const openModal = () => {
    setVisModal(true)
  }

  const closeModal = () => {
    setVisModal(false)
  }

  const settFnrGyldighet = (erGyldig: any) => {
    dispatch(formActions.set('fnrErGyldig', erGyldig))
  }

  const settFnrSjekket = (erSjekket: any) => {
    dispatch(formActions.set('fnrErSjekket', erSjekket))
  }

  return (
    <TopContainer className="opprettsak">
      <Ui.Nav.Row>
        <div className='col-sm-1' />
        <div className='col-sm-10'>
          <Ui.Nav.Systemtittel className='mb-4'>Opprett Sak</Ui.Nav.Systemtittel>
          <Ui.Nav.Row className="">
            <Ui.Nav.Column xs="6">
              <PersonFind
                inntastetFnr={inntastetFnr}
                settFnrSjekket={settFnrSjekket}
                settFnrGyldighet={settFnrGyldighet}
              />
            </Ui.Nav.Column>
          </Ui.Nav.Row>

          <form onSubmit={overrideDefaultSubmit}>
              <Ui.Nav.Row className="">
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select
                    id="id-sektor"
                    name="sektor"
                    label="Fagområde"
                    bredde="xxl"
                    disabled={!oppgittFnrErValidert}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => formActions.set('sektor', e.target.value)}
                    value={valgtSektor}
                  >
                     {sektor && sektor.concat().sort(sortBy('term')).map((element: any) => <option value={element.kode} key={element.kode}>{element.term}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row className="">
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select
                    id="id-buctype"
                    name="buctype"
                    label="BUC"
                    bredde="xxl"
                    disabled={!oppgittFnrErValidert}
                    onChange={oppdaterBucKode}
                    value={valgtBucType}
                  >
                    {buctyper && buctyper.concat().sort(sortBy('kode')).map((element: any) => <option value={element.kode} key={element.kode}>{element.kode}-{element.term}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select
                    id="id-sedtype"
                    name="sedtype"
                    label="SED"
                    bredde="xxl"
                    disabled={!oppgittFnrErValidert}
                    onChange={oppdaterBucKode}
                    value={valgtSedType}
                  >
                    {erSedtyperGyldig(sedtyper) && sedtyper.map((element: any) => <option value={element.kode} key={element.kode}>{element.kode}-{element.term}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row className="">
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select id="id-landkode" bredde="xxl" disabled={!oppgittFnrErValidert} value={landKode} onChange={oppdaterLandKode} label="Land">
                    <option value="0" />
                    {landkoder && landkoder.concat().sort(sortBy('term')).map((element: any) => <option value={element.kode} key={element.kode}>{element.term}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select id="id-institusjon" bredde="xxl" disabled={!oppgittFnrErValidert} value={institusjonsID} onChange={oppdaterInstitusjonKode} label="Mottaker institusjon">
                    <option value="0" />
                    {institusjoner && institusjoner.concat().sort(sortBy('term')).map((element: any) => <option value={element.institusjonsID} key={element.institusjonsID}>{element.navn}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row className="">
                {valgtSektor === 'FB' && <FamilieRelasjonsComponent />}
              </Ui.Nav.Row>
              {valgtSektor && (
                <Ui.Nav.Row className="">
                  <Ui.Nav.Column xs="3">
                    <BehandlingsTemaer temaer={temar as any} tema={tema} oppdaterTemaListe={oppdaterTemaListe} />
                  </Ui.Nav.Column>
                  <Ui.Nav.Column xs="2">
                    <Ui.Nav.Knapp style={btnStyle} onClick={visFagsaker} disabled={tema.length === 0}>Vis saker</Ui.Nav.Knapp>
                  </Ui.Nav.Column>
                  <Ui.Nav.Column xs="2">
                    <Ui.Nav.Lenke href={serverInfo.gosysURL} ariaLabel="Opprett ny sak i GOSYS" target="_blank">
                      Opprett ny sak i GOSYS
                    </Ui.Nav.Lenke>
                  </Ui.Nav.Column>
                </Ui.Nav.Row>
              )}

              {visFagsakerListe() &&
                <Fagsaker fagsaker={fagsaker} saksID={saksID} oppdaterFagsakListe={oppdaterFagsakListe} />
              }
              {visArbeidsforhold() &&
                <ArbeidsforholdController fnr={inntastetFnr} />
              }
              <Ui.Nav.Row className="opprettsak__statuslinje">
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Hovedknapp
                    disabled={!redigerbart || sendingSak}
                    onClick={skjemaSubmit}
                    spinner={sendingSak}
                  >
                    {t('ui:form-createCaseInRina')}
                  </Ui.Nav.Hovedknapp>
                </Ui.Nav.Column>
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Flatknapp aria-label="Navigasjonslink tilbake til forsiden" onClick={() => openModal()} >
                    AVSLUTT UTFYLLING
                  </Ui.Nav.Flatknapp>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
            {opprettetSak && opprettetSak.url ? (
              <Ui.Nav.Row>
                <Ui.Nav.Column xs="6">
                  <StatusLinje status='OK' tittel={`Saksnummer: ${opprettetSak.rinasaksnummer}`} rinaURL={opprettetSak.url} routePath={'/vedlegg?rinasaksnummer=' + opprettetSak.rinasaksnummer} />
                </Ui.Nav.Column>
              </Ui.Nav.Row>
            ) : null}
          </form>
          <AvsluttModal
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
