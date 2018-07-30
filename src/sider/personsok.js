import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Streng from '../utils/streng';
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
    fnr, fornavn, etternavn, kjoenn,
  } = person;
  return (
    <div>
      <Nav.Panel className="personsok__kort">
        <PanelHeader ikon={ikonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={`Fødselsnummer: ${fnr}`} />
      </Nav.Panel>
    </div>
  );
};

PersonKort.propTypes = {
  person: MPT.Person.isRequired,
};

class PersonSok extends Component {
  state = {};

  sammensattPersonNavn = person => {
    if (!person) { return undefined; }
    return Streng.sammensattNavn(person.fornavn, person.etternavn);
  }
  erPersonFunnet = person => (this.sammensattPersonNavn(person) !== undefined && person.fnr !== undefined);

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

const mapDispatchToProps = dispatch => ({
  personSok: fnr => dispatch(PersonOperations.hentPerson(fnr)),
});
// export default connect(mapStateToProps, mapDispatchToProps)(PersonSok);
export default connect(null, mapDispatchToProps)(PersonSok);
