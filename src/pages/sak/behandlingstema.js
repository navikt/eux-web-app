import React from 'react';
import PT from 'prop-types';

import Ui from 'eessi-pensjon-ui'

import * as MPT from '../../proptypes';

const uuid = require('uuid/v4');

export const BehandlingsTemaer = props => {
  const { temaer, tema, oppdaterTemaListe } = props;

  return (
    <Ui.Nav.Select id="id-behandlings-tema" bredde="xxl" label="Velg behandlings tema" value={tema} onChange={oppdaterTemaListe}>
      <option defaultChecked />
      {temaer && temaer.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
    </Ui.Nav.Select>
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

