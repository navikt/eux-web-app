import React from 'react';

import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui'
import './Forside.css';

const Forside = () => (
  <div className="forside">
    <Ui.Nav.Container fluid>
      <Ui.Nav.Systemtittel>Velkommen til {process.env.REACT_APP_NAME}</Ui.Nav.Systemtittel>
      <br />
      <Ui.Nav.Row className="">
        <Ui.Nav.Column xs="3">
          <Ui.Nav.Lenkepanel href="/opprett">Opprett sak</Ui.Nav.Lenkepanel>
        </Ui.Nav.Column>
      </Ui.Nav.Row>
      <Ui.Nav.Row className="">
        <Ui.Nav.Column xs="3">
          <Ui.Nav.Lenkepanel href="/vedlegg">Legg ved vedlegg til SED</Ui.Nav.Lenkepanel>
        </Ui.Nav.Column>
      </Ui.Nav.Row>
    </Ui.Nav.Container>
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
