/*
import { CustomFamilieRelasjoner } from './CustomFamilieRelasjoner';
export default CustomFamilieRelasjoner;
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../../../proptypes';
import * as Nav from '../../../utils/navFrontend';

import { vaskInputDato } from '../../../utils/dato';

import * as KodeverkSelectors from '../../../ducks/kodeverk/selectors';
import { PersonSelectors } from '../../../ducks/person';

import { FamilieRelasjon } from './FamilieRelasjon';
import { FamilieRelasjonUtland } from './FamilieRelasjonUtland';
import { TPSRelasjonEnkelt } from './TPSRelasjonEnkelt';

import './familierelasjoner.css';

const uuid = require('uuid/v4');

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
      familierelasjonKodeverk, kjoennKodeverk, landKodeverk, fields, tpsrelasjoner,
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

        <FamilieRelasjonUtland
          spesialRelasjon={this.state.spesialRelasjon}
          oppdaterState={this.oppdaterState}
          kjoennKodeverk={kjoennKodeverk}
          landKodeverk={landKodeverk}
          familierelasjonKodeverk={familierelasjonKodeverk}
          leggTilSpesialRelasjon={this.leggTilSpesialRelasjon}
          vaskInputDatoOgOppdater={this.vaskInputDatoOgOppdater}
          kanSpesialRelasjonLeggesTil={this.kanSpesialRelasjonLeggesTil}
        />
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
