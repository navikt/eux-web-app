import * as sakActions from 'actions/sak'
import classNames from 'classnames'
import 'components/PersonSearch/PersonSearch.css'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import PersonCard from '../PersonCard/PersonCard'

export interface PersonSearchProps {
  className?: string;
  onPersonFound? : (personer: Person) => any;
}

export interface PersonSearchSelector {
  personer: Person;
  gettingPersoner: boolean;
}

const mapState = (state: State): PersonSearchSelector => ({
  personer: state.sak.personer,
  gettingPersoner: state.loading.gettingPersoner
})

const PersonSearch: React.FC<PersonSearchProps> = ({
  className, onPersonFound
}: PersonSearchProps): JSX.Element => {
  const [validation, setValidation] = useState<string | undefined>(undefined)
  const [_person, setPerson] = useState<Person | undefined>(undefined)
  const [inntastetFnr, setInntastetFnr] = useState<string | undefined>(undefined)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { gettingPersoner, personer }: PersonSearchSelector = useSelector<State, PersonSearchSelector>(mapState)

  const isPersonValid = useCallback(
    (personer: Person) => (personer?.fornavn?.length !== undefined && personer?.fnr !== undefined)
    , []
  )

  useEffect(() => {
    if (personer &&  !_person && isPersonValid(personer)) {
      setPerson(personer)
      if (_.isFunction(onPersonFound)) {
        onPersonFound(personer)
      }
    }
  }, [personer, _person, isPersonValid, onPersonFound])


  const sokEtterPerson = () => {
    if (!inntastetFnr || inntastetFnr.length === 0) {
      return
    }
    const fnrPattern = /^[0-9]{11}$/
    if (!fnrPattern.test(inntastetFnr)) {
      setValidation('ui:validation-invalidFnr')
      return
    }
    setValidation(undefined)
    setPerson(undefined)
    dispatch(sakActions.getPersoner(inntastetFnr.trim()))
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidation(undefined)
    setInntastetFnr(e.target.value)
  }

  const onRemovePerson = () => {
    setValidation(undefined)
    setPerson(undefined)
    dispatch(sakActions.resetPersoner())
  }

  return (
    <div className={classNames('personsok', className)}>
      <div className='personsok__skjema'>
        <Ui.Nav.Input
          label='Finn bruker'
          className='personsok__input'
          name='fnr'
          onChange={onChange}
          feil={validation ? t(validation) : null}
        />
        <Ui.Nav.Knapp className='personsok__knapp' onClick={sokEtterPerson} disabled={gettingPersoner}>
          {gettingPersoner ? <Ui.WaitingPanel size='S' message={t('ui:form-searching')} oneLine/> : t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      {personer && isPersonValid(personer) ? <PersonCard person={personer} onRemoveClick={onRemovePerson} /> : null}
    </div>
  )
}

PersonSearch.propTypes = {
  className: PT.string,
  onPersonFound: PT.func
}

export default PersonSearch
