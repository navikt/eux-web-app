import PT from 'prop-types';
import React from 'react';
import Ui from 'eessi-pensjon-ui'
import './UkjentSide.css';

/* eslint arrow-body-style:off */
const UkjentSide = ({ location }) => {
  /*
  const logdata = {
    message: 'Ukjent Side',
    data: {
      url: location.pathname,
    },
  };
  window.frontendlogger.error(logdata);
  */
  return (
    <Ui.Nav.AlertStripe type="stopp" className="ukjentSide">
      <Ui.Nav.Systemtittel>Denne siden finnes ikke: &quot;{location.pathname}&quot;.</Ui.Nav.Systemtittel>
      <p>Dersom du ble sendt hit fra Gosys eller et annet Nav-system, ta kontakt med driftsansvarlig.</p>
      <Ui.Nav.Lenke href="/" ariaLabel="Navigasjonslink tilbake til forsiden">
        Klikk her for å gå tilbake til forsiden
      </Ui.Nav.Lenke>
    </Ui.Nav.AlertStripe>
  );
};

UkjentSide.propTypes = {
  location: PT.object.isRequired,
};

export default UkjentSide;
