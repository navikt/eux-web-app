import React from 'react';
import PT from 'prop-types';

import * as Nav from '../utils/navFrontend';
import * as Eux from '../felles-komponenter/Ikon';
import * as MPT from '../proptypes';

import { formatterDatoTilNorsk } from '../utils/dato';
import PanelHeader from '../felles-komponenter/panelHeader/panelHeader';

const uuid = require('uuid/v4');

const PersonSokResultat = props => {
  const {
    person, rolle, knappDisabled, familierelasjonKodeverk, leggTilHandler, oppdaterFamilierelajon,
  } = props;
  const {
    kjoenn, fornavn, etternavn, fnr, fdato,
  } = person;

  const panelUndertittel = (
    <div className="panelheader__undertittel">
      <span>Fødselsnummer: {fnr}</span>
      <span>Fødselsdato: {formatterDatoTilNorsk(fdato)}</span>
    </div>
  );

  return (
    <Nav.Panel border className="personsok__kort" data-cy="annenpersonsok-kort">
      <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={panelUndertittel} />
      <Nav.Select
        id="id-familirelasjon-rolle"
        label="Familierelasjon"
        bredde="fullbredde"
        className="familierelasjoner__input"
        value={rolle}
        onChange={oppdaterFamilierelajon}
        data-cy="annenpersonsok-kort-nedtrekksliste">
        <option value="" disabled>- velg -</option>
        {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
      </Nav.Select>
      <Nav.Knapp disabled={knappDisabled} onClick={leggTilHandler} className="familierelasjoner__knapp" data-cy="annenpersonsok-kort-knapp">
        <Eux.Icon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
        <div className="familierelasjoner__knapp__label">Legg til</div>
      </Nav.Knapp>
    </Nav.Panel>
  );
};
PersonSokResultat.propTypes = {
  rolle: PT.string.isRequired,
  knappDisabled: PT.bool.isRequired,
  person: MPT.Person.isRequired,
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk).isRequired,
  leggTilHandler: PT.func.isRequired,
  oppdaterFamilierelajon: PT.func.isRequired,
};

export default PersonSokResultat;
