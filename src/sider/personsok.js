import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import * as Ikoner from '../resources/images';
import { PersonOperations } from '../ducks/person';
import { PanelHeader } from '../felles-komponenter/panelHeader';

import './personsok.css';

const ikonFraKjonn = kjoenn => {
  switch (kjoenn) {
    case 'K': { return Ikoner.Kvinne; }
    case 'M': { return Ikoner.Mann; }
    default: { return Ikoner.Ukjentkjoenn; }
  }
};

const PersonKort = ({ person }) => {
  const {
    fnr, fdato, fornavn, etternavn, kjoenn,
  } = person;
  return (
    <div>
      <Nav.Panel className="personsok__kort">
        <PanelHeader ikon={ikonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={`Fødselsnummer: ${fnr}`} />
        { fdato && <p className="panelheader__tittel__under">Fødselsdato: {fdato}</p> }
      </Nav.Panel>
    </div>
  );
};

PersonKort.propTypes = {
  person: MPT.Person.isRequired,
};

class PersonSok extends Component {
  state = {
    searching: false,
    person: {},
  };

  erPersonFunnet = person => (person.fornavn.length !== undefined && person.fnr !== undefined);

  sokEtterPerson = () => {
    const {
      inntastetFnr, settFnrGyldighet, settFnrSjekket, personSok,
    } = this.props;
    if (inntastetFnr.length === 0) return;

    this.setState({ searching: true });
    personSok(inntastetFnr).then(response => {
      const person = { ...response.data };
      this.setState({ searching: false, person });
      // validerFnr(this.erPersonFunnet(response), response.fnr);
      settFnrGyldighet(this.erPersonFunnet(person));
      settFnrSjekket(true);
    });
  };

  inntastetFnrHarBlittEndret = () => {
    const { settFnrGyldighet, settFnrSjekket } = this.props;
    this.setState({ person: {} });
    settFnrGyldighet(false);
    settFnrSjekket(false);
  };

  render() {
    const { sokEtterPerson, inntastetFnrHarBlittEndret } = this;
    const { searching, person } = this.state;
    const personKort = person && person.fornavn && person.etternavn ? <PersonKort person={person} /> : null;
    return (
      <div className="personsok">
        <div className="personsok__skjema">
          <Skjema.Input
            label="Søk på fødsels- eller d-nummer"
            className="personsok__input"
            bredde="XL"
            feltNavn="fnr"
            onKeyUp={inntastetFnrHarBlittEndret}
          />
          <Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Nav.Knapp>
          {searching && <Nav.NavFrontendSpinner />}
        </div>
        {personKort}
      </div>
    );
  }
}

PersonSok.propTypes = {
  personSok: PT.func.isRequired,
  person: MPT.Person,
  settFnrGyldighet: PT.func.isRequired,
  settFnrSjekket: PT.func.isRequired,
  inntastetFnr: PT.string,
};

PersonSok.defaultProps = {
  person: {},
  inntastetFnr: '',
};
const mapStateToProps = _state => ({
});
const mapDispatchToProps = dispatch => ({
  personSok: fnr => dispatch(PersonOperations.hentPerson(fnr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonSok);
