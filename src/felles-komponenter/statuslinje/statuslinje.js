import React from 'react';
import PT from 'prop-types';
import * as Nav from '../../utils/navFrontend';

import './statuslinje.css';

const undertittelFraStatus = status => {
  switch (status) {
    case 'OK': { return 'Success'; }
    default: { return 'Feilet'; }
  }
};

const StatusLinje = ({ status, tittel, url }) => {
  if (['NOT_STARTED', 'PENDING'].includes(status)) { return null; }
  const type = status === 'OK' ? 'suksess' : 'stopp';
  const urlLenke = url ? <Nav.Lenke href={url} target="_blank" className="vedlegg__lenke">Gå direkte til Rina.</Nav.Lenke> : null;
  const statusTekst = status === 'OK' ? <div>{`${tittel} er opprettet.`} {urlLenke}</div> : `${tittel} ${undertittelFraStatus(status)}`;

  return (
    <div className="statuslinje">
      <Nav.AlertStripe type={type}>{statusTekst}</Nav.AlertStripe>
    </div>
  );
};

StatusLinje.propTypes = {
  status: PT.string.isRequired,
  tittel: PT.string.isRequired,
  url: PT.string,
};

StatusLinje.defaultProps = {
  url: '',
};

export default StatusLinje;
