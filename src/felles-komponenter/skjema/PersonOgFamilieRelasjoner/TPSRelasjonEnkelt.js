import React from 'react';
import PT from 'prop-types';

import { formatterDatoTilNorsk } from '../../../utils/dato';
import * as Nav from '../../../utils/navFrontend';
import PanelHeader from '../../panelHeader/panelHeader';
import * as Eux from '../../../felles-komponenter/Ikon';
import * as MPT from '../../../proptypes';

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
    <Nav.Panel border className="personsok__kort" data-cy="tpsrelasjon-kort">
      <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn} - ${rolle}`} undertittel={panelUndertittel} />
      <Nav.Knapp onClick={() => leggTilTPSrelasjon(relasjon)} className="familierelasjoner__knapp" data-cy="legg-til-tpsrelasjon-knapp">
        <Eux.Icon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
        <div className="familierelasjoner__knapp__label">Legg til</div>
      </Nav.Knapp>
    </Nav.Panel>
  );
};

TPSRelasjonEnkelt.propTypes = {
  kodeverk: PT.arrayOf(MPT.Kodeverk).isRequired,
  relasjon: MPT.FamilieRelasjon.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
};

export { TPSRelasjonEnkelt };
