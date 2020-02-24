import React from 'react';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui'
import './FamilieRelasjonUtland.css';
import { KodeverkPropType } from 'declarations/types.pt';

const FamilieRelasjonUtland = ({
  spesialRelasjon, oppdaterState,
  kjoennKodeverk, landKodeverk, filtrerteFamilieRelasjoner,
  leggTilSpesialRelasjon, vaskInputDatoOgOppdater, kanSpesialRelasjonLeggesTil,
}) => (
  <div>

    <Ui.Nav.Fieldset className="familierelasjoner__utland" legend="Du kan også legge til familierelasjoner fra utlandet som ikke er oppført i TPS:">
      <Ui.Nav.Panel border className="familierelasjoner__utland__wrapper">
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Input
              label="Utenlandsk ID"
              className="familierelasjoner__input"
              bredde="fullbredde"
              value={spesialRelasjon.fnr}
              onChange={event => oppdaterState('fnr', event)} />
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Select
              id="id-nasjonalitet"
              label="Nasjonalitet"
              bredde="m"
              className="familierelasjoner__input"
              value={spesialRelasjon.nasjonalitet}
              onChange={event => oppdaterState('nasjonalitet', event)}>
              <option value="" disabled>- velg -</option>
              {landKodeverk && landKodeverk.map(element => <option value={element.kode} key={element.kode}>{element.term}</option>)}
            </Ui.Nav.Select>
          </Ui.Nav.Column>
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Input
              label="Fornavn"
              className="familierelasjoner__input"
              bredde="fullbredde"
              value={spesialRelasjon.fornavn}
              onChange={event => oppdaterState('fornavn', event)} />
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Input
              label="Etternavn"
              className="familierelasjoner__input"
              bredde="fullbredde"
              value={spesialRelasjon.etternavn}
              onChange={event => oppdaterState('etternavn', event)} />
          </Ui.Nav.Column>
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Select
              id="id-kjoenn"
              label="Kjønn"
              bredde="s"
              className="familierelasjoner__input"
              value={spesialRelasjon.kjoenn}
              onChange={event => oppdaterState('kjoenn', event)}>
              <option value="" disabled>- velg -</option>
              {kjoennKodeverk && kjoennKodeverk.map(element => <option value={element.kode} key={element.kode}>{element.term}</option>)}
            </Ui.Nav.Select>
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Input
              label="Fødselsdato"
              className="familierelasjoner__input"
              bredde="S"
              value={spesialRelasjon.fdato}
              onChange={event => oppdaterState('fdato', event)}
              onBlur={event => vaskInputDatoOgOppdater('fdato', event)} />
          </Ui.Nav.Column>
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Select
              id="id-familierelasjon"
              label="Familierelasjon"
              bredde="fullbredde"
              className="familierelasjoner__input"
              value={spesialRelasjon.rolle}
              onChange={event => oppdaterState('rolle', event)}>
              <option value="" disabled>- velg -</option>
              {filtrerteFamilieRelasjoner().map(element => <option value={element.kode} key={element.kode}>{element.term}</option>)}
            </Ui.Nav.Select>
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="3">
            <Ui.Nav.Knapp onClick={leggTilSpesialRelasjon} disabled={!kanSpesialRelasjonLeggesTil()} className="spesialrelasjon familierelasjoner__knapp">
              <Ui.Icons kind="tilsette" size="18" className="familierelasjoner__knapp__ikon" />
              <div className="familierelasjoner__knapp__label">Legg til</div>
            </Ui.Nav.Knapp>
          </Ui.Nav.Column>
        </Ui.Nav.Row>
      </Ui.Nav.Panel>
    </Ui.Nav.Fieldset>
  </div>
);


FamilieRelasjonUtland.propTypes = {
  spesialRelasjon: PT.object.isRequired,
  oppdaterState: PT.func.isRequired,
  filtrerteFamilieRelasjoner: PT.func.isRequired,
  kjoennKodeverk: PT.arrayOf(KodeverkPropType),
  landKodeverk: PT.arrayOf(KodeverkPropType),
  leggTilSpesialRelasjon: PT.func.isRequired,
  vaskInputDatoOgOppdater: PT.func.isRequired,
  kanSpesialRelasjonLeggesTil: PT.func.isRequired,
};

FamilieRelasjonUtland.defaultProps = {
  kjoennKodeverk: [],
  landKodeverk: [],
};
export { FamilieRelasjonUtland };
