import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PT from 'prop-types';

import * as Nav from '../utils/navFrontend';
import * as Faner from '../felles-komponenter/faner';
import './forside.css';

class Forside extends Component {
  state = { faneIndex: 0 };
  handleChange = (event, index) => {
    this.setState({ faneIndex: index });
  };

  faneKomponentVelger = faneIndex => {
    let fane;
    switch (faneIndex) {
      case 0:
        fane = <Faner.Vedlegg />;
        break;
      case 1:
        fane = <Faner.OpprettSak />;
        break;
      default:
        fane = <Faner.OpprettSak />;
        break;
    }
    return fane;
  };

  render() {
    const tabs = [
      { label: 'Vedlegg' },
      { label: 'Opprett sak' },
    ];

    const fane = this.faneKomponentVelger(this.state.faneIndex);

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
export default withRouter(Forside);
