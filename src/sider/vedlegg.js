import React, { Component } from 'react';
import PT from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Skjema from '../felles-komponenter/skjema';
import { StatusLinje } from '../felles-komponenter/statuslinje';
import * as Nav from '../utils/navFrontend';
import * as MPT from '../proptypes';

import { KodeverkSelectors } from '../ducks/kodeverk';
import { vedleggOperations, vedleggSelectors } from '../ducks/vedlegg';

import './vedlegg.css';

const uuid = require('uuid/v4');

class Vedlegg extends Component {
  render() {
    const {
      handleSubmit, sendSkjema, vedleggStatus, vedlegg, sedtyper,
    } = this.props;

    return (
      <div className="vedlegg">
        <Nav.Container fluid>
          <form onSubmit={handleSubmit(sendSkjema)}>
            <Nav.Row>
              <Nav.Column xs="6">
                <Nav.Panel className="vedlegg__skjema">
                  <Nav.Fieldset legend="Vedleggs informasjon">
                    <Nav.HjelpetekstBase id="journalPostID" type="under">Journalpost ID finner du i Gosys</Nav.HjelpetekstBase>
                    <Skjema.Input feltNavn="journalpostID" label="JournalpostID" />
                    <Nav.HjelpetekstBase id="dokumentID" type="under">Dokument ID finner du i Gosys</Nav.HjelpetekstBase>
                    <Skjema.Input feltNavn="dokumentID" label="DokumentID" />
                    <Nav.HjelpetekstBase id="saksnummer" type="under">Saksnummer finner du i RINA</Nav.HjelpetekstBase>
                    <Skjema.Input feltNavn="saksnummer" label="RINA Saksnummer" />
                    <Skjema.Select feltNavn="sedtype" label="Velg SED Type" bredde="xl">
                      {sedtyper && sedtyper.map(element => <option value={element.kode} key={uuid()}>{element.kode}-{element.term}</option>)}
                    </Skjema.Select>
                  </Nav.Fieldset>
                  <div className="vedlegg__submmit">
                    <Nav.Knapp onClick={this.sendVedlegg}>Send Vedlegg</Nav.Knapp>
                  </div>
                  <StatusLinje status={vedleggStatus} tittel="Vedlegget" />
                  <p>{vedlegg.data && JSON.parse(vedlegg.data).status}</p>
                </Nav.Panel>
              </Nav.Column>
            </Nav.Row>
          </form>
        </Nav.Container>
      </div>
    );
  }
}

Vedlegg.propTypes = {
  handleSubmit: PT.func.isRequired,
  sendSkjema: PT.func.isRequired,
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  vedleggStatus: PT.string.isRequired,
  vedlegg: PT.object,
};

Vedlegg.defaultProps = {
  sedtyper: undefined,
  vedlegg: {},
};

const mapStateToProps = state => ({
  vedleggStatus: vedleggSelectors.VedleggStatusSelector(state),
  vedlegg: vedleggSelectors.VedleggSelector(state),
  sedtyper: KodeverkSelectors.alleSEDtyperSelector(state),
});

const mapDispatchToProps = dispatch => ({
  sendSkjema: data => dispatch(vedleggOperations.send(data)),
});

const journalpostValidation = journalpostID => {
  if (!journalpostID) { return 'Du må taste inn en journalpostID'; }
  return null;
};

const form = {
  form: 'vedlegg',
  enableReinitialize: true,
  destroyOnUnmount: true,
  onSubmit: () => {},
  validate: values => {
    const journalpostID = journalpostValidation(values.journalpostID);
    const dokumentID = !values.dokumentID ? 'Du må taste inn en dokumentID' : null;
    const saksnummer = !values.saksnummer ? 'Du må taste inn et RINA saksnummer' : null;
    const sedtype = !values.sedtype ? 'Du må velge en SED fra listen' : null;
    return {
      journalpostID,
      dokumentID,
      saksnummer,
      sedtype,
    };
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(form)(Vedlegg));
