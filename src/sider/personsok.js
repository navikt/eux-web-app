import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import * as API from '../services/api';
import { PersonerOperations, PersonerSelectors } from '../ducks/personer';

class PersonSok extends Component {
  sokEtterPerson = () => {
    const { fnr } = this.props;
    if (fnr === '') return;
    API.Personer.hent(fnr).then(response => console.log(response));
  };

  render() {
    const { sokEtterPerson } = this;

    return (
      <Nav.Panel>
        <Skjema.Input
          label="Søk på fødsels- eller d-nummer"
          className="personsok__input"
          bredde="XL"
          feltNavn="fnr"
        />
        <Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Nav.Knapp>
      </Nav.Panel>
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
