import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import * as Nav from '../../../utils/navFrontend';
import * as MPT from '../../../proptypes';
import * as API from '../../../services/api';
import PersonSokResultat from '../../../komponenter/PersonSokResultat';
import './annenperson.css';

class AnnenRelatertTPSPerson extends Component {
  state = {
    sok: '', person: null, tpsperson: null, rolle: '',
  };

  sokEtterFnr = async () => {
    const { sok } = this.state;
    const { tpsrelasjoner, valgteRelasjoner } = this.props;
    const response = await API.Personer.hentPerson(sok);
    // Fjern relasjoner array, NOTE! det er kun relqasjoner som har rolle.
    const person = _.omit(response, 'relasjoner');
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

  leggTilPersonOgRolle = () => {
    const person = { ...this.state.person, ...this.state.rolle };
    this.props.leggTilTPSrelasjon(person);
  };

  oppdaterFamilierelajon = event => {
    const rolle = event.target.value;
    const person = { ...this.state.person, rolle };
    this.setState({ person, rolle });
  };

  render() {
    const { leggTilPersonOgRolle, sokEtterFnr, oppdaterFamilierelajon } = this;

    const { person, rolle, tpsperson } = this.state;
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
          rolle={rolle}
          leggTilHandler={leggTilPersonOgRolle}
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
