import { Person } from 'declarations/types'
import React, { useState } from 'react'
import { connect } from 'react-redux';
import PT from 'prop-types';
import * as MPT from '../../proptypes';
import Ui from 'eessi-pensjon-ui'
import * as Skjema from 'felles-komponenter/skjema';
import { PersonOperations, PersonSelectors } from 'ducks/person';
import { StatusLinje } from 'felles-komponenter/statuslinje';
import PersonCard from '../PersonCard/PersonCard'
import 'components/PersonFind/PersonFind.css';

export interface PersonFindProps {
  inntastetFnr: any;
  settFnrGyldighet: (b: boolean) => any;
  settFnrSjekket: (b: boolean) => any;
  personSok: any;
  person: any;
  status: any;
  errdata: any;
}

const PersonFind: React.FC<PersonFindProps> = ({
  inntastetFnr, settFnrGyldighet, settFnrSjekket, personSok, person, status, errdata
}: PersonFindProps): JSX.Element => {
  const [ validation, setValidation ] = useState<string | undefined>(undefined)

  const erPersonFunnet = (person: Person) => (person.fornavn.length !== undefined && person.fnr !== undefined);

  const sokEtterPerson = () => {

    if (!inntastetFnr || inntastetFnr.length === 0) {
      return;
    }
    const fnrPattern = /^[0-9]{11}$/;
    if (!fnrPattern.test(inntastetFnr)) {
      setValidation('ui:validation-invalidFnr')
      return;
    }
    setValidation(undefined)
    personSok(inntastetFnr.trim()).then((response: any) => {
      if (response && response.data) {
        const person = { ...response.data };
        settFnrGyldighet(erPersonFunnet(person));
        settFnrSjekket(true);
      } else {
        settFnrGyldighet(false);
        settFnrSjekket(false);
      }
    });
  };

  const personKort = person && person.fornavn && person.etternavn ? <PersonCard person={person} /> : null;
  return (
    <div className="personsok">
      <div className="personsok__skjema">
        <Skjema.Input
          label="Finn bruker"
          className="personsok__input"
          feltNavn="fnr"
        />
        {['PENDING'].includes(status) ? <div className="personsok__spinnerwrapper"><Ui.Nav.NavFrontendSpinner type="S" /></div> : null}
        <Ui.Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Ui.Nav.Knapp>
      </div>
      {validation ? <p>validation</p> : null}
      {errdata.status && <StatusLinje status={status} tittel="Fødselsnummer søket" />}
      {errdata.status && <p>{errdata.message}</p>}
      {personKort}
    </div>
  )
}

PersonFind.propTypes = {
  personSok: PT.func.isRequired,
  person: MPT.Person,
  settFnrGyldighet: PT.func.isRequired,
  settFnrSjekket: PT.func.isRequired,
  inntastetFnr: PT.string,
  status: PT.string,
  errdata: PT.object,
};

PersonFind.defaultProps = {
  person: {},
  inntastetFnr: '',
  status: '',
  errdata: {},
};

const mapStateToProps = (state: any) => ({
  person: PersonSelectors.personSelector(state),
  status: PersonSelectors.statusSelector(state),
  errdata: PersonSelectors.errorDataSelector(state),
});
const mapDispatchToProps = (dispatch: any) => ({
  personSok: (fnr: any) => dispatch(PersonOperations.hentPerson(fnr.trim())),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonFind);
