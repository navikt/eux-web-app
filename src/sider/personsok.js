import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import * as Ikoner from '../resources/images';
import * as API from '../services/api';
import { PersonerOperations, PersonerSelectors } from '../ducks/personer';
import PanelHeader from '../felles-komponenter/panelHeader/panelHeader';

import './personsok.css';

const ikonFraKjonn = kjoenn => {
  switch (kjoenn) {
    case 'K': { return Ikoner.Kvinne; }
    case 'M': { return Ikoner.Mann; }
    default: { return Ikoner.Ukjentkjoenn; }
  }
};

const PersonKort = ({ person }) => (
  <Nav.Panel className="personsok__kort">
    <PanelHeader ikon={ikonFraKjonn('M')} tittel={`${person.sammensattNavn}`} undertittel={`Fødselsnummer: ${person.fnr}`} />
  </Nav.Panel>
);

const Feilmelding = () => (<Nav.AlertStripeAdvarsel className="personsok__advarsel">Fant ikke person</Nav.AlertStripeAdvarsel>);

PersonKort.propTypes = {
  person: MPT.Person.isRequired,
};

class PersonSok extends Component {
  state = {};

  sokEtterPerson = () => {
    const { fnr } = this.props;
    if (fnr === '') return;

    API.Personer.hent(fnr).then(response => {
      this.byggPerson(response);

      this.props.validerSok(response.sammensattNavn !== undefined);
    });
  };

  byggPerson = person => {
    this.setState({ person });
  }

  render() {
    const { sokEtterPerson } = this;
    const { person } = this.state;

    const personKort = person && person.sammensattNavn ? <PersonKort person={person} /> : null;
    const feilmelding = person && !person.sammensattNavn ? <Feilmelding /> : null;

    return (
      <div className="personsok">
        <Skjema.Input
          label="Søk på fødsels- eller d-nummer"
          className="personsok__input"
          bredde="XL"
          feltNavn="fnr"
        />
        <Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Nav.Knapp>
        {personKort}
        {feilmelding}
      </div>
    );
  }
}

PersonSok.propTypes = {
  person: MPT.Person,
  handleSubmit: PT.func.isRequired,
  validerSok: PT.func.isRequired,
  fnr: PT.string,
};

PersonSok.defaultProps = {
  person: {},
  fnr: '',
};

const mapStateToProps = state => ({
  person: PersonerSelectors.personSelector(state),
});

export default connect(mapStateToProps, null)(PersonSok);
