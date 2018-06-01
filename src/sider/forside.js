import React from 'react';
import { withRouter } from 'react-router-dom';
import PT from 'prop-types';

// import withErrorHandling from '../hoc/withErrorHandling';
// import * as Nav from '../utils/navFrontend';


import './forside.css';

const Forside = props => {
  const { children } = props;
  return (
    <div className="forside">
      { children }
    </div>
  );
};

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
