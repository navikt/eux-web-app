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

const ikonFraKjonn = kjoenn => {
  switch (kjoenn) {
    case 'K': { return Ikoner.Kvinne; }
    case 'M': { return Ikoner.Mann; }
    default: { return Ikoner.Ukjentkjoenn; }
  }
};

const PersonKort = ({ person }) => (
  <Nav.Panel>
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
    API.Personer.hent(fnr).then(response => this.byggPerson(response));
  };

  byggPerson = person => {
    this.setState({ person });
  }

  render() {
    const { sokEtterPerson } = this;
    const { person } = this.state;

    const personKort = person ? <PersonKort person={person} /> : null;

    return (
      <div>
        <Skjema.Input
          label="Søk på fødsels- eller d-nummer"
          className="personsok__input"
          bredde="XL"
          feltNavn="fnr"
        />
        <Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Nav.Knapp>
        {personKort}
      </div>
    );
  }
}
PersonSok.propTypes = {
  person: MPT.Person,
  handleSubmit: PT.func.isRequired,
  lagreSokeStreng: PT.func.isRequired,
  hentPerson: PT.isRequired,
  fnr: PT.string,
};
PersonSok.defaultProps = {
  person: {},
  fnr: '',
};

const mapStateToProps = state => ({
  person: PersonerSelectors.personSelector(state),
});
const mapDispatchToProps = dispatch => ({
  lagreSokeStreng: verdi => dispatch(change('sokEtterPerson', 'sokeStreng', verdi)),
  hentPerson: fnr => dispatch(PersonerOperations.hent(fnr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonSok);
