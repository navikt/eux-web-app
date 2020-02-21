import React from 'react';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui'
import * as Eux from '../felles-komponenter/Ikon';
import { formatterDatoTilNorsk } from '../utils/dato';
import PanelHeader from '../felles-komponenter/panelHeader/panelHeader';
import { KodeverkPropType, PersonPropType } from '../declarations/types.pt';

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
    <Ui.Nav.Panel border className="personsok__kort">
      <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={panelUndertittel} />
      <Ui.Nav.Select
        id="id-familirelasjon-rolle"
        label="Familierelasjon"
        bredde="fullbredde"
        className="familierelasjoner__input"
        value={rolle}
        onChange={oppdaterFamilierelajon}>
        <option value="" disabled>- velg -</option>
        {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={element.kode}>{element.term}</option>)}
      </Ui.Nav.Select>
      <Ui.Nav.Knapp disabled={knappDisabled} onClick={leggTilHandler} className="familierelasjoner__knapp">
        <Eux.Icon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
        <div className="familierelasjoner__knapp__label">Legg til</div>
      </Ui.Nav.Knapp>
    </Ui.Nav.Panel>
  );
};
PersonSokResultat.propTypes = {
  rolle: PT.string.isRequired,
  knappDisabled: PT.bool.isRequired,
  person: PersonPropType.isRequired,
  familierelasjonKodeverk: PT.arrayOf(KodeverkPropType).isRequired,
  leggTilHandler: PT.func.isRequired,
  oppdaterFamilierelajon: PT.func.isRequired,
};

export default PersonSokResultat;
