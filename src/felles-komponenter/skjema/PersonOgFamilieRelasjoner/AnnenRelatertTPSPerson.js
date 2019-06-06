import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import * as Nav from '../../../utils/navFrontend';
import * as MPT from '../../../proptypes';
import * as API from '../../../services/api';
import PersonSokResultat from '../../../komponenter/PersonSokResultat';
import './annenperson.css';

const defaultState = {
  sok: '', person: null, tpsperson: null, rolle: '', knappDisabled: true, notFound400: false,
};

class AnnenRelatertTPSPerson extends Component {
  state = {
    ...defaultState,
  };

  sokEtterFnr = async () => {
    const { sok } = this.state;
    const { tpsrelasjoner } = this.props;
    try {
      const response = await API.Personer.hentPerson(sok);
      // Fjern relasjoner array, NOTE! det er kun relqasjoner som har rolle.
      const person = _.omit(response, 'relasjoner');
      const tpsperson = tpsrelasjoner.find(elem => elem.fnr === person.fnr);
      if (!tpsperson) {
        this.setState({ person, tpsperson: null });
      } else {
        this.setState({
          tpsperson, sok: '', person: null, rolle: '', knappDisabled: true,
        });
      }
    } catch (e) {
      this.setState({ notFound400: true });
    }
  };

  updateSok = event => {
    this.setState({ sok: event.target.value });
  };

  leggTilPersonOgRolle = () => {
    const { rolle } = this.state;
    const person = { ...this.state.person, rolle };
    this.setState({
      ...defaultState,
    });
    this.props.leggTilTPSrelasjon(person);
  };

  oppdaterFamilierelajon = event => {
    const rolle = event.target.value;
    const person = { ...this.state.person, rolle };
    const knappDisabled = false;
    this.setState({ person, rolle, knappDisabled });
  };

  /**
   * Returnerer JSX-elementer med informasjon og feilmeldinger basert på ymse kriterie
   */
  feilmeldingerOgInformasjon = (valgtBrukerFnr, tpsperson, notFound400, sok) => {
    if (valgtBrukerFnr === sok) {
      return (
        <Nav.Column xs="3">
          <Nav.AlertStripe type="info">Fnr {sok} tilhører bruker</Nav.AlertStripe>
        </Nav.Column>
      );
    } else if (tpsperson) {
      return (
        <Nav.Column xs="3">
          <Nav.AlertStripe type="info">Familierelasjonen er allerede registrert i TPS</Nav.AlertStripe>
        </Nav.Column>
      );
    } else if (notFound400) {
      return (
        <Nav.Column xs="3">
          <Nav.AlertStripe type="stopp">Ingen person med fnr {sok} funnet</Nav.AlertStripe>
        </Nav.Column>
      );
    }
    return null;
  }

  render() {
    const { filtrerteFamilieRelasjoner, valgtBrukerFnr } = this.props;
    const { leggTilPersonOgRolle, sokEtterFnr, oppdaterFamilierelajon } = this;

    const {
      person, rolle, tpsperson, knappDisabled, notFound400, sok,
    } = this.state;

    return (
      <div>
        <div className="annenpersonsok">
          <div className="annenpersonsok__skjema">
            <Nav.Input className="" label="" placeholder="Fødsels eller dnr" value={this.state.sok} onChange={this.updateSok} />
            {valgtBrukerFnr !== sok ?
              <Nav.Knapp className="annenpersonsok__knapp" onClick={sokEtterFnr}>Søk</Nav.Knapp>
              :
              <Nav.Knapp disabled className="annenpersonsok__knapp" onClick={sokEtterFnr}>Søk</Nav.Knapp>}
          </div>
        </div>
        {this.feilmeldingerOgInformasjon(valgtBrukerFnr, tpsperson, notFound400, sok)}
        {person && <PersonSokResultat
          person={person}
          rolle={rolle}
          knappDisabled={knappDisabled}
          leggTilHandler={leggTilPersonOgRolle}
          familierelasjonKodeverk={filtrerteFamilieRelasjoner()}
          oppdaterFamilierelajon={oppdaterFamilierelajon} />}
      </div>
    );
  }
}
AnnenRelatertTPSPerson.propTypes = {
  tpsrelasjoner: PT.any.isRequired,
  tpsperson: PT.object,
  person: MPT.Person,
  filtrerteFamilieRelasjoner: PT.func.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
  valgtBrukerFnr: PT.string.isRequired,
};
AnnenRelatertTPSPerson.defaultProps = {
  person: null,
  tpsperson: null,
};
export { AnnenRelatertTPSPerson };
