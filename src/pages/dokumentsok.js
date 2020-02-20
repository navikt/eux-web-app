import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import moment from 'moment/moment';

import Ui from 'eessi-pensjon-ui'
import * as Skjema from 'felles-komponenter/skjema';
import * as API from '../services/api';
import { DokumenterSelectors } from '../ducks/dokumenter';

import './dokumentsok.css';

const yyyMMdd = dato => moment(dato).format('YYYY-MM-DD');

const DokumentKort = ({ dokumenter }) => (
  <Ui.Nav.Panel className="dokumentsok__kort">
    <Skjema.Select id="id-rinadokument" feltNavn="rinadokumentID" label="Velg SED Type" bredde="xl">
      {dokumenter && dokumenter.map(element => <option value={element.rinadokumentID} key={element.rinadokumentID}>{element.kode} =&gt; {yyyMMdd(element.opprettetdato)}</option>)}
    </Skjema.Select>
  </Ui.Nav.Panel>
);
DokumentKort.propTypes = {
  dokumenter: PT.array,
};
DokumentKort.defaultProps = {
  dokumenter: [],
};
class DokumentSok extends Component {
  state = {
    searching: false,
  };

  sokEtterDokumenter = () => {
    const { inntastetRinasaksnummer, settRinaGyldighet, settRinaSjekket } = this.props;
    if (inntastetRinasaksnummer.length === 0) return;
    this.setState({ searching: true });
    API.Dokumenter.hent(inntastetRinasaksnummer).then(response => {
      this.setState({
        searching: false,
        nyttSok: true,
        rinadokumenter: response,
      });

      settRinaSjekket(true);
      if (response.length > 0) {
        settRinaGyldighet(true);
      }
    });
  };

  inntastetRinaSaksnummerHarBlittEndret = () => {
    this.setState({ rinadokumenter: [] });
    this.setState({ nyttSok: false });
  };
  render() {
    const { sokEtterDokumenter, inntastetRinaSaksnummerHarBlittEndret } = this;
    const { searching, rinadokumenter, nyttSok } = this.state;
    const harDokumenter = () => rinadokumenter && rinadokumenter.length;
    const harIngenDokumenter = () => rinadokumenter && rinadokumenter.length === 0;
    const dokumentKort = harDokumenter() ? <DokumentKort dokumenter={rinadokumenter} /> : null;
    const sokeStatus = (nyttSok && harIngenDokumenter()) ? <p>Ingen dokumenter funnet</p> : null;
    const visVenteSpinner = searching;
    return (
      <div className="dokumentsok">
        <div className="dokumentsok__skjema">
          <Skjema.Input
            label="RINA saksnummer"
            className="dokumentsok__input"
            bredde="XL"
            feltNavn="rinasaksnummer"
            onKeyUp={inntastetRinaSaksnummerHarBlittEndret}
          />
          <Ui.Nav.Knapp className="dokumentsok__knapp" onClick={sokEtterDokumenter} spinner={visVenteSpinner}>SØK</Ui.Nav.Knapp>
        </div>
        {dokumentKort}
        {sokeStatus}
      </div>
    );
  }
}
DokumentSok.propTypes = {
  searching: PT.bool,
  inntastetRinasaksnummer: PT.string,
  rinadokumenter: PT.array,
  settRinaGyldighet: PT.func.isRequired,
  settRinaSjekket: PT.func.isRequired,
};
DokumentSok.defaultProps = {
  searching: false,
  inntastetRinasaksnummer: '',
  rinadokumenter: [],
};

const mapStateToProps = state => ({
  rinadokumenter: DokumenterSelectors.dokumenterSelector(state),
});


export default connect(mapStateToProps, null)(DokumentSok);
