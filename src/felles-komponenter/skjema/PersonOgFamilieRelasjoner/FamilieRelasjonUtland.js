import React from 'react';
import PT from 'prop-types';

import * as Nav from '../../../utils/navFrontend';
import * as Eux from '../../../felles-komponenter/Ikon';
import * as MPT from '../../../proptypes';

import './familierelasjoner.css';

const uuid = require('uuid/v4');

const FamilieRelasjonUtland = ({
  spesialRelasjon, oppdaterState,
  kjoennKodeverk, landKodeverk, familierelasjonKodeverk,
  leggTilSpesialRelasjon, vaskInputDatoOgOppdater, kanSpesialRelasjonLeggesTil,
}) => (
  <div>

    <Nav.Fieldset className="familierelasjoner__utland" legend="Du kan også legge til familierelasjoner fra utlandet som ikke er oppført i TPS:">
      <Nav.Panel border className="familierelasjoner__utland__wrapper">
        <Nav.Row>
          <Nav.Column xs="3">
            <Nav.Input
              label="Utenlandsk ID"
              className="familierelasjoner__input"
              bredde="fullbredde"
              value={spesialRelasjon.fnr}
              onChange={event => oppdaterState('fnr', event)} />
          </Nav.Column>
          <Nav.Column xs="3">
            <Nav.Select
              label="Nasjonalitet"
              bredde="m"
              className="familierelasjoner__input"
              value={spesialRelasjon.nasjonalitet}
              onChange={event => oppdaterState('nasjonalitet', event)}>
              <option value="" disabled>- velg -</option>
              {landKodeverk && landKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
            </Nav.Select>
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column xs="3">
            <Nav.Input
              label="Fornavn"
              className="familierelasjoner__input"
              bredde="fullbredde"
              value={spesialRelasjon.fornavn}
              onChange={event => oppdaterState('fornavn', event)} />
          </Nav.Column>
          <Nav.Column xs="3">
            <Nav.Input
              label="Etternavn"
              className="familierelasjoner__input"
              bredde="fullbredde"
              value={spesialRelasjon.etternavn}
              onChange={event => oppdaterState('etternavn', event)} />
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column xs="3">
            <Nav.Select
              label="Kjønn"
              bredde="s"
              className="familierelasjoner__input"
              value={spesialRelasjon.kjoenn}
              onChange={event => oppdaterState('kjoenn', event)}>
              <option value="" disabled>- velg -</option>
              {kjoennKodeverk && kjoennKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
            </Nav.Select>
          </Nav.Column>
          <Nav.Column xs="3">
            <Nav.Input
              label="Fødselsdato (YYYY.MM.DD)"
              className="familierelasjoner__input"
              bredde="S"
              value={spesialRelasjon.fdato}
              onChange={event => oppdaterState('fdato', event)}
              onBlur={event => vaskInputDatoOgOppdater('fdato', event)} />
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column xs="3">
            <Nav.Select
              label="Familierelasjon"
              bredde="fullbredde"
              className="familierelasjoner__input"
              value={spesialRelasjon.rolle}
              onChange={event => oppdaterState('rolle', event)}>
              <option value="" disabled>- velg -</option>
              {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
            </Nav.Select>
          </Nav.Column>
          <Nav.Column xs="3">
            <Nav.Knapp onClick={leggTilSpesialRelasjon} disabled={!kanSpesialRelasjonLeggesTil()} className="spesialrelasjon familierelasjoner__knapp">
              <Eux.Icon kind="tilsette" size="18" className="familierelasjoner__knapp__ikon" />
              <div className="familierelasjoner__knapp__label">Legg til</div>
            </Nav.Knapp>
          </Nav.Column>
        </Nav.Row>
      </Nav.Panel>
    </Nav.Fieldset>
  </div>
);


FamilieRelasjonUtland.propTypes = {
  spesialRelasjon: PT.object.isRequired,
  oppdaterState: PT.func.isRequired,
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk),
  kjoennKodeverk: PT.arrayOf(MPT.Kodeverk),
  landKodeverk: PT.arrayOf(MPT.Kodeverk),
  leggTilSpesialRelasjon: PT.func.isRequired,
  vaskInputDatoOgOppdater: PT.func.isRequired,
  kanSpesialRelasjonLeggesTil: PT.func.isRequired,
};

FamilieRelasjonUtland.defaultProps = {
  familierelasjonKodeverk: [],
  kjoennKodeverk: [],
  landKodeverk: [],
};
export { FamilieRelasjonUtland };
