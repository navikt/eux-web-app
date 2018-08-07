import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../../../proptypes';
import * as Nav from '../../../utils/navFrontend';

// import { vaskInputDato } from '../../../utils/dato';

import { PanelHeader } from '../../../felles-komponenter/panelHeader';
import './familierelasjoner.css';
import * as KodeverkSelectors from '../../../ducks/kodeverk/selectors';
import { PersonSelectors } from '../../../ducks/person';
import * as Ikoner from '../../../resources/images';

const uuid = require('uuid/v4');

const ikonFraKjonn = kjoenn => {
  switch (kjoenn) {
    case 'K': { return Ikoner.Kvinne; }
    case 'M': { return Ikoner.Mann; }
    default: { return Ikoner.Ukjentkjoenn; }
  }
};

const FamilieRelasjon = ({
  kodeverk,
  relasjon: familie, slettRelasjon,
}) => {
  const {
    fornavn, etternavn, fnr, fdato, kjoenn,
  } = familie;
  const undertittel = `Fødselsnummer: ${fnr}`;
  const rolle = kodeverk.find(item => item.kode === familie.rolle).term;
  return (
    <Nav.Panel className="personsok__kort">
      <PanelHeader ikon={ikonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn} - ${rolle}`} undertittel={undertittel} />
      { fdato && <span className="panelheader__tittel__under">Fødselsdato: {fdato}</span> }
      <Nav.Knapp
        className="familierelasjoner__knapp familierelasjoner__knapp--slett"
        onClick={() => slettRelasjon(familie.fnr)}>
        <Nav.Ikon kind="trashcan" size="20" className="familierelasjoner__knapp__ikon" />
        <div>Fjern</div>
      </Nav.Knapp>
    </Nav.Panel>
  );
};

FamilieRelasjon.propTypes = {
  indeks: PT.number.isRequired,
  kodeverk: PT.arrayOf(MPT.Kodeverk).isRequired,
  relasjon: MPT.FamilieRelasjon.isRequired,
  slettRelasjon: PT.func.isRequired,
};

const Relasjon = ({ kodeverk, relasjon, leggTilTPSrelasjon }) => {
  const {
    fnr, fdato, fornavn, etternavn, kjoenn, rolle: kode,
  } = relasjon;
  const rolle = kodeverk.find(elem => elem.kode === kode).term;
  return (
    <Nav.Panel className="personsok__kort">
      <PanelHeader ikon={ikonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn} - ${rolle}`} undertittel={`Fødselsnummer: ${fnr}`} />
      { fdato && <span className="panelheader__tittel__under">Fødselsdato: {fdato}</span> }
      <Nav.Knapp onClick={() => leggTilTPSrelasjon(relasjon)} className="familierelasjoner__knapp">
        <Nav.Ikon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
        <div>Legg til</div>
      </Nav.Knapp>
    </Nav.Panel>
  );
};
Relasjon.propTypes = {
  kodeverk: PT.arrayOf(MPT.Kodeverk).isRequired,
  relasjon: MPT.FamilieRelasjon.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
};

class CustomFamilieRelasjoner extends Component {
  state = {
    fnr: '', fdato: '', rolle: '', kjoenn: '', fornavn: '', etternavn: '',
  };

  leggTilRelasjon = () => {
    const { fields } = this.props;
    const {
      fnr, fdato = '', rolle, kjoenn, fornavn, etternavn,
    } = this.state;
    if (!fnr || !rolle || !kjoenn || !fornavn || !etternavn) { return false; }
    const familerelasjon = {
      rolle, fnr, fdato, fornavn, etternavn, kjoenn,
    };
    return fields.push(familerelasjon);
  };

  leggTilTPSrelasjon = relasjon => {
    const { fields } = this.props;
    return fields.push(relasjon);
  };

  oppdaterState = (felt, event) => {
    const { value } = event.currentTarget;
    this.setState({ [felt]: value });
  };
  /*
  vaskInputDatoOgOppdater = (felt, event) => {
    const { value } = event.currentTarget;
    const nyDato = vaskInputDato(value) || value;
    const dummyEvent = { currentTarget: { value: nyDato } };
    this.oppdaterState(felt, dummyEvent);
  };
  */
  slettRelasjon = fnr => {
    const { fields } = this.props;
    const index = fields.getAll().findIndex(relasjon => relasjon.fnr === fnr);
    fields.remove(index);
  };

  render() {
    const {
      familierelasjonKodeverk, kjoennKodeverk, fields, tpsrelasjoner,
    } = this.props;
    const relasjoner = fields.getAll();

    return (
      <div className="familerelasjoner">
        {relasjoner && relasjoner.map((relasjon, indeks) => <FamilieRelasjon key={uuid()} kodeverk={familierelasjonKodeverk} relasjon={relasjon} indeks={indeks} slettRelasjon={this.slettRelasjon} />)}
        <div className="familierelasjoner__linje">
          <Nav.Input
            label="Fnr eller Dnr"
            className="familierelasjoner__input"
            bredde="XXL"
            value={this.state.fnr}
            onChange={event => this.oppdaterState('fnr', event)} />
          <Nav.Input
            label="Fødselsdato"
            className="familierelasjoner__input"
            bredde="XXL"
            value={this.state.fdato}
            onChange={event => this.oppdaterState('fdato', event)} />
          <Nav.Input
            label="Fornavn"
            className="familierelasjoner__input"
            bredde="XXL"
            value={this.state.fornavn}
            onChange={event => this.oppdaterState('fornavn', event)} />
          <Nav.Input
            label="Etternavn"
            className="familierelasjoner__input"
            bredde="XXL"
            value={this.state.etternavn}
            onChange={event => this.oppdaterState('etternavn', event)} />

          <Nav.Select
            label="Kjønn"
            bredde="s"
            className="familierelasjoner__input"
            value={this.state.kjoenn}
            onChange={event => this.oppdaterState('kjoenn', event)}>
            <option value="" disabled>- velg -</option>
            {kjoennKodeverk && kjoennKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
          </Nav.Select>
          <Nav.Select
            label="Familierelasjon"
            bredde="s"
            className="familierelasjoner__input"
            value={this.state.rolle}
            onChange={event => this.oppdaterState('rolle', event)}>
            <option value="" disabled>- velg -</option>
            {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
          </Nav.Select>
          <Nav.Knapp onClick={this.leggTilRelasjon} className="familierelasjoner__knapp">
            <Nav.Ikon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
            <div>Legg til</div>
          </Nav.Knapp>
        </div>
        {tpsrelasjoner && tpsrelasjoner.map(relasjon => <Relasjon key={uuid()} kodeverk={familierelasjonKodeverk} relasjon={relasjon} leggTilTPSrelasjon={this.leggTilTPSrelasjon} />)}
      </div>
    );
  }
}

CustomFamilieRelasjoner.propTypes = {
  tpsrelasjoner: PT.arrayOf(MPT.FamilieRelasjon),
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk),
  kjoennKodeverk: PT.arrayOf(MPT.Kodeverk),
  fields: PT.object.isRequired,
};
CustomFamilieRelasjoner.defaultProps = {
  tpsrelasjoner: [],
  familierelasjonKodeverk: [],
  kjoennKodeverk: [],
};

const mapStateToProps = state => ({
  tpsrelasjoner: PersonSelectors.familieRelasjonerSelector(state),
  familierelasjonKodeverk: KodeverkSelectors.familierelasjonerSelector(state),
  kjoennKodeverk: KodeverkSelectors.kjoennSelector(state),
});

export default connect(mapStateToProps)(CustomFamilieRelasjoner);
