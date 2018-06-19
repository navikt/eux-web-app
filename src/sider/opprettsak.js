import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, clearAsyncError, stopSubmit, change } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';

import { StatusLinje } from '../felles-komponenter/statuslinje';
import { KodeverkSelectors } from '../ducks/kodeverk';
import PersonSok from './personsok';
import { eusakOperations, eusakSelectors } from '../ducks/eusak';

import './opprettsak.css';

const uuid = require('uuid/v4');


class OpprettSak extends Component {
  skjemaSubmit = values => {
    const { submitFailed, sendSkjema } = this.props;
    if (submitFailed) return;
    sendSkjema(values);
  };

  overrideDefaultSubmit = event => {
    event.preventDefault();
  };

  validerSok = (erGyldig, fnr) => {
    if (erGyldig) {
      this.props.validerFnrRiktig();
      // Todo: Flytt dispatch til mapDispatchToProps;
      this.props.dispatch(change('opprettSak', 'validertFnr', fnr));
    } else {
      this.props.validerFnrFeil();
      this.props.dispatch(change('opprettSak', 'validertFnr', ''));
    }
  }

  ugyldiggjorSok = () => {
    this.props.dispatch(change('opprettSak', 'validertFnr', ''));
  }

  render() {
    const {
      landkoder, sedtyper, sector, buctyper, institusjon,
      fnr, status,
    } = this.props;

    const { ugyldiggjorSok } = this;

    return (
      <div className="opprettsak">
        <form onSubmit={this.overrideDefaultSubmit}>
          <Nav.Container fluid>
            <Nav.Row>
              <Nav.Column xs="6">
                <PersonSok fnr={fnr} validerSok={this.validerSok} ugyldiggjorSok={ugyldiggjorSok} />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column xs="12">
                <div>
                  <Nav.Fieldset legend="Fagområde">
                    <Skjema.Select feltNavn="sector" label="Velg Fagområde" bredde="xl">
                      {sector && sector.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Type BUC">
                    <Skjema.Select feltNavn="buctype" label="Velg BUC Type" bredde="xl">
                      {buctyper && buctyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Type SED">
                    <Skjema.Select feltNavn="sedtype" label="Velg SED Type" bredde="xl">
                      {sedtyper && sedtyper.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Land">
                    <Skjema.Select feltNavn="land" label="Velg Land" bredde="s">
                      {landkoder && landkoder.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <Nav.Fieldset legend="Mottaker instutisjon">
                    <Skjema.Select feltNavn="institusjon" label="Velg Institusjon" bredde="xl">
                      {institusjon && institusjon.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                </div>
                <Nav.Knapp onClick={this.props.handleSubmit(this.skjemaSubmit)}>Opprett sak i RINA</Nav.Knapp>
                <StatusLinje status={status} tittel="Opprettet sak" />
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
  submitFailed: PT.bool.isRequired,
  landkoder: PT.arrayOf(MPT.Kodeverk),
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  sector: PT.arrayOf(MPT.Kodeverk),
  buctyper: PT.arrayOf(MPT.Kodeverk),
  institusjon: PT.arrayOf(MPT.Kodeverk),
  fnr: PT.string,
  status: PT.string,
};
OpprettSak.defaultProps = {
  landkoder: undefined,
  sedtyper: undefined,
  sector: undefined,
  buctyper: undefined,
  institusjon: undefined,
  fnr: '',
  status: '',
};

const skjemaSelector = formValueSelector('opprettSak');

const mapStateToProps = state => ({
  landkoder: KodeverkSelectors.landkoderSelector(state),
  sedtyper: KodeverkSelectors.sedtyperSelector(state),
  sector: KodeverkSelectors.sectorSelector(state),
  buctyper: KodeverkSelectors.buctyperSelector(state),
  institusjon: KodeverkSelectors.institusjonSelector(state),
  fnr: skjemaSelector(state, 'fnr'),
  status: eusakSelectors.EusakStatusSelector(state),
});

const mapDispatchToProps = dispatch => ({
  validerFnrFeil: () => dispatch(stopSubmit('opprettSak', { fnr: 'Fant ingen treff på søket.' })),
  validerFnrRiktig: () => dispatch(clearAsyncError('opprettSak', 'fnr')),
  sendSkjema: data => dispatch(eusakOperations.send(data)),
});

const validering = values => {
  let fnr = !values.fnr ? 'Du må taste inn fødselsnummer' : null;
  fnr = !values.validertFnr ? 'Husk å søke opp fødselsnummeret først.' : null;
  const sector = !values.sector ? 'Du må velge sektor' : null;
  const buctype = !values.buctype ? 'Du må velge buctype' : null;
  const sedtype = !values.sedtype ? 'Du må velge sedtype' : null;
  const land = !values.land ? 'Du må velge land' : null;
  const institusjon = !values.institusjon ? 'Du må velge institusjon' : null;

  return {
    fnr,
    sector,
    buctype,
    sedtype,
    land,
    institusjon,
  };
};

// mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'opprettSak',
  onSubmit: () => {},
  validate: validering,
})(OpprettSak));
// export default OpprettSak;
