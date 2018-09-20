import React from 'react';
import PT from 'prop-types';

import { formatterDatoTilNorsk } from '../../../utils/dato';
import * as Nav from '../../../utils/navFrontend';
import PanelHeader from '../../panelHeader/panelHeader';
import { IkonFraKjonn } from '../../IkonFraKjonn';
import * as MPT from '../../../proptypes';

const AnnenRelatertTPSPerson = ({ person, leggTilTPSrelasjon }) => {
  const {
    fnr, fdato, fornavn, etternavn, kjoenn,
  } = person;

  const panelUndertittel = (
    <div className="panelheader__undertittel">
      <span>Fødselsnummer: {fnr}</span>
      <span>Fødselsdato: {formatterDatoTilNorsk(fdato)}</span>
    </div>
  );

  return (
    <Nav.Panel border className="personsok__kort">
      <PanelHeader ikon={IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={panelUndertittel} />
      <Nav.Knapp onClick={() => leggTilTPSrelasjon(person)} className="familierelasjoner__knapp">
        <Nav.Ikon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
        <div className="familierelasjoner__knapp__label">Legg til</div>
      </Nav.Knapp>
    </Nav.Panel>
  );
};

AnnenRelatertTPSPerson.propTypes = {
  person: MPT.Person.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
};

export { AnnenRelatertTPSPerson };
