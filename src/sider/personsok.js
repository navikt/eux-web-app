import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import * as Skjema from '../felles-komponenter/skjema';
import * as Ikoner from '../resources/images';
import * as API from '../services/api';
import { PersonerSelectors } from '../ducks/personer';
import { PanelHeader } from '../felles-komponenter/panelHeader';

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

  erPersonFunnet = person => (person.sammensattNavn.length !== undefined && person.fnr !== undefined);

  sokEtterPerson = () => {
    const { inntastetFnr, settFnrGyldighet, settFnrSjekket } = this.props;
    if (inntastetFnr.length === 0) return;

    API.Personer.hent(inntastetFnr).then(response => {
      this.setState({ person: response });
      // validerFnr(this.erPersonFunnet(response), response.fnr);
      settFnrGyldighet(this.erPersonFunnet(response));
      settFnrSjekket(true);
    });
  };

  inntastetFnrHarBlittEndret = () => {
    this.setState({ person: {} });
    this.props.settFnrGyldighet(false);
    this.props.settFnrSjekket(false);
  }

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
  person: MPT.Person,
  settFnrGyldighet: PT.func.isRequired,
  settFnrSjekket: PT.func.isRequired,
  inntastetFnr: PT.string,
};

PersonSok.defaultProps = {
  person: {},
  inntastetFnr: '',
};

const mapStateToProps = state => ({
  person: PersonerSelectors.personSelector(state),
});

export default connect(mapStateToProps, null)(PersonSok);
