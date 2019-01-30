import React from 'react';
import PT from 'prop-types';

import * as Nav from '../../utils/navFrontend';

const Ansettelse = props => {
  const { ansettelse: { arbeidsGiver, ansettelsesPeriode: { fom } } } = props;
  if (!props.ansettelse) {
    return null;
  }
  return (
    <Nav.Row>
      <Nav.Column xs="1">
        YY
      </Nav.Column>
      <Nav.Column xs="3">
        <strong>{arbeidsGiver}</strong><br />StartDato:&nbsp;{fom}
      </Nav.Column>
      <Nav.Column xs="2">
        KNAPP
      </Nav.Column>
    </Nav.Row>
  );
};

Ansettelse.propTypes = {
  ansettelse: PT.object,
  arbeidsGiver: PT.string,
  fom: PT.string,
};
Ansettelse.defaultProps = {
  ansettelse: {},
  arbeidsGiver: '',
  fom: undefined,
};

export default Ansettelse;
