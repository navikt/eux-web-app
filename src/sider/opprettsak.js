import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, clearAsyncError, stopSubmit, change, FieldArray } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';

import { KodeverkSelectors } from '../ducks/kodeverk';
import { RinasakOperations, RinasakSelectors } from '../ducks/rinasak';

import { StatusLinje } from '../felles-komponenter/statuslinje';
import CustomFamilieRelasjoner from '../felles-komponenter/skjema/customFamileRelasjoner';
import PersonSok from './personsok';

import './opprettsak.css';

const uuid = require('uuid/v4');

const FamilieRelasjoner = ({ relasjoner }) => (
  <Nav.Panel border>
    <Nav.Fieldset legend="Familiemedlemmer SEDen angår:" className="familieRelasjoner">
      <div className="familieRelasjoner__liste">
        {relasjoner.length === 0 && <Nav.Panel className="familieRelasjoner__liste__tom">(Ingen familiemedlemmer er valgt. Velg fra listen nedenfor)</Nav.Panel>}
        <FieldArray name="tilleggsopplysninger.familierelasjoner" component={CustomFamilieRelasjoner} />
      </div>
    </Nav.Fieldset>
  </Nav.Panel>
);
FamilieRelasjoner.propTypes = {
  relasjoner: PT.arrayOf(MPT.FamilieRelasjon),
};
FamilieRelasjoner.defaultProps = {
  relasjoner: [],
};

class OpprettSak extends Component {
  skjemaSubmit = values => {
    const { submitFailed, sendSkjema } = this.props;
    if (submitFailed) return;

    const vaskedeVerdier = { ...values };
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
      landkoder, sedtyper, sektor, buctyper,
      inntastetFnr, status, errdata, institusjoner,
      valgtSektor, valgteFamilieRelasjoner,
      settFnrSjekket, settFnrGyldighet,
      fnrErGyldig, fnrErSjekket,
      opprettetSak,
    } = this.props;

    const { rinasaksnummer, url: responsLenke } = opprettetSak;

    const { resettSokStatus } = this;

    const oppgittFnrErValidert = (fnrErGyldig && fnrErSjekket);

    return (
      <div className="opprettsak">
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
              <Nav.Column xs="10">
                <div>
                  <Nav.Fieldset legend="Fagområde">
                    <Skjema.Select feltNavn="sektor" label="Velg Fagområde" bredde="xl" disabled={!oppgittFnrErValidert}>
                      {sektor && sektor.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Type BUC">
                    <Skjema.Select feltNavn="buctype" label="Velg BUC Type" bredde="xxl" disabled={!oppgittFnrErValidert}>
                      {buctyper && buctyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Type SED">
                    <Skjema.Select feltNavn="sedtype" label="Velg SED Type" bredde="xl" disabled={!oppgittFnrErValidert}>
                      {this.erSedtyperGyldig(sedtyper) && sedtyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Land">
                    <Skjema.Select feltNavn="land" label="Velg Land" bredde="s" disabled={!oppgittFnrErValidert}>
                      {landkoder && landkoder.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Mottaker institusjon">
                    <Skjema.Select feltNavn="mottakerID" label="Velg InstitusjonID" bredde="s" disabled={!oppgittFnrErValidert}>
                      {institusjoner && institusjoner.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                </div>
                {valgtSektor.includes('FB') && <FamilieRelasjoner relasjoner={valgteFamilieRelasjoner} />}
              </Nav.Column>
            </Nav.Row>
            <Nav.Row className="opprettsak__statuslinje">
              <Nav.Column xs="10">
                <Nav.Hovedknapp onClick={this.props.handleSubmit(this.skjemaSubmit)} spinner={['PENDING'].includes(status)} disabled={['PENDING'].includes(status)}>Opprett sak i RINA</Nav.Hovedknapp>
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
  institusjoner: PT.arrayOf(MPT.Kodeverk),
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  sektor: PT.arrayOf(MPT.Kodeverk),
  buctyper: PT.arrayOf(MPT.Kodeverk),
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
  institusjoner: undefined,
  sedtyper: undefined,
  sektor: undefined,
  buctyper: undefined,
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
  institusjoner: KodeverkSelectors.institusjonerSelector(state),
  sektor: KodeverkSelectors.sektorSelector(state),
  fnrErGyldig: skjemaSelector(state, 'fnrErGyldig'),
  fnrErSjekket: skjemaSelector(state, 'fnrErSjekket'),
  sedtyper: RinasakSelectors.sedtypeSelector(state),
  buctyper: RinasakSelectors.buctyperSelector(state),
  inntastetFnr: skjemaSelector(state, 'fnr'),
  valgtSektor: skjemaSelector(state, 'sektor'),
  valgteFamilieRelasjoner: skjemaSelector(state, 'tilleggsopplysninger.familierelasjoner'),
  status: RinasakSelectors.sakStatusSelector(state),
  errdata: RinasakSelectors.errorDataSakSelector(state),
  opprettetSak: RinasakSelectors.sakSelector(state),
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
  const mottakerID = !values.mottakerID ? 'Du må velge institusjon.' : null;

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
