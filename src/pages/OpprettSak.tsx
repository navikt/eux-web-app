import PersonFind from 'components/PersonFind/PersonFind'
import TopContainer from 'components/TopContainer/TopContainer'
import * as EKV from 'eessi-kodeverk'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { change, clearAsyncError, FormErrors, formValueSelector, reduxForm, stopSubmit } from 'redux-form'
import { FagsakSelectors } from '../ducks/fagsak'
import { KodeverkSelectors } from '../ducks/kodeverk'
import { LandkoderOperations, LandkoderSelectors } from '../ducks/landkoder'
import { RinasakOperations, RinasakSelectors } from '../ducks/rinasak'
import { ServerinfoSelectors } from '../ducks/serverinfo'
import * as Skjema from 'felles-komponenter/skjema'
import FamilieRelasjonsComponent from '../felles-komponenter/skjema/PersonOgFamilieRelasjoner'
import { StatusLinje } from '../felles-komponenter/statuslinje'
import AvsluttModal from '../komponenter/AvsluttModal'
import * as MPT from '../proptypes/'
import * as Api from '../services/api'
import './OpprettSak.css'
import { ArbeidsforholdController, BehandlingsTemaer, Fagsaker } from './sak'

const uuid = require('uuid/v4');

const btnStyle = {
  margin: '1.85em 0 0 0',
};

const sortBy = (key: any) => (a: any, b: any) => {
  if (a[key] > b[key]) return 1;
  return ((b[key] > a[key]) ? -1 : 0);
};

const OpprettSak: React.FC<any> = ({
  buctype, buctyper, errdata, fnrErGyldig, fnrErSjekket, handleSubmit,
  hentLandkoder, inntastetFnr, landkoder, opprettetSak,
  sedtype, sedtyper, sektor, sendSkjema, serverInfo, settBuctype,
  settFnrSjekket, settFnrGyldighet, status, submitFailed, temar, valgtSektor
}: any): JSX.Element => {

  const [landKode, setLandKode] = useState('')
  const [institusjonsID, setInstitusjonsID] = useState('')
  const [institusjoner, setInstitusjoner] = useState([])
  const [tema, setTema] = useState('')
  const [fagsaker, setFagsaker] = useState([])
  const [saksID, setSaksID] = useState('')
  const [visModal, setVisModal] = useState(false)

  const { rinasaksnummer, url: responsLenke } = opprettetSak
  const vedleggRoute = `/vedlegg?rinasaksnummer=${rinasaksnummer}`

  const erFagomroedeValgt = valgtSektor && valgtSektor.length > 0
  const erBUCValgt = !_.isNil(buctype)
  const erSEDValgt = !_.isNil(sedtype)
  const erLandValgt = landKode.length > 0
  const erMottakerInstitusjonValgt = institusjonsID.length > 0
  const erFagsakValgt = saksID.length > 0
  const redigerbart = erFagomroedeValgt && erBUCValgt && erSEDValgt && erLandValgt && erMottakerInstitusjonValgt && erFagsakValgt
  const oppgittFnrErValidert = (fnrErGyldig && fnrErSjekket)

  const visFagsakerListe = () => (valgtSektor.length > 0 && tema.length > 0 && fagsaker.length > 0)
  const visArbeidsforhold = () => (EKV.Koder.sektor.FB === valgtSektor && EKV.Koder.buctyper.family.FB_BUC_01 === buctype && sedtype)

  const oppdaterBucKode = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const buctype = event.target.value
    await settBuctype(buctype)
    await hentLandkoder(buctype)
    setLandKode('')
  }

  const oppdaterLandKode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const landKode = event.target.value
    Api.Institusjoner.hent(buctype, landKode).then(institusjoner => {
      setLandKode(landKode)
      setInstitusjoner(institusjoner)
    })
  }

  const oppdaterInstitusjonKode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const institusjonsID = event.target.value;
    setInstitusjonsID(institusjonsID)
  }

  const oppdaterTemaListe = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tema = event.target.value;
    setTema(tema)
    setFagsaker([])
  }

  const oppdaterFagsakListe = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const saksID = event.target.value;
    setSaksID(saksID)
  }

  const visFagsaker = async () => {
    const fagsaker = await Api.Fagsaker.hent(inntastetFnr, valgtSektor, tema);
    setFagsaker(fagsaker)
  }

  const skjemaSubmit = (values: any) => {
    if (submitFailed) return
    const vaskedeVerdier = {
      ...values, institusjonsID, landKode, saksID
    }
    delete vaskedeVerdier.fnrErGyldig
    delete vaskedeVerdier.fnrErSjekket
    sendSkjema(vaskedeVerdier)
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
                  <Skjema.Select id="id-sektor" feltNavn="sektor" label="Fagområde" bredde="xxl" disabled={!oppgittFnrErValidert}>
                    {sektor && sektor.concat().sort(sortBy('term')).map((element: any) => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                  </Skjema.Select>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row className="">
                <Ui.Nav.Column xs="3">
                  <Skjema.Select id="id-buctype" feltNavn="buctype" label="BUC" bredde="xxl" disabled={!oppgittFnrErValidert} onChange={oppdaterBucKode}>
                    {buctyper && buctyper.concat().sort(sortBy('kode')).map((element: any) => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                  </Skjema.Select>
                </Ui.Nav.Column>
                <Ui.Nav.Column xs="3">
                  <Skjema.Select id="id-sedtype" feltNavn="sedtype" label="SED" bredde="xxl" disabled={!oppgittFnrErValidert}>
                    {erSedtyperGyldig(sedtyper) && sedtyper.map((element: any) => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                  </Skjema.Select>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row className="">
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select id="id-landkode" bredde="xxl" disabled={!oppgittFnrErValidert} value={landKode} onChange={oppdaterLandKode} label="Land">
                    <option value="0" />
                    {landkoder && landkoder.concat().sort(sortBy('term')).map((element: any) => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Select id="id-institusjon" bredde="xxl" disabled={!oppgittFnrErValidert} value={institusjonsID} onChange={oppdaterInstitusjonKode} label="Mottaker institusjon">
                    <option value="0" />
                    {institusjoner && institusjoner.concat().sort(sortBy('term')).map((element: any) => <option value={element.institusjonsID} key={uuid()}>{element.navn}</option>)}
                  </Ui.Nav.Select>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row className="">
                {valgtSektor === 'FB' && <FamilieRelasjonsComponent />}
              </Ui.Nav.Row>
              {valgtSektor && (
                <Ui.Nav.Row className="">
                  <Ui.Nav.Column xs="3">
                    <BehandlingsTemaer temaer={temar} tema={tema} oppdaterTemaListe={oppdaterTemaListe} />
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
                    disabled={!redigerbart || ['PENDING'].includes(status)}
                    onClick={handleSubmit(skjemaSubmit)}
                    spinner={['PENDING'].includes(status)}>Opprett sak i RINA
                  </Ui.Nav.Hovedknapp>
                </Ui.Nav.Column>
                <Ui.Nav.Column xs="3">
                  <Ui.Nav.Flatknapp aria-label="Navigasjonslink tilbake til forsiden" onClick={() => openModal()} >
                    AVSLUTT UTFYLLING
                  </Ui.Nav.Flatknapp>
                </Ui.Nav.Column>
              </Ui.Nav.Row>
              <Ui.Nav.Row>
                <Ui.Nav.Column xs="6">
                  <StatusLinje status={status} tittel={`Saksnummer: ${rinasaksnummer}`} rinaURL={responsLenke} routePath={vedleggRoute} />
                  {errdata && errdata.status && <p>{errdata.message}</p>}
                </Ui.Nav.Column>
              </Ui.Nav.Row>
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
  serverInfo: MPT.ServerInfo.isRequired,
  validerFnrRiktig: PT.func.isRequired,
  validerFnrFeil: PT.func.isRequired,
  handleSubmit: PT.func.isRequired,
  sendSkjema: PT.func.isRequired,
  settFnrGyldighet: PT.func.isRequired,
  settFnrSjekket: PT.func.isRequired,
  settBuctype: PT.func.isRequired,
  hentLandkoder: PT.func.isRequired,
  submitFailed: PT.bool.isRequired,
  landkoder: PT.arrayOf(MPT.Kodeverk),
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  sedtype: PT.string,
  sektor: PT.arrayOf(MPT.Kodeverk),
  temar: PT.arrayOf(MPT.Kodeverk),
  buctyper: PT.arrayOf(MPT.Kodeverk),
  buctype: PT.string,
  fnrErGyldig: PT.bool,
  fnrErSjekket: PT.bool,
  inntastetFnr: PT.string,
  valgtSektor: PT.string,
  status: PT.string,
  errdata: PT.object,
  valgteFamilieRelasjoner: PT.arrayOf(PT.shape({
    rolle: PT.string,
    fnr: PT.string,
    fdato: PT.string,
    fornavn: PT.string,
    etternavn: PT.string,
    kjoenn: PT.string,
    nasjonalitet: PT.string,
  })),
  opprettetSak: PT.shape({
    rinasaksnummer: PT.string,
    url: PT.string,
  }),
};

OpprettSak.defaultProps = {
  landkoder: undefined,
  sedtyper: undefined,
  sedtype: undefined,
  sektor: undefined,
  temar: undefined,
  buctyper: undefined,
  buctype: undefined,
  fnrErGyldig: undefined,
  fnrErSjekket: undefined,
  inntastetFnr: '',
  valgtSektor: '',
  status: '',
  errdata: {},
  valgteFamilieRelasjoner: [],
  opprettetSak: {},
};

const skjemaSelector = formValueSelector('opprettSak');

const mapStateToProps = (state: any) => ({
  initialValues: {
    tilleggsopplysninger: {
      familierelasjoner: [],
      arbeidsforhold: [],
    },
  },
  serverInfo: ServerinfoSelectors.ServerinfoSelector(state),
  landkoder: LandkoderSelectors.landkoderSelector(state),
  sektor: KodeverkSelectors.sektorSelector(state),
  fnrErGyldig: skjemaSelector(state, 'fnrErGyldig'),
  fnrErSjekket: skjemaSelector(state, 'fnrErSjekket'),
  sedtyper: RinasakSelectors.sedtyperSelector(state),
  sedtype: skjemaSelector(state, 'sedtype'),
  buctype: skjemaSelector(state, 'buctype'),
  buctyper: RinasakSelectors.buctyperSelector(state),
  temar: FagsakSelectors.temaSelector(state),
  inntastetFnr: skjemaSelector(state, 'fnr'),
  valgtSektor: skjemaSelector(state, 'sektor'),
  valgteFamilieRelasjoner: skjemaSelector(state, 'tilleggsopplysninger.familierelasjoner'),
  valgteArbeidsforhold: skjemaSelector(state, 'tilleggsopplysninger.arbeidsforhold'),
  status: RinasakSelectors.sakStatusSelector(state),
  errdata: RinasakSelectors.errorDataSakSelector(state),
  opprettetSak: RinasakSelectors.sakSelector(state),
  fagsaker: FagsakSelectors.fagsakerSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  validerFnrFeil: () => dispatch(stopSubmit('opprettSak', { fnr: 'Fant ingen treff på søket.' })),
  validerFnrRiktig: () => dispatch(clearAsyncError('opprettSak', 'fnr')),
  settFnrGyldighet: (erGyldig: any) => dispatch(change('opprettSak', 'fnrErGyldig', erGyldig)),
  settFnrSjekket: (erSjekket: any) => dispatch(change('opprettSak', 'fnrErSjekket', erSjekket)),
  settBuctype: (buctype: any) => dispatch(change('opprettSak', 'buctype', buctype)),
  sendSkjema: (data: any) => dispatch(RinasakOperations.sendSak(data)),
  hentLandkoder: (buctype: any) => dispatch(LandkoderOperations.hent(buctype)),
});

const validering = (values: any): FormErrors<any, any> => {
  // const { fnr, sektor, sedtype, land, institusjonsID } = values;
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
  };
};

// mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'opprettSak',
  onSubmit: () => {},
  validate: validering,
})(OpprettSak));
