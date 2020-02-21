import React from 'react';
import PT from 'prop-types';

import { formatterDatoTilNorsk } from '../../../utils/dato';
import Ui from 'eessi-pensjon-ui'
import PanelHeader from '../../panelHeader/panelHeader';
import * as Eux from '../../../felles-komponenter/Ikon';
import { KodeverkPropType, FamilieRelasjonPropType } from 'declarations/types.pt';

const TPSRelasjonEnkelt = ({ kodeverk, relasjon, leggTilTPSrelasjon }) => {
  const {
    fnr, fdato, fornavn, etternavn, kjoenn, rolle: kode,
  } = relasjon;
  const rolle = kodeverk.find(elem => elem.kode === kode).term;

  const panelUndertittel = (
    <div className="panelheader__undertittel">
      <span>Fødselsnummer: {fnr}</span>
      <span>Fødselsdato: {formatterDatoTilNorsk(fdato)}</span>
    </div>
  );

  return (
    <Ui.Nav.Panel border className="personsok__kort">
      <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn} - ${rolle}`} undertittel={panelUndertittel} />
      <Ui.Nav.Knapp onClick={() => leggTilTPSrelasjon(relasjon)} className="familierelasjoner__knapp">
        <Eux.Icon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
        <div className="familierelasjoner__knapp__label">Legg til</div>
      </Ui.Nav.Knapp>
    </Ui.Nav.Panel>
  );
};

TPSRelasjonEnkelt.propTypes = {
  kodeverk: PT.arrayOf(KodeverkPropType).isRequired,
  relasjon: FamilieRelasjonPropType.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
};

export { TPSRelasjonEnkelt };
