import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import * as Ikoner from '../resources/images';
// import { PersonSelectors, PersonOperations } from '../ducks/person';
import { PersonOperations } from '../ducks/person';
import { PanelHeader } from '../felles-komponenter/panelHeader';

import './personsok.css';

// const uuid = require('uuid/v4');

const ikonFraKjonn = kjoenn => {
  switch (kjoenn) {
    case 'K': { return Ikoner.Kvinne; }
    case 'M': { return Ikoner.Mann; }
    default: { return Ikoner.Ukjentkjoenn; }
  }
};
const Relasjon = ({ relasjon }) => {
  const {
    fnr, sammensattNavn, kjoenn, rolle,
  } = relasjon;
  return (
    <Nav.Panel className="personsok__kort">
      <PanelHeader ikon={ikonFraKjonn(kjoenn)} tittel={`${sammensattNavn} - ${rolle}`} undertittel={`Fødselsnummer: ${fnr}`} />
    </Nav.Panel>
  );
};
Relasjon.propTypes = {
  relasjon: MPT.Relasjon.isRequired,
};

const PersonKort = ({ person }) => {
  const {
    fnr, sammensattNavn, kjoenn, // relasjoner,
  } = person;
  return (
    <div>
      <Nav.Panel className="personsok__kort">
        <PanelHeader ikon={ikonFraKjonn(kjoenn)} tittel={`${sammensattNavn}`} undertittel={`Fødselsnummer: ${fnr}`} />
      </Nav.Panel>
      {/* {relasjoner && relasjoner.map(relasjon => <Relasjon key={uuid()} relasjon={relasjon} />)} */}
    </div>
  );
};

PersonKort.propTypes = {
  person: MPT.Person.isRequired,
};

class PersonSok extends Component {
  state = {};

  erPersonFunnet = person => (person.sammensattNavn.length !== undefined && person.fnr !== undefined);

  sokEtterPerson = () => {
    const {
      inntastetFnr, settFnrGyldighet, settFnrSjekket, personSok,
    } = this.props;
    if (inntastetFnr.length === 0) return;

    personSok(inntastetFnr).then(response => {
      const person = { ...response.data };
      this.setState({ person });
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
            onKeyUp={inntastetFnrHarBlittEndret}
          />
          <Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Nav.Knapp>
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
/*
const mapStateToProps = state => ({
  person: PersonSelectors.personSelector(state),
  familerelasjoner: PersonSelectors.familieRelasjonerSelector(state),
});
*/
const mapDispatchToProps = dispatch => ({
  personSok: fnr => dispatch(PersonOperations.hentPerson(fnr)),
});
// export default connect(mapStateToProps, mapDispatchToProps)(PersonSok);
export default connect(null, mapDispatchToProps)(PersonSok);
