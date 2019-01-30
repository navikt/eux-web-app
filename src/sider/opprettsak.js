import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, clearAsyncError, stopSubmit, change } from 'redux-form';
import PT from 'prop-types';
import * as Api from '../services/api';
import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';

import { KodeverkSelectors } from '../ducks/kodeverk';
import { RinasakOperations, RinasakSelectors } from '../ducks/rinasak';
import { FagsakSelectors } from '../ducks/fagsak';

import { StatusLinje } from '../felles-komponenter/statuslinje';
import FamilieRelasjonsComponent from '../felles-komponenter/skjema/PersonOgFamilieRelasjoner';
import PersonSok from './personsok';

import './opprettsak.css';
import { Arbeidsforhold, BehandlingsTemaer, Fagsaker } from './sak';

const uuid = require('uuid/v4');

const btnStyle = {
  margin: '1.85em 0 0 0',
};

class OpprettSak extends Component {
  state = {
    landKode: '',
    mottakerID: '',
    institusjoner: [],
    tema: '',
    fagsaker: [],
    saksid: '',
  };

  visFagsakerListe = () => (['FB', 'UB'].includes(this.props.valgtSektor) && this.state.tema.length > 0 && this.state.fagsaker.length > 0);
  visArbeidsforhold = () => {
    const { valgtSektor, buctype, sedtype } = this.props;
    return ['FB'].includes(valgtSektor) && ['FB_BUC_01'].includes(buctype) && sedtype;
  };
  oppdaterLandKode = event => {
    const landKode = event.target.value;
    const { buctype } = this.props;
    Api.Institusjoner.hent(buctype, landKode).then(institusjoner => {
      this.setState({ landKode, institusjoner });
    });
  };

  oppdaterInstitusjonKode = event => {
    const mottakerID = event.target.value;
    const { institusjoner } = this.state;
    this.setState({ mottakerID, institusjoner });
  };

  oppdaterTemaListe = event => {
    const tema = event.target.value;
    this.setState({ tema, fagsaker: [] });
  };

  oppdaterFagsakListe = event => {
    const saksid = event.target.value;
    this.setState({ saksid });
  };
  visFagsaker = () => {
    const { tema } = this.state;
    const { inntastetFnr: fnr, valgtSektor } = this.props;
    Api.Fagsaker.saksliste(fnr, valgtSektor.toLowerCase(), tema).then(fagsaker => {
      this.setState({ tema, fagsaker });
    });
  };
  skjemaSubmit = values => {
    const { submitFailed, sendSkjema } = this.props;
    const { mottakerID, landKode, saksid } = this.state;

    if (submitFailed) return;

    const vaskedeVerdier = {
      ...values, mottakerID, landKode, saksid,
    };
    delete vaskedeVerdier.fnrErGyldig;
    delete vaskedeVerdier.fnrErSjekket;

    sendSkjema(vaskedeVerdier);
  };

  overrideDefaultSubmit = event => {
    event.preventDefault();
  };

  validerFnr = erGyldig => {
    const { validerFnrRiktig, validerFnrFeil, settFnrGyldighet } = this.props;
    if (erGyldig) {
      validerFnrRiktig();
      settFnrGyldighet(true);
    } else {
      validerFnrFeil();
      settFnrGyldighet(false);
    }
  };

  erSedtyperGyldig = sedtyper => sedtyper && sedtyper.length > 0 && sedtyper[0];

  resettSokStatus = () => {
    const { settFnrGyldighet, settFnrSjekket } = this.props;
    settFnrGyldighet(null);
    settFnrSjekket(false);
  };

  render() {
    const {
      landkoder, sedtyper, sektor, buctyper, temar,
      inntastetFnr, status, errdata,
      valgtSektor,
      settFnrSjekket, settFnrGyldighet,
      fnrErGyldig, fnrErSjekket,
      opprettetSak,
    } = this.props;

    const { institusjoner } = this.state;

    const { rinasaksnummer, url: responsLenke } = opprettetSak;

    const { resettSokStatus } = this;

    const oppgittFnrErValidert = (fnrErGyldig && fnrErSjekket);

    return (
      <div className="opprettsak">
        <Nav.Systemtittel>Opprett Sak</Nav.Systemtittel>
        <form onSubmit={this.overrideDefaultSubmit}>
          <Nav.Container fluid>
            <Nav.Row className="">
              <Nav.Column xs="6">
                <PersonSok
                  inntastetFnr={inntastetFnr}
                  resettSokStatus={resettSokStatus}
                  settFnrSjekket={settFnrSjekket}
                  settFnrGyldighet={settFnrGyldighet}
                />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row className="">
              <Nav.Column xs="3">
                <Skjema.Select feltNavn="sektor" label="Fagområde" bredde="xl" disabled={!oppgittFnrErValidert}>
                  {sektor && sektor.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                </Skjema.Select>
              </Nav.Column>
            </Nav.Row>
            <Nav.Row className="">
              <Nav.Column xs="3">
                <Skjema.Select feltNavn="buctype" label="BUC" bredde="xxl" disabled={!oppgittFnrErValidert}>
                  {buctyper && buctyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                </Skjema.Select>
              </Nav.Column>
              <Nav.Column xs="3">
                <Skjema.Select feltNavn="sedtype" label="SED" bredde="xl" disabled={!oppgittFnrErValidert}>
                  {this.erSedtyperGyldig(sedtyper) && sedtyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                </Skjema.Select>
              </Nav.Column>
            </Nav.Row>
            <Nav.Row className="">
              <Nav.Column xs="3">
                <Nav.Select bredde="xl" disabled={!oppgittFnrErValidert} value={this.state.landKode} onChange={this.oppdaterLandKode} label="Land">
                  <option value="0" />
                  {landkoder && landkoder.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                </Nav.Select>
              </Nav.Column>
              <Nav.Column xs="3">
                <Nav.Select bredde="xl" disabled={!oppgittFnrErValidert} value={this.state.mottakerID} onChange={this.oppdaterInstitusjonKode} label="Mottaker institusjon">
                  <option value="0" />
                  {institusjoner && institusjoner.map(element => <option value={element.mottakerID} key={uuid()}>{element.mottakerID}</option>)}
                </Nav.Select>
              </Nav.Column>
            </Nav.Row>
            <Nav.Row className="">
              {valgtSektor === 'FB' && <FamilieRelasjonsComponent />}
            </Nav.Row>
            {['FB', 'UB'].includes(valgtSektor) && (
              <Nav.Row className="">
                <Nav.Column xs="3">
                  <BehandlingsTemaer temaer={temar} tema={this.state.tema} oppdaterTemaListe={this.oppdaterTemaListe} />
                </Nav.Column>
                <Nav.Column xs="2">
                  <Nav.Knapp style={btnStyle} onClick={this.visFagsaker} disabled={this.state.tema.length === 0}>Vis saker</Nav.Knapp>
                </Nav.Column>
              </Nav.Row>
            )}

            {this.visFagsakerListe() &&
              <Fagsaker fagsaker={this.state.fagsaker} saksid={this.state.saksid} oppdaterFagsakListe={this.oppdaterFagsakListe} />
            }

            {this.visArbeidsforhold() && (
              <Arbeidsforhold />
            )}
            <Nav.Row className="opprettsak__statuslinje">
              <Nav.Column xs="3">
                <Nav.Hovedknapp onClick={this.props.handleSubmit(this.skjemaSubmit)} spinner={['PENDING'].includes(status)} disabled={['PENDING'].includes(status)}>Opprett sak i RINA</Nav.Hovedknapp>
              </Nav.Column>
              <Nav.Column xs="1">
                &nbsp;
              </Nav.Column>
              <Nav.Column xs="3">
                <Nav.Lenke href="/" ariaLabel="Navigasjonslink tilbake til forsiden">
                  AVSLUTT
                </Nav.Lenke>
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column xs="6">
                <StatusLinje status={status} url={responsLenke} tittel={`Saksnummer: ${rinasaksnummer}`} />
                {errdata && errdata.status && <p>{errdata.message}</p>}
              </Nav.Column>
            </Nav.Row>
          </Nav.Container>
        </form>
      </div>
    );
  }
}
OpprettSak.propTypes = {
  validerFnrRiktig: PT.func.isRequired,
  validerFnrFeil: PT.func.isRequired,
  handleSubmit: PT.func.isRequired,
  sendSkjema: PT.func.isRequired,
  settFnrGyldighet: PT.func.isRequired,
  settFnrSjekket: PT.func.isRequired,
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
  valgteFamilieRelasjoner: PT.array,
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

const mapStateToProps = state => ({
  initialValues: {
    tilleggsopplysninger: {
      familierelasjoner: [],
    },
  },
  landkoder: KodeverkSelectors.landkoderSelector(state),
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
  status: RinasakSelectors.sakStatusSelector(state),
  errdata: RinasakSelectors.errorDataSakSelector(state),
  opprettetSak: RinasakSelectors.sakSelector(state),
  fagsaker: FagsakSelectors.fagsakerSelector(state),
});

const mapDispatchToProps = dispatch => ({
  validerFnrFeil: () => dispatch(stopSubmit('opprettSak', { fnr: 'Fant ingen treff på søket.' })),
  validerFnrRiktig: () => dispatch(clearAsyncError('opprettSak', 'fnr')),
  settFnrGyldighet: erGyldig => dispatch(change('opprettSak', 'fnrErGyldig', erGyldig)),
  settFnrSjekket: erSjekket => dispatch(change('opprettSak', 'fnrErSjekket', erSjekket)),
  sendSkjema: data => dispatch(RinasakOperations.sendSak(data)),
});

const validering = values => {
  const fnr = !values.fnr ? 'Du må taste inn fødselsnummer.' : null;
  const fnrErUgyldig = (values.fnrErGyldig === false && values.fnrErSjekket) ? 'Fødselsnummeret er ikke gyldig.' : null;
  const sektor = !values.sektor ? 'Du må velge sektor.' : null;
  const buctype = !values.buctype ? 'Du må velge buctype.' : null;
  const sedtype = !values.sedtype ? 'Du må velge sedtype.' : null;
  const land = !values.land ? 'Du må velge land.' : null;
  const mottakerID = !values.mottakerID ? 'Du må velge institusjon.' : null; // TODO Bytte med 'institusjonid'

  return {
    fnr: fnr || fnrErUgyldig,
    sektor,
    buctype,
    sedtype,
    land,
    mottakerID,
  };
};

// mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'opprettSak',
  onSubmit: () => {},
  validate: validering,
})(OpprettSak));
