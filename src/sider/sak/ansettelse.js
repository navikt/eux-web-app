import React from 'react';

import PT from 'prop-types';
import * as Ikoner from '../../resources/images/index';
import * as Nav from '../../utils/navFrontend';
import { formatterDatoTilNorsk } from '../../utils/dato';

const Ansettelse = props => {
  const { ansettelse: { arbeidsGiver, ansettelsesPeriode: { fom, tom } } } = props;
  if (!props.ansettelse) {
    return null;
  }
  return (
    <Nav.Row>
      <Nav.Column xs="1" style={{ width: '5%' }}>
        <div className="panelheader__ikon" style={{ marginTop: '0.25em', backgroundImage: `url('${Ikoner.Arbeidsforhold}')` }} />
      </Nav.Column>
      <Nav.Column xs="2" style={{ width: '20%' }}>
        <strong>{arbeidsGiver}</strong><br />StartDato:&nbsp;{formatterDatoTilNorsk(fom)}<br />SluttDato:&nbsp;{formatterDatoTilNorsk(tom)}
      </Nav.Column>
      <Nav.Column xs="1">
        KNAPP
      </Nav.Column>
    </Nav.Row>
  );
};

Ansettelse.propTypes = {
  ansettelse: PT.object,
  arbeidsGiver: PT.string,
  fom: PT.string,
  tom: PT.string,
};
Ansettelse.defaultProps = {
  ansettelse: {},
  arbeidsGiver: '',
  fom: undefined,
  tom: undefined,
};

export default Ansettelse;
