import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, clearAsyncError, stopSubmit } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import { KodeverkSelectors } from '../ducks/kodeverk';
import PersonSok from './personsok';

import './opprettsak.css';

const uuid = require('uuid/v4');

class OpprettSak extends Component {
  skjemaSubmit = event => {
    event.preventDefault();
  }

  validerSok = erGyldig => (erGyldig ? this.props.validerFnrRiktig() : this.props.validerFnrFeil());

  render() {
    const {
      landkoder, sedtyper, sector, buctyper, fnr,
    } = this.props;

    return (
      <div className="opprettsak">
        <form onSubmit={this.skjemaSubmit}>
          <Nav.Container fluid>
            <Nav.Row>
              <Nav.Column xs="12">
                <PersonSok fnr={fnr} validerSok={this.validerSok} />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <p />
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
                    <Skjema.Select feltNavn="Land" label="Velg Land" bredde="s">
                      {landkoder && landkoder.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                </div>
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
  landkoder: PT.arrayOf(MPT.Kodeverk),
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  sector: PT.arrayOf(MPT.Kodeverk),
  buctyper: PT.arrayOf(MPT.Kodeverk),
  fnr: PT.string,
};
OpprettSak.defaultProps = {
  landkoder: undefined,
  sedtyper: undefined,
  sector: undefined,
  buctyper: undefined,
  fnr: '',
};

const skjemaSelector = formValueSelector('opprettSak');

const mapStateToProps = state => ({
  landkoder: KodeverkSelectors.landkoderSelector(state),
  sedtyper: KodeverkSelectors.sedtyperSelector(state),
  sector: KodeverkSelectors.sectorSelector(state),
  buctyper: KodeverkSelectors.buctyperSelector(state),
  fnr: skjemaSelector(state, 'fnr'),
});

const mapDispatchToProps = dispatch => ({
  validerFnrFeil: () => dispatch(stopSubmit('opprettSak', { fnr: 'Fant ingen treff på søket.' })),
  validerFnrRiktig: () => dispatch(clearAsyncError('opprettSak', 'fnr')),
});

// mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'opprettSak',
  onSubmit: () => {},
})(OpprettSak));
// export default OpprettSak;
