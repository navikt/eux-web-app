import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import * as Ikoner from '../resources/images';
import * as API from '../services/api';
import { PersonerSelectors } from '../ducks/personer';
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

PersonKort.propTypes = {
  person: MPT.Person.isRequired,
};

class PersonSok extends Component {
  state = {};

  sokEtterPerson = () => {
    const { fnr } = this.props;
    if (fnr === '') return;

    API.Personer.hent(fnr).then(response => {
      this.setState({ person: response });

      this.props.validerSok(Object.keys(response).length > 0);
    });
  };

  render() {
    const { sokEtterPerson } = this;
    const { person } = this.state;

    const personKort = person && person.sammensattNavn ? <PersonKort person={person} /> : null;

    return (
      <div className="personsok">
        <div className="personsok__skjema">
          <Skjema.Input
            label="Søk på fødsels- eller d-nummer"
            className="personsok__input"
            bredde="XL"
            feltNavn="fnr"
          />
          <Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Nav.Knapp>
        </div>
        {personKort}
      </div>
    );
  }
}

PersonSok.propTypes = {
  person: MPT.Person,
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
