import React from 'react';
import PT from 'prop-types';

import * as Nav from '../../utils/navFrontend';

import * as MPT from '../../proptypes';

const uuid = require('uuid/v4');

export const BehandlingsTemaer = props => {
  const { temaer, tema, oppdaterTemaListe } = props;

  return (
    <Nav.Select bredde="xl" label="Velg tema" value={tema} onChange={oppdaterTemaListe}>
      <option defaultChecked />
      {temaer && temaer.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
    </Nav.Select>
  );
};
BehandlingsTemaer.propTypes = {
  tema: PT.string,
  temaer: PT.arrayOf(MPT.Kodeverk),
  oppdaterTemaListe: PT.func.isRequired,
};
BehandlingsTemaer.defaultProps = {
  tema: '',
  temaer: [],
};

export const FagsakerListe = props => {
  const { fagsaker, saksid, oppdaterFagsakListe } = props;
  return (
    <Nav.Select bredde="xl" label="Velg fagsak" value={saksid} onChange={oppdaterFagsakListe}>
      <option defaultChecked />
      {fagsaker && fagsaker.map(element => <option value={element.saksid} key={uuid()}>{element.tema.term}-{element.saksid}</option>)}
    </Nav.Select>
  );
};

FagsakerListe.propTypes = {
  saksid: PT.string,
  fagsaker: PT.array.isRequired,
  oppdaterFagsakListe: PT.func.isRequired,
};
FagsakerListe.defaultProps = {
  saksid: '',
};
