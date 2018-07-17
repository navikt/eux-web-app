import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, clearAsyncError, stopSubmit, change, FieldArray } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';

import { StatusLinje } from '../felles-komponenter/statuslinje';
import CustomFamilieRelasjoner from '../felles-komponenter/skjema/customFamileRelasjoner';
import { KodeverkSelectors } from '../ducks/kodeverk';
import PersonSok from './personsok';
import { RinasakOperations, RinasakSelectors } from '../ducks/rinasak';

import './opprettsak.css';

const uuid = require('uuid/v4');

const TilleggsOpplysninger = props => (<FieldArray name="tilleggsoplysninger.familierelasjoner" component={CustomFamilieRelasjoner} props={props} />);

const RinasaksNummer = ({ sak }) => {
  if (sak && !sak.rinasaksnummer) { return null; }
  return (
    <p>Rinasaksnummer: {sak.rinasaksnummer}</p>
  );
};
RinasaksNummer.propTypes = {
  sak: PT.shape({
    rinasaksnummer: PT.string,
  }).isRequired,
};
RinasaksNummer.defaultProps = {
  sak: {
    rinasaksnummer: '',
  },
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

  render() {
    const {
      familierelasjonKodeverk, landkoder, sedtyper, sektor, buctyper,
      inntastetFnr, status, sak,
      settFnrGyldighet, settFnrSjekket,
    } = this.props;

    return (
      <div className="opprettsak">
        <form onSubmit={this.overrideDefaultSubmit}>
          <Nav.Container fluid>
            <Nav.Row>
              <Nav.Column xs="6">
                <PersonSok inntastetFnr={inntastetFnr} settFnrGyldighet={settFnrGyldighet} settFnrSjekket={settFnrSjekket} />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column xs="6">
                <div>
                  <Nav.Fieldset legend="Fagområde">
                    <Skjema.Select feltNavn="sektor" label="Velg Fagområde" bredde="xl">
                      {sektor && sektor.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Type BUC">
                    <Skjema.Select feltNavn="buctype" label="Velg BUC Type" bredde="xxl">
                      {buctyper && buctyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Type SED">
                    <Skjema.Select feltNavn="sedtype" label="Velg SED Type" bredde="xl">
                      {this.erSedtyperGyldig(sedtyper) && sedtyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Land">
                    <Skjema.Select feltNavn="land" label="Velg Land" bredde="s">
                      {landkoder && landkoder.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Mottaker institusjon">
                    <Skjema.Input feltNavn="mottakerID" label="InstitusjonID" bredde="S" />
                  </Nav.Fieldset>
                </div>
                <Nav.Fieldset legend="Tilleggsopplysninger">
                  <Nav.Normaltekst>Fyll ut opplysninger om evt familierelasjoner.</Nav.Normaltekst>
                  <TilleggsOpplysninger familierelasjonKodeverk={familierelasjonKodeverk} />
                </Nav.Fieldset>
              </Nav.Column>
            </Nav.Row>
            <Nav.Row className="opprettsak__statuslinje">
              <Nav.Column xs="6">
                <Nav.Hovedknapp onClick={this.props.handleSubmit(this.skjemaSubmit)}>Opprett sak i RINA</Nav.Hovedknapp>
                <StatusLinje status={status} tittel="Opprettet sak" />
                <RinasaksNummer sak={sak} />
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
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk),
  landkoder: PT.arrayOf(MPT.Kodeverk),
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  sektor: PT.arrayOf(MPT.Kodeverk),
  buctyper: PT.arrayOf(MPT.Kodeverk),
  inntastetFnr: PT.string,
  status: PT.string,
  sak: PT.shape({
    rinasaksnummer: PT.string,
  }).isRequired,
};

OpprettSak.defaultProps = {
  familierelasjonKodeverk: undefined,
  landkoder: undefined,
  sedtyper: undefined,
  sektor: undefined,
  buctyper: undefined,
  inntastetFnr: '',
  status: '',
  sak: {
    rinasaksnummer: '',
  },
};

const skjemaSelector = formValueSelector('opprettSak');

const mapStateToProps = state => ({
  initialValues: {
    tilleggsoplysninger: {
      familierelasjoner: [],
    },
  },
  familierelasjonKodeverk: KodeverkSelectors.familierelasjonerSelector(state),
  landkoder: KodeverkSelectors.landkoderSelector(state),
  sektor: KodeverkSelectors.sektorSelector(state),
  sedtyper: RinasakSelectors.sedtypeSelector(state),
  buctyper: RinasakSelectors.buctyperSelector(state),
  inntastetFnr: skjemaSelector(state, 'fnr'),
  status: RinasakSelectors.sakStatusSelector(state),
  sak: RinasakSelectors.sakSelector(state),
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
  const fnrSokPaminnelse = !values.fnrErSjekket ? 'Husk å søke opp fødselsnummeret først.' : null;
  const fnrErUgyldig = !values.fnrErGyldig ? 'Fødselsnummeret er ikke gyldig.' : null;
  const sektor = !values.sektor ? 'Du må velge sektor.' : null;
  const buctype = !values.buctype ? 'Du må velge buctype.' : null;
  const sedtype = !values.sedtype ? 'Du må velge sedtype.' : null;
  const land = !values.land ? 'Du må velge land.' : null;
  const mottakerID = !values.mottakerID ? 'Du må velge institusjon.' : null;

  return {
    fnr: fnr || fnrSokPaminnelse || fnrErUgyldig,
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
