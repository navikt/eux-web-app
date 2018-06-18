import React from 'react';
import PT from 'prop-types';

import * as Ikoner from '../../resources/images';
import { PanelHeader } from '..//panelHeader';

import './statuslinje.css';

const ikonFraStatus = status => {
  switch (status) {
    case 'OK': { return Ikoner.Ferdig; }
    default: { return Ikoner.Feil; }
  }
};

const undertittelFraStatus = status => {
  switch (status) {
    case 'OK': { return 'Success'; }
    default: { return 'Feilet'; }
  }
};

const StatusLinje = ({ status, tittel }) => {
  if (status === 'NOT_STARTED') {
    return null;
  }
  return (
    <div className="statuslinje">
      <PanelHeader ikon={ikonFraStatus(status)} tittel={tittel} undertittel={undertittelFraStatus(status)} />
    </div>
  );
};
StatusLinje.propTypes = {
  status: PT.string.isRequired,
  tittel: PT.string.isRequired,
};

export default StatusLinje;
