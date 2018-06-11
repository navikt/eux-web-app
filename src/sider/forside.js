import React from 'react';

import PT from 'prop-types';
import * as NAV from '../utils/navFrontend';
import './forside.css';

const Forside = () => (
  <div className="forside">
    <h3>Velkommen til EUX</h3>
    <NAV.Lenkepanel href="/vedlegg">Legg ved vedlegg til SED</NAV.Lenkepanel>
    <NAV.Lenkepanel href="/opprett">Opprett sak</NAV.Lenkepanel>
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
