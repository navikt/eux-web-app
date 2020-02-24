import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import Ui from 'eessi-pensjon-ui';
import * as sakActions from 'actions/sak';
import './AnnenRelatertTPSPerson.css';
import { PersonPropType } from 'declarations/types.pt';
import { useDispatch } from 'react-redux';
import PersonCard from 'components/PersonCard/PersonCard';

const defaultState = {
  sok: '', feiletSok: '', person: null, tpsperson: null, rolle: '', knappDisabled: true, notFound400: false,
};

class AnnenRelatertTPSPerson extends Component {
  state = {
    ...defaultState,
  };

  sokEtterFnr = async () => {
    const { sok } = this.state;
    const { tpsrelasjoner } = this.props;
    const { dispatch } = useDispatch()
    try {
      const response = dispatch(sakActions.getPersoner(sok))

      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
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
      this.setState({ notFound400: true, feiletSok: sok });
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

  oppdaterFamilierelajon = rolle => {
    const person = { ...this.state.person, rolle };
    const knappDisabled = false;
    this.setState({ person, rolle, knappDisabled });
  };

  /**
   * Returnerer JSX-elementer med informasjon og feilmeldinger basert på ymse kriterie
   */
  feilmeldingerOgInformasjon = (valgtBrukerFnr, tpsperson, notFound400, sok, feiletSok) => {
    if (valgtBrukerFnr === sok) {
      return (
        <Ui.Nav.Column xs="3">
          <Ui.Nav.AlertStripe type="info">FNR {sok} tilhører bruker</Ui.Nav.AlertStripe>
        </Ui.Nav.Column>
      );
    } else if (tpsperson) {
      return (
        <Ui.Nav.Column xs="3">
          <Ui.Nav.AlertStripe type="info">Familierelasjonen er allerede registrert i TPS</Ui.Nav.AlertStripe>
        </Ui.Nav.Column>
      );
    } else if (notFound400) {
      return (
        <Ui.Nav.Column xs="3">
          <Ui.Nav.AlertStripe type="stopp">Ingen person med FNR {feiletSok} funnet</Ui.Nav.AlertStripe>
        </Ui.Nav.Column>
      );
    }
    return null;
  };

  render() {
    const { filtrerteFamilieRelasjoner, valgtBrukerFnr } = this.props;
    const {
      leggTilPersonOgRolle, sokEtterFnr, oppdaterFamilierelajon, updateSok, feilmeldingerOgInformasjon,
    } = this;
    const {
      person, rolle, tpsperson, knappDisabled, notFound400, sok, feiletSok,
    } = this.state;

    return (
      <div>
        <div className="annenpersonsok">
          <div className="annenpersonsok__skjema">
            <Ui.Nav.Input className="" label="" placeholder="Fødsels eller dnr" value={this.state.sok} onChange={updateSok} />
            {valgtBrukerFnr !== sok ?
              <Ui.Nav.Knapp className="annenpersonsok__knapp" onClick={sokEtterFnr}>Søk</Ui.Nav.Knapp>
              :
              <Ui.Nav.Knapp disabled className="annenpersonsok__knapp" onClick={sokEtterFnr}>Søk</Ui.Nav.Knapp>}
          </div>
        </div>
        {feilmeldingerOgInformasjon(valgtBrukerFnr, tpsperson, notFound400, sok, feiletSok)}
        {person ? (
          <PersonCard
            person={person}
            initialRolle={rolle}
            onAddClick={leggTilPersonOgRolle}
            familierelasjonKodeverk={filtrerteFamilieRelasjoner()}
            oppdaterFamilierelajon={oppdaterFamilierelajon}
          />
        ) : null}
      </div >
    );
  }
}




AnnenRelatertTPSPerson.propTypes = {
  tpsrelasjoner: PT.any.isRequired,
  tpsperson: PT.object,
  person: PersonPropType,
  filtrerteFamilieRelasjoner: PT.func.isRequired,
  leggTilTPSrelasjon: PT.func.isRequired,
  valgtBrukerFnr: PT.string.isRequired,
};

AnnenRelatertTPSPerson.defaultProps = {
  person: null,
  tpsperson: null,
};

export { AnnenRelatertTPSPerson };
