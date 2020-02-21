import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui'

import { vaskInputDato } from '../../../utils/dato';


import { FamilieRelasjonPanel } from './FamilieRelasjonPanel';
import { FamilieRelasjonUtland } from './FamilieRelasjonUtland';
import { TPSRelasjonEnkelt } from './TPSRelasjonEnkelt';

import { AnnenRelatertTPSPerson } from './AnnenRelatertTPSPerson';
import './familierelasjoner.css';
import { FamilieRelasjonPropType, KodeverkPropType, PersonPropType } from 'declarations/types.pt';

const uuid = require('uuid/v4');

class FamilieRelasjonController extends Component {
  state = {
    spesialRelasjon: {
      fnr: '', fdato: '', nasjonalitet: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '',
    },
    ui: {
      visRelatertTPS: false,
      visRelatertUtland: false,
    },
  };

  kanSpesialRelasjonLeggesTil = () => {
    const { spesialRelasjon } = this.state;
    const {
      fnr, rolle, nasjonalitet, kjoenn, fornavn, etternavn,
    } = spesialRelasjon;
    return (fnr && rolle && nasjonalitet && kjoenn && fornavn && etternavn);
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

  visSkjulRelatertTPS = () => {
    this.setState({ ui: { ...this.state.ui, visRelatertTPS: !this.state.ui.visRelatertTPS } });
  };
  knappeTekstRelatertTPS = () => (this.state.ui.visRelatertTPS ? 'Skjul Skjema' : 'Vis skjema');
  visSkulRelatertUtland = () => {
    this.setState({ ui: { ...this.state.ui, visRelatertUtland: !this.state.ui.visRelatertUtland } });
  };

  knappeTekstUtland = () => (this.state.ui.visRelatertUtland ? 'Skjul Skjema' : 'Vis skjema');

  /**
   * I nedtrekslisten for familierelasjoner filtrerers ut mulige relasjoner basert på personer som allerede er lagt til.
   */
  filtrerRoller = () => {
    const { familierelasjonKodeverk, fields } = this.props;
    const valgteRelasjoner = fields.getAll();
    const ekskluderteVerdier = [];
    if (valgteRelasjoner.length > 0) {
      // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
      if (valgteRelasjoner.find(kt => kt.rolle === 'EKTE')) ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA');
      // Hvis registret partner allerede er lagt til, fjern mulighet for andre typer samlivspartnere
      if (valgteRelasjoner.find(kt => kt.rolle === 'REPA')) ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA');
      // Det skal kun være mulig å legge til en relasjon av typen annen
      if (valgteRelasjoner.find(kt => kt.rolle === 'ANNEN')) ekskluderteVerdier.push('ANNEN');
    }
    return familierelasjonKodeverk.filter(kt => ekskluderteVerdier.includes(kt.kode) === false);
  };

  render() {
    const {
      familierelasjonKodeverk, kjoennKodeverk, landKodeverk, fields, tpsrelasjoner, person,
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
      <div className="familierelasjoner">
        {valgteRelasjoner && valgteRelasjoner.length > 0}<Ui.Nav.UndertekstBold>Valgte familierelasjoner&nbsp;({valgteRelasjoner.length})</Ui.Nav.UndertekstBold>
        {valgteRelasjoner && valgteRelasjoner.map((relasjon, indeks) =>
          (<FamilieRelasjonPanel
            key={uuid()}
            familierelasjonKodeverk={familierelasjonKodeverk}
            landKodeverk={landKodeverk}
            relasjon={relasjon}
            indeks={indeks}
            slettRelasjon={this.slettRelasjon}
          />))
        }

        <Ui.Nav.Fieldset className="familierelasjoner__utland" legend="Familierelasjoner registrert i TPS">
          {gjenstaendeRelasjonerFraTPS}
          {(tpsrelasjoner.length > 0 && gjenstaendeRelasjonerFraTPS.length === 0) ? <Ui.Nav.Panel>(Du har lagt til alle som fantes i listen.)</Ui.Nav.Panel> : null}
          {!tpsrelasjoner && <Ui.Nav.Panel>(Ingen familierelasjoner funnet i TPS)</Ui.Nav.Panel>}
        </Ui.Nav.Fieldset>
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <p><strong>Person uten fødsels- eller d-nummer&nbsp;</strong></p>
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="2">
            <Ui.Nav.Knapp onClick={this.visSkulRelatertUtland} >{this.knappeTekstUtland()}</Ui.Nav.Knapp>
          </Ui.Nav.Column>
        </Ui.Nav.Row>
        {this.state.ui.visRelatertUtland && <FamilieRelasjonUtland
          spesialRelasjon={this.state.spesialRelasjon}
          oppdaterState={this.oppdaterState}
          kjoennKodeverk={kjoennKodeverk}
          landKodeverk={landKodeverk}
          filtrerteFamilieRelasjoner={this.filtrerRoller}
          leggTilSpesialRelasjon={this.leggTilSpesialRelasjon}
          vaskInputDatoOgOppdater={this.vaskInputDatoOgOppdater}
          kanSpesialRelasjonLeggesTil={this.kanSpesialRelasjonLeggesTil}
        />}
        <Ui.Nav.Row>
          <br />
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <p><strong>Person uten registrert relasjon i TPS&nbsp;</strong></p>
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="2">
            <Ui.Nav.Knapp onClick={this.visSkjulRelatertTPS} >{this.knappeTekstRelatertTPS()}</Ui.Nav.Knapp>
          </Ui.Nav.Column>
        </Ui.Nav.Row>
        {this.state.ui.visRelatertTPS && <AnnenRelatertTPSPerson
          valgteRelasjoner={valgteRelasjoner}
          tpsrelasjoner={tpsrelasjoner}
          leggTilTPSrelasjon={this.leggTilTPSrelasjon}
          filtrerteFamilieRelasjoner={this.filtrerRoller}
          valgtBrukerFnr={person.fnr}
        />}
      </div>
    );
  }
}

FamilieRelasjonController.propTypes = {
  person: PersonPropType,
  tpsrelasjoner: PT.arrayOf(FamilieRelasjonPropType),
  familierelasjonKodeverk: PT.arrayOf(KodeverkPropType),
  kjoennKodeverk: PT.arrayOf(KodeverkPropType),
  fields: PT.object.isRequired,
  landKodeverk: PT.arrayOf(KodeverkPropType)
};
FamilieRelasjonController.defaultProps = {
  person: {},
  tpsrelasjoner: [],
  familierelasjonKodeverk: [],
  kjoennKodeverk: [],
  landKodeverk: [],
};

const mapStateToProps = state => ({
 /* person: PersonSelectors.personSelector(state),
  tpsrelasjoner: PersonSelectors.familieRelasjonerSelector(state),
  familierelasjonKodeverk: KodeverkSelectors.familierelasjonerSelector(state),
  kjoennKodeverk: KodeverkSelectors.kjoennSelector(state),
  landKodeverk: LandkoderSelectors.landkoderSelector(state),*/
});

export default connect(mapStateToProps)(FamilieRelasjonController);
