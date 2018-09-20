/*
import { CustomFamilieRelasjoner } from './CustomFamilieRelasjoner';
export default CustomFamilieRelasjoner;
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../../../proptypes';
import * as Nav from '../../../utils/navFrontend';

import { vaskInputDato, formatterDatoTilNorsk } from '../../../utils/dato';

import * as KodeverkSelectors from '../../../ducks/kodeverk/selectors';
import { PersonSelectors } from '../../../ducks/person';

import { PanelHeader } from '../../../felles-komponenter/panelHeader';

import { IkonFraKjonn } from './IkonFraKjonn';
import { FamilieRelasjon } from './FamilieRelasjon';

import './familierelasjoner.css';

const uuid = require('uuid/v4');

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
    <Nav.Panel border className="personsok__kort">
      <PanelHeader ikon={IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn} - ${rolle}`} undertittel={panelUndertittel} />
      <Nav.Knapp onClick={() => leggTilTPSrelasjon(relasjon)} className="familierelasjoner__knapp">
        <Nav.Ikon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
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

class CustomFamilieRelasjoner extends Component {
  state = {
    spesialRelasjon: {
      fnr: '', fdato: '', nasjonalitet: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '',
    },
  };

  kanSpesialRelasjonLeggesTil = () => {
    const { spesialRelasjon } = this.state;
    return (spesialRelasjon.fnr && spesialRelasjon.rolle && spesialRelasjon.nasjonalitet && spesialRelasjon.kjoenn && spesialRelasjon.fornavn && spesialRelasjon.etternavn);
  };

  resettSpesialRelasjonsFelter = () => {
    this.setState({
      spesialRelasjon: {
        fnr: '', fdato: '', nasjonalitet: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '',
      },
    });
  };

  leggTilSpesialRelasjon = () => {
    const { fields } = this.props;
    const { kanSpesialRelasjonLeggesTil } = this;
    const { spesialRelasjon } = this.state;

    const vasketRelasjon = {
      rolle: spesialRelasjon.rolle,
      fnr: spesialRelasjon.fnr,
      fdato: spesialRelasjon.fdato || '',
      nasjonalitet: spesialRelasjon.nasjonalitet,
      fornavn: spesialRelasjon.fornavn,
      etternavn: spesialRelasjon.etternavn,
      kjoenn: spesialRelasjon.kjoenn,
    };

    if (kanSpesialRelasjonLeggesTil()) {
      this.resettSpesialRelasjonsFelter();
      fields.push(vasketRelasjon);
    }
  };

  leggTilTPSrelasjon = relasjon => {
    /* Personer fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    const { fields } = this.props;
    const vasketRelasjon = {
      ...relasjon,
      nasjonalitet: 'NO',
    };
    return fields.push(vasketRelasjon);
  };

  oppdaterState = (felt, event) => {
    const { value } = event.currentTarget;
    this.setState({ spesialRelasjon: { ...this.state.spesialRelasjon, [felt]: value } });
  };

  vaskInputDatoOgOppdater = (felt, event) => {
    const { value } = event.currentTarget;
    const nyDato = vaskInputDato(value) || '';
    const dummyEvent = { currentTarget: { value: nyDato } };
    this.oppdaterState(felt, dummyEvent);
  };

  slettRelasjon = fnr => {
    const { fields } = this.props;
    const index = fields.getAll().findIndex(relasjon => relasjon.fnr === fnr);
    fields.remove(index);
  };

  render() {
    const {
      familierelasjonKodeverk, kjoennKodeverk, landKodeverk, fields, tpsrelasjoner = [],
    } = this.props;
    const valgteRelasjoner = fields.getAll();

    const gjenstaendeRelasjonerFraTPS = tpsrelasjoner.reduce((samling, enkeltTPSRelasjon) => {
      const erAlleredeLagtTil = valgteRelasjoner.some(r => r.fnr === enkeltTPSRelasjon.fnr);
      return (erAlleredeLagtTil ?
        [...samling]
        :
        [...samling, <TPSRelasjonEnkelt key={uuid()} kodeverk={familierelasjonKodeverk} relasjon={enkeltTPSRelasjon} leggTilTPSrelasjon={this.leggTilTPSrelasjon} />]
      );
    }, []);

    return (
      <div className="familerelasjoner">
        {valgteRelasjoner && valgteRelasjoner.map((relasjon, indeks) =>
          (<FamilieRelasjon
            key={uuid()}
            familierelasjonKodeverk={familierelasjonKodeverk}
            landKodeverk={landKodeverk}
            relasjon={relasjon}
            indeks={indeks}
            slettRelasjon={this.slettRelasjon}
          />))
        }

        <Nav.Fieldset className="familierelasjoner__utland" legend="Fant følgende familiemedlemmer i TPS:">
          { gjenstaendeRelasjonerFraTPS }
          { (tpsrelasjoner.length > 0 && gjenstaendeRelasjonerFraTPS.length === 0) ? <Nav.Panel>(Du har lagt til alle som fantes i listen.)</Nav.Panel> : null }
          { !tpsrelasjoner && <Nav.Panel>(Ingen familierelasjoner funnet i TPS)</Nav.Panel> }
        </Nav.Fieldset>
        <Nav.Fieldset className="familierelasjoner__utland" legend="Du kan også legge til familierelasjoner fra utlandet som ikke er oppført i TPS:">
          <Nav.Panel border className="familierelasjoner__utland__wrapper">
            <Nav.Row>
              <Nav.Column xs="4">
                <Nav.Input
                  label="Utenlandsk ID"
                  className="familierelasjoner__input"
                  bredde="fullbredde"
                  value={this.state.spesialRelasjon.fnr}
                  onChange={event => this.oppdaterState('fnr', event)} />
              </Nav.Column>
              <Nav.Column xs="4">
                <Nav.Input
                  label="Fornavn"
                  className="familierelasjoner__input"
                  bredde="fullbredde"
                  value={this.state.spesialRelasjon.fornavn}
                  onChange={event => this.oppdaterState('fornavn', event)} />
              </Nav.Column>
              <Nav.Column xs="4">
                <Nav.Input
                  label="Etternavn"
                  className="familierelasjoner__input"
                  bredde="fullbredde"
                  value={this.state.spesialRelasjon.etternavn}
                  onChange={event => this.oppdaterState('etternavn', event)} />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column xs="2">
                <Nav.Select
                  label="Kjønn"
                  bredde="s"
                  className="familierelasjoner__input"
                  value={this.state.spesialRelasjon.kjoenn}
                  onChange={event => this.oppdaterState('kjoenn', event)}>
                  <option value="" disabled>- velg -</option>
                  {kjoennKodeverk && kjoennKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                </Nav.Select>
              </Nav.Column>
              <Nav.Column xs="2">
                <Nav.Select
                  label="Nasjonalitet"
                  bredde="m"
                  className="familierelasjoner__input"
                  value={this.state.spesialRelasjon.nasjonalitet}
                  onChange={event => this.oppdaterState('nasjonalitet', event)}>
                  <option value="" disabled>- velg -</option>
                  {landKodeverk && landKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                </Nav.Select>
              </Nav.Column>
              <Nav.Column xs="4">
                <Nav.Input
                  label="Fødselsdato (YYYY.MM.DD)"
                  className="familierelasjoner__input"
                  bredde="S"
                  value={this.state.spesialRelasjon.fdato}
                  onChange={event => this.oppdaterState('fdato', event)}
                  onBlur={event => this.vaskInputDatoOgOppdater('fdato', event)} />
              </Nav.Column>
              <Nav.Column xs="4">
                <Nav.Select
                  label="Familierelasjon"
                  bredde="fullbredde"
                  className="familierelasjoner__input"
                  value={this.state.spesialRelasjon.rolle}
                  onChange={event => this.oppdaterState('rolle', event)}>
                  <option value="" disabled>- velg -</option>
                  {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
                </Nav.Select>
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column xs="12">
                <Nav.Knapp onClick={this.leggTilSpesialRelasjon} disabled={!this.kanSpesialRelasjonLeggesTil()} className="spesialrelasjon familierelasjoner__knapp">
                  <Nav.Ikon kind="tilsette" size="18" className="familierelasjoner__knapp__ikon" />
                  <div className="familierelasjoner__knapp__label">Legg til</div>
                </Nav.Knapp>
              </Nav.Column>
            </Nav.Row>
          </Nav.Panel>
        </Nav.Fieldset>
      </div>
    );
  }
}

CustomFamilieRelasjoner.propTypes = {
  tpsrelasjoner: PT.arrayOf(MPT.FamilieRelasjon),
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk),
  kjoennKodeverk: PT.arrayOf(MPT.Kodeverk),
  fields: PT.object.isRequired,
  landKodeverk: PT.arrayOf(MPT.Kodeverk),
};
CustomFamilieRelasjoner.defaultProps = {
  tpsrelasjoner: [],
  familierelasjonKodeverk: [],
  kjoennKodeverk: [],
  landKodeverk: [],
};

const mapStateToProps = state => ({
  tpsrelasjoner: PersonSelectors.familieRelasjonerSelector(state),
  familierelasjonKodeverk: KodeverkSelectors.familierelasjonerSelector(state),
  kjoennKodeverk: KodeverkSelectors.kjoennSelector(state),
  landKodeverk: KodeverkSelectors.landkoderSelector(state),
});

export default connect(mapStateToProps)(CustomFamilieRelasjoner);
