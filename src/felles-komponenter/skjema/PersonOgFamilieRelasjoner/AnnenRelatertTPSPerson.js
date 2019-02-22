import React, { Component } from 'react';
import PT from 'prop-types';

import { formatterDatoTilNorsk } from '../../../utils/dato';
import * as Nav from '../../../utils/navFrontend';
import PanelHeader from '../../panelHeader/panelHeader';
import * as Eux from '../../../felles-komponenter/Ikon';
import * as MPT from '../../../proptypes';
import * as API from '../../../services/api';

import './annenperson.css';

const uuid = require('uuid/v4');

class PersonSokResultat extends Component {
  state = {
    rolle: 'BARN',
  };
  selectOnChange = event => {
    const { oppdaterFamilierelajon } = this.props;
    console.log(event.target.value);
    this.setState({ rolle: event.target.value });
    oppdaterFamilierelajon(event);
  };

  render() {
    const { rolle } = this.state;
    const {
      person, familierelasjonKodeverk, leggTilHandler, oppdaterFamilierelajon,
    } = this.props;
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
      <Nav.Panel border className="personsok__kort">
        <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={panelUndertittel} />
        <Nav.Select
          label="Familierelasjon"
          bredde="fullbredde"
          className="familierelasjoner__input"
          value={rolle}
          onChange={this.selectOnChange}>
          {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
        </Nav.Select>
        <Nav.Knapp onClick={() => leggTilHandler(this.state.rolle)} className="familierelasjoner__knapp">
          <Eux.Icon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
          <div className="familierelasjoner__knapp__label">Legg til</div>
        </Nav.Knapp>
      </Nav.Panel>
    );
  }
}
PersonSokResultat.propTypes = {
  rolle: PT.string,
  person: MPT.Person.isRequired,
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk).isRequired,
  leggTilHandler: PT.func.isRequired,
  oppdaterFamilierelajon: PT.func.isRequired,
};
PersonSokResultat.defaultProps = {
  rolle: 'BARN',
};

class AnnenRelatertTPSPerson extends Component {
  state = {
    sok: '', person: null, tpsperson: null, valgtRolle: 'BARN',
  };

  sokEtterFnr = async () => {
    const { sok } = this.state;
    const { tpsrelasjoner, valgteRelasjoner } = this.props;
    const response = await API.Personer.hentPerson(sok);
    const { relasjoner: _relasjoner, ...person } = response;
    const tpsperson = tpsrelasjoner.find(elem => elem.fnr === person.fnr);
    const valgtPerson = valgteRelasjoner.find(elem => elem.fnr === person.fnr);
    console.log('valgtPerson', valgtPerson);
    if (!tpsperson) {
      this.setState({ person });
    } else {
      this.setState({ tpsperson });
    }
  };

  updateSok = event => {
    this.setState({ sok: event.target.value });
  };

  leggTilHandlerMedRolle = rolle => {
    console.log('rolle', rolle);
    const person = { ...this.state.person, rolle };
    console.log('leggTilHandler', person);
    this.props.leggTilTPSrelasjon(person);
  };

  oppdaterFamilierelajon = event => {
    this.setState({ person: { ...this.state.person, rolle: event.target.value } });
  };

  render() {
    const { leggTilHandlerMedRolle, sokEtterFnr, oppdaterFamilierelajon } = this;

    const { person, valgtRolle, tpsperson } = this.state;
    const { familierelasjonKodeverk } = this.props;

    const Sokefelt = () => (
      <div className="annenpersonsok">
        <div className="annenpersonsok__skjema">
          <Nav.Input className="" label="" placeholder="Fødsels eller dnr" value={this.state.sok} onChange={this.updateSok} />
          <Nav.Knapp className="annenpersonsok__knapp" onClick={sokEtterFnr}>Søk</Nav.Knapp>
        </div>
      </div>
    );

    return (
      <div>
        <Sokefelt />
        {tpsperson && <p>{tpsperson.fnr} Familierelasjonen er allerede registrert i TPS</p>}
        {person && <PersonSokResultat
          person={person}
          rolle={valgtRolle}
          leggTilHandler={leggTilHandlerMedRolle}
          familierelasjonKodeverk={familierelasjonKodeverk}
          oppdaterFamilierelajon={oppdaterFamilierelajon} />}
      </div>
    );
  }
}
AnnenRelatertTPSPerson.propTypes = {
  tpsrelasjoner: PT.any.isRequired,
  valgteRelasjoner: PT.any.isRequired,
  tpsperson: PT.object,
  person: MPT.Person,
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk).isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
};
AnnenRelatertTPSPerson.defaultProps = {
  person: null,
  tpsperson: null,
};
export { AnnenRelatertTPSPerson };
