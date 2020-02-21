import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

const FagsakerListe = props => {
  const { fagsaker, saksID, oppdaterFagsakListe } = props;
  return (
    <Ui.Nav.Select id="id-fagsaker" bredde="xl" label="Velg fagsak" value={saksID} onChange={oppdaterFagsakListe}>
      <option defaultChecked />
      {fagsaker ? _.orderBy(fagsaker,'fagsakNr').map(element => <option value={element.saksID} key={element.saksID}>{element.fagsakNr ? element.fagsakNr : element.saksID}</option>) : null}
    </Ui.Nav.Select>
  );
};

FagsakerListe.propTypes = {
  saksID: PT.string,
  fagsaker: PT.array.isRequired,
  oppdaterFagsakListe: PT.func.isRequired,
};
FagsakerListe.defaultProps = {
  saksID: '',
};

export const Fagsaker = props => {
  const { fagsaker, saksID, oppdaterFagsakListe } = props;
  return (

    <Ui.Nav.Row>
      <Ui.Nav.Column xs="3">
        <FagsakerListe fagsaker={fagsaker} saksID={saksID} oppdaterFagsakListe={oppdaterFagsakListe} />
      </Ui.Nav.Column>
    </Ui.Nav.Row>
  );
};

Fagsaker.propTypes = {
  saksID: PT.string,
  fagsaker: PT.array.isRequired,
  oppdaterFagsakListe: PT.func.isRequired,
};
Fagsaker.defaultProps = {
  saksID: '',
};
