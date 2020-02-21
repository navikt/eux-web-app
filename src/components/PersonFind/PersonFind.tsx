import 'components/PersonFind/PersonFind.css'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import * as Skjema from 'felles-komponenter/skjema'
import { StatusLinje } from 'felles-komponenter/statuslinje'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PersonCard from '../PersonCard/PersonCard'
import * as sakActions from 'actions/sak'

export interface PersonFindProps {
  inntastetFnr: any;
  settFnrGyldighet: (b: boolean) => any;
  settFnrSjekket: (b: boolean) => any;
}

export interface PersonFindSelector {
  personer: Person;
  gettingPersoner: boolean;
}

const mapState = (state: State): PersonFindSelector => ({
  personer: state.sak.personer,
  gettingPersoner: state.loading.gettingPersoner
});

const PersonFind: React.FC<PersonFindProps> = ({
  inntastetFnr, settFnrGyldighet, settFnrSjekket
}: PersonFindProps): JSX.Element => {
  const [ validation, setValidation ] = useState<string | undefined>(undefined)
  const [_person, setPerson ] = useState<Person | undefined>(undefined)

  const dispatch = useDispatch()
  const { gettingPersoner, personer }: PersonFindSelector = useSelector<State, PersonFindSelector>(mapState)
  const erPersonFunnet = (personer: Person) => (personer?.fornavn?.length !== undefined && personer?.fnr !== undefined);

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
    setPerson(undefined)
    dispatch(sakActions.getPersoner(inntastetFnr.trim()))
  }

  useEffect(() => {
    if (personer !== undefined && !_person) {
      if (personer === null) {
        settFnrGyldighet(false);
        settFnrSjekket(false);
      } else {
        settFnrGyldighet(erPersonFunnet(personer))
        settFnrSjekket(true)
        setPerson(personer)
      }
    }
  }, [personer, _person, settFnrGyldighet, settFnrSjekket])

  return (
    <div className="personsok">
      <div className="personsok__skjema">
        <Skjema.Input
          label="Finn bruker"
          className="personsok__input"
          feltNavn="fnr"
        />
        {gettingPersoner ? <div className="personsok__spinnerwrapper"><Ui.Nav.NavFrontendSpinner type="S" /></div> : null}
        <Ui.Nav.Knapp className="personsok__knapp" onClick={sokEtterPerson}>SØK</Ui.Nav.Knapp>
      </div>
      {validation ? <p>validation</p> : null}
      {personer ? <StatusLinje status='OK' tittel="Fødselsnummer søket" /> : null}
      {personer && personer.fornavn && personer.etternavn ? <PersonCard person={personer} /> : null}
    </div>
  )
}

PersonFind.propTypes = {
  settFnrGyldighet: PT.func.isRequired,
  settFnrSjekket: PT.func.isRequired,
  inntastetFnr: PT.string
}

PersonFind.defaultProps = {
  inntastetFnr: ''
}

export default PersonFind
