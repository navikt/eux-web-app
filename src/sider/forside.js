import React from 'react';

import PT from 'prop-types';
import * as Nav from '../utils/navFrontend';

import './forside.css';

const Forside = () => (
  <div className="forside">
    <Nav.Container fluid>
      <Nav.Systemtittel>Velkommen til {process.env.REACT_APP_NAME}</Nav.Systemtittel>
      <br />
      <Nav.Row className="">
        <Nav.Column xs="3">
          <Nav.Lenkepanel href="/opprett">Opprett sak</Nav.Lenkepanel>
        </Nav.Column>
      </Nav.Row>
      <Nav.Row className="">
        <Nav.Column xs="3">
          <Nav.Lenkepanel href="/vedlegg">Legg ved vedlegg til SED</Nav.Lenkepanel>
        </Nav.Column>
      </Nav.Row>
    </Nav.Container>
  </div>
);

Forside.propTypes = {
  location: PT.object.isRequired,
  history: PT.object.isRequired,
  children: PT.node,
};

Forside.defaultProps = {
  children: null,
};
export default Forside;
