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

const StatusLinje = ({ status, tittel }) => {
  if (status === 'NOT_STARTED') { return null; }
  const type = status === 'OK' ? 'suksess' : 'stopp';

  return (
    <div className="statuslinje">
      <Nav.AlertStripe type={type}>{tittel} {undertittelFraStatus(status)}</Nav.AlertStripe>
    </div>
  );
};

StatusLinje.propTypes = {
  status: PT.string.isRequired,
  tittel: PT.string.isRequired,
};

export default StatusLinje;
