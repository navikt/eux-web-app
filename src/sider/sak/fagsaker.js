import React from 'react';

import PT from 'prop-types';

import * as Nav from '../../utils/navFrontend';

const uuid = require('uuid/v4');

const btnStyle = {
  margin: '1.85em 0 0 0',
};

const FagsakerListe = props => {
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

export const Fagsaker = props => {
  const { fagsaker, saksid, oppdaterFagsakListe } = props;
  return (

    <Nav.Row>
      <Nav.Column xs="3">
        <FagsakerListe fagsaker={fagsaker} saksid={saksid} oppdaterFagsakListe={oppdaterFagsakListe} />
      </Nav.Column>
      <Nav.Column xs="3" style={btnStyle} >
        <Nav.Lenke href="https://wasapp-t8.adeo.no/gosys/login.jsf?execution=e1s1" ariaLabel="Opprett ny sak i GOSYS" target="_blank">
          Opprett ny sak i GOSYS
        </Nav.Lenke>
      </Nav.Column>
    </Nav.Row>
  );
};

Fagsaker.propTypes = {
  saksid: PT.string,
  fagsaker: PT.array.isRequired,
  oppdaterFagsakListe: PT.func.isRequired,
};
Fagsaker.defaultProps = {
  saksid: '',
};
