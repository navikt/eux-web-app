import React, { Component } from 'react';
import PT from 'prop-types';
import { change, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Skjema from 'felles-komponenter/skjema';
import { StatusLinje } from '../felles-komponenter/statuslinje';
import DokumentSok from './dokumentsok';
import Ui from 'eessi-pensjon-ui'
import * as MPT from '../proptypes';

import { KodeverkSelectors } from '../ducks/kodeverk';
import { RinavedleggOperations, RinavedleggSelectors } from '../ducks/rinavedlegg';
import { getParam } from '../utils/queryString';
import './Vedlegg.css';

class Vedlegg extends Component {
  componentDidMount() {
    const { location, oppdaterRinaSaksnummer } = this.props;
    const rinasaksnummer = getParam(location, 'rinasaksnummer');
    oppdaterRinaSaksnummer(rinasaksnummer);
  }

  overrideDefaultSubmit = event => {
    event.preventDefault();
  };
  render() {
    const {
      handleSubmit, sendSkjema, vedleggStatus, vedlegg, inntastetRinasaksnummer, rinadokumentID, settRinaGyldighet, settRinaSjekket, rinaNrErGyldig, rinaNrErSjekket,
    } = this.props;
    const responsLenke = vedlegg && vedlegg.url;
    const visVenteSpinner = ['PENDING'].includes(vedleggStatus);
    const disableSendKnapp = !(rinaNrErGyldig && rinaNrErSjekket && rinadokumentID);

    return (
      <div className="vedlegg">
        <Ui.Nav.Container fluid>
          <form onSubmit={this.overrideDefaultSubmit}>
            <Ui.Nav.Row>
              <Ui.Nav.Column xs="6">
                <Ui.Nav.Panel className="vedlegg__skjema">
                  <Ui.Nav.Fieldset legend="Vedleggs informasjon">
                    <Ui.Nav.HjelpetekstBase id="journalPostID" type="hoyre">Journalpost ID finner du i Gosys</Ui.Nav.HjelpetekstBase>
                    <Skjema.Input feltNavn="journalpostID" label="JournalpostID" />
                    <Ui.Nav.HjelpetekstBase id="dokumentID" type="under">Dokument ID finner du i Gosys</Ui.Nav.HjelpetekstBase>
                    <Skjema.Input feltNavn="dokumentID" label="DokumentID" />
                    <DokumentSok
                      inntastetRinasaksnummer={inntastetRinasaksnummer}
                      settRinaGyldighet={settRinaGyldighet}
                      settRinaSjekket={settRinaSjekket}
                    />
                  </Ui.Nav.Fieldset>
                  <div className="vedlegg__submmit">
                    <Ui.Nav.Hovedknapp
                      onClick={handleSubmit(sendSkjema)}
                      disabled={disableSendKnapp || visVenteSpinner}
                      spinner={visVenteSpinner}>Send vedlegg
                    </Ui.Nav.Hovedknapp>
                  </div>
                  <StatusLinje status={vedleggStatus} url={responsLenke} tittel="Vedlegget" />
                </Ui.Nav.Panel>
              </Ui.Nav.Column>
            </Ui.Nav.Row>
          </form>
        </Ui.Nav.Container>
      </div>
    );
  }
}

Vedlegg.propTypes = {
  location: PT.object.isRequired,
  sedtyper: PT.arrayOf(MPT.Kodeverk),
  rinaNrErGyldig: PT.bool,
  rinaNrErSjekket: PT.bool,
  vedlegg: PT.object,
  rinasaksnummer: PT.string,
  inntastetRinasaksnummer: PT.string,
  rinadokumentID: PT.string,
  // Funcs
  settRinaGyldighet: PT.func.isRequired,
  settRinaSjekket: PT.func.isRequired,
  vedleggStatus: PT.string.isRequired,
  handleSubmit: PT.func.isRequired,
  sendSkjema: PT.func.isRequired,
  oppdaterRinaSaksnummer: PT.func.isRequired,
};

Vedlegg.defaultProps = {
  sedtyper: undefined,
  vedlegg: {},
  rinasaksnummer: '',
  inntastetRinasaksnummer: '',
  rinadokumentID: '',
  rinaNrErGyldig: false,
  rinaNrErSjekket: false,
};

const skjemaSelector = formValueSelector('vedlegg');

const mapStateToProps = state => ({
  vedleggStatus: RinavedleggSelectors.vedleggStatusSelector(state),
  vedlegg: RinavedleggSelectors.vedleggSelector(state),
  sedtyper: KodeverkSelectors.alleSEDtyperSelector(state),
  inntastetRinasaksnummer: skjemaSelector(state, 'rinasaksnummer'),
  rinadokumentID: skjemaSelector(state, 'rinadokumentID'),
  rinaNrErGyldig: skjemaSelector(state, 'rinaNrErGyldig'),
  rinaNrErSjekket: skjemaSelector(state, 'rinaNrErSjekket'),
});

const mapDispatchToProps = dispatch => ({
  sendSkjema: data => dispatch(RinavedleggOperations.sendVedlegg(data)),
  oppdaterRinaSaksnummer: rinasaksnummer => dispatch(change('vedlegg', 'rinasaksnummer', rinasaksnummer)),
  settRinaGyldighet: erGyldig => dispatch(change('vedlegg', 'rinaNrErGyldig', erGyldig)),
  settRinaSjekket: erSjekket => dispatch(change('vedlegg', 'rinaNrErSjekket', erSjekket)),
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
    const rinadokumentID = !values.rinadokumentID ? 'Du må velge en SED' : null;
    return {
      journalpostID,
      dokumentID,
      saksnummer,
      rinadokumentID,
    };
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(form)(Vedlegg));
