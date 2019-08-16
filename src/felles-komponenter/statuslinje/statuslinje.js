import React from 'react';
import { Link } from 'react-router-dom';
import PT from 'prop-types';
import * as Nav from '../../utils/navFrontend';

import './statuslinje.css';

const undertittelFraStatus = status => {
  switch (status) {
    case 'OK': { return 'Success'; }
    default: { return 'Feilet'; }
  }
};

const StatusLinje = ({
  status, tittel, rinaURL, routePath = null,
}) => {
  if (['NOT_STARTED', 'PENDING'].includes(status)) { return null; }

  const type = status === 'OK' ? 'suksess' : 'stopp';
  const urlLenke = rinaURL ? <Nav.Lenke href={rinaURL} target="_blank" className="vedlegg__lenke">Gå direkte til Rina.</Nav.Lenke> : null;
  const messageOK = routePath ? <Link to={routePath}>{tittel}</Link> : <span>{tittel}</span>;
  const statusTekst = status === 'OK' ? <div>{messageOK} er opprettet. &nbsp; {urlLenke}</div> : `${tittel} ${undertittelFraStatus(status)}`;

  return (
    <div className="statuslinje">
      <Nav.AlertStripe type={type}>{statusTekst}</Nav.AlertStripe>
    </div>
  );
};

StatusLinje.propTypes = {
  status: PT.string.isRequired,
  tittel: PT.string.isRequired,
  rinaURL: PT.string,
  routePath: PT.string,
};

StatusLinje.defaultProps = {
  rinaURL: '',
  routePath: null,
};

export default StatusLinje;
