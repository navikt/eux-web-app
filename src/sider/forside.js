import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PT from 'prop-types';

// import withErrorHandling from '../hoc/withErrorHandling';
import * as Nav from '../utils/navFrontend';

import Vedlegg from '../felles-komponenter/faner/vedlegg';
import OpprettSak from '../felles-komponenter/faner/opprettSak';

import './forside.css';

class Forside extends Component {
  state = { faneIndex: 0 }
  handleChange = (event, index) => {
    this.setState({faneIndex: index})
  };

  render() {
    const tabs = [
      { label: 'Vedlegg' },
      { label: 'Opprett sak' },
      { label: 'Svar på SED' },
    ];

    const fane = this.state.faneIndex === 0 ? <Vedlegg/> : <OpprettSak/>

    return (
      <div className="forside">
        <Nav.Tabs tabs={tabs} onChange={this.handleChange} />
        <div>
          {fane}
        </div>
      </div>
    );
  }
}

Forside.propTypes = {
  location: PT.object.isRequired,
  history: PT.object.isRequired,
  children: PT.node,
};

Forside.defaultProps = {
  children: null,
};
/*
const kontekster = [
  { navn: 'saksbehandler', melding: 'Det har oppstått en feil: Kunne ikke hente saksbehandler.' },
  { navn: 'fagsaker', melding: 'Det har oppstått en feil: Kunne ikke hente fagsaker' },
];
export default withErrorHandling(kontekster, withRouter(Forside));
*/
export default withRouter(Forside);
