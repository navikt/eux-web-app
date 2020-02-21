import React from 'react';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui'
import { KodeverkPropType } from '../../declarations/types.pt';

export const BehandlingsTemaer = ({ temaer, tema, oppdaterTemaListe }) => {

  return (
    <Ui.Nav.Select id="id-behandlings-tema" bredde="xxl" label="Velg behandlings tema" value={tema} onChange={oppdaterTemaListe}>
      <option defaultChecked />
      {temaer && temaer.map(element => <option value={element.kode} key={element.kode}>{element.term}</option>)}
    </Ui.Nav.Select>
  );
};
BehandlingsTemaer.propTypes = {
  tema: PT.string,
  temaer: PT.arrayOf(KodeverkPropType),
  oppdaterTemaListe: PT.func.isRequired,
};
BehandlingsTemaer.defaultProps = {
  tema: '',
  temaer: [],
};

