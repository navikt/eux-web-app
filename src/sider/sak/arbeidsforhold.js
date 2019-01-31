import React, { Component } from 'react';

import PT from 'prop-types';

import * as Nav from '../../utils/navFrontend';
import * as Api from '../../services/api';
import Ansettelse from './ansettelse';

const uuid = require('uuid/v4');

class Arbeidsforhold extends Component {
  state = {
    arbeidsforhold: [],
  };

  hentArbeidsforhold = async () => {
    const { fnr } = this.props;
    await Api.Arbeidsforhold.ansettelser(fnr).then(arbeidsforhold => {
      this.setState({ arbeidsforhold });
    });
  };

  render() {
    const { arbeidsforhold } = this.state;
    return (
      <div className="arbeidsforhold">
        <Nav.Row>
          <Nav.Column xs="3">
            <strong>AA Registeret</strong><br />Arbeidsforhold
          </Nav.Column>
          <Nav.Column xs="2">
            <Nav.Knapp onClick={this.hentArbeidsforhold}>Søk</Nav.Knapp>
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          &nbsp;
        </Nav.Row>
        {arbeidsforhold.length > 0 && arbeidsforhold.map(ansettelse => <Ansettelse key={uuid()} ansettelse={ansettelse} />)}
      </div>
    );
  }
}
Arbeidsforhold.propTypes = {
  arbeidshorhold: PT.array,
};
Arbeidsforhold.defaultProps = {
  arbeidshorhold: [],
};

export default Arbeidsforhold;
