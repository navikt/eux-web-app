import React from 'react';
import PT  from 'prop-types';

import { formatterDatoTilNorsk } from '../../../utils/dato';
import Ui from 'eessi-pensjon-ui'
import PanelHeader from '../../panelHeader/panelHeader';
import * as Eux from '../../../felles-komponenter/Ikon';
import { KodeverkPropType, FamilieRelasjonPropType } from 'declarations/types.pt';

const FamilieRelasjonPanel = ({
  familierelasjonKodeverk,
  landKodeverk,
  relasjon: familie, slettRelasjon,
}) => {
  const {
    fornavn, etternavn, fnr, fdato, nasjonalitet, kjoenn,
  } = familie;

  const rolleObjekt = familierelasjonKodeverk.find(item => item.kode === familie.rolle);
  const nasjonalitetObjekt = landKodeverk.find(item => item.kode === nasjonalitet);

  const kodeverkObjektTilTerm = kodeverkObjekt => {
    if (!kodeverkObjekt || !kodeverkObjekt.term) { return '(mangler informasjon)'; }
    return Object.keys(kodeverkObjekt).includes('term') ? kodeverkObjekt.term : null;
  };

  const rolleTerm = kodeverkObjektTilTerm(rolleObjekt);
  const nasjonalitetTerm = kodeverkObjektTilTerm(nasjonalitetObjekt);

  const panelUndertittel = (
    <div className="panelheader__undertittel">
      <span>Fødselsnummer: {fnr}</span>
      <span>Fødselsdato: {formatterDatoTilNorsk(fdato)}</span>
      {nasjonalitetObjekt && <span>Nasjonalitet: {nasjonalitetTerm}</span>}
    </div>
  );
  const tittel = `${fornavn} ${etternavn}`.toUpperCase();
  return (
    <Ui.Nav.Panel border className="personsok__kort">
      <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${tittel} - ${rolleTerm}`} undertittel={panelUndertittel} />
      <Ui.Nav.Knapp
        className="familierelasjoner__knapp familierelasjoner__knapp--slett"
        onClick={() => slettRelasjon(familie.fnr)}>
        <Eux.Icon kind="trashcan" size="20" className="familierelasjoner__knapp__ikon" />
        <div className="familierelasjoner__knapp__label">Fjern</div>
      </Ui.Nav.Knapp>
    </Ui.Nav.Panel>
  );
};

FamilieRelasjonPanel.propTypes = {
  indeks: PT.number.isRequired,
  familierelasjonKodeverk: PT.arrayOf(KodeverkPropType).isRequired,
  landKodeverk: PT.arrayOf(KodeverkPropType).isRequired,
  relasjon: FamilieRelasjonPropType.isRequired,
  slettRelasjon: PT.func.isRequired,
};

export { FamilieRelasjonPanel };
