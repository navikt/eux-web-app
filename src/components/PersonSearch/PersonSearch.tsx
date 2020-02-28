import * as sakActions from 'actions/sak'
import * as formActions from 'actions/form'
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
  onFnrChange?: () => void;
  onPersonFound? : (person: Person) => void;
  validation: any;
  resetValidation: (key: string) => void;
}

export interface PersonSearchSelector {
  person: Person;
  gettingPerson: boolean;
  fnr: any;
}

const mapState = (state: State): PersonSearchSelector => ({
  person: state.sak.person,
  fnr: state.form.fnr,
  gettingPerson: state.loading.gettingPerson
})

const PersonSearch: React.FC<PersonSearchProps> = ({
  className, onFnrChange, onPersonFound, resetValidation, validation
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { gettingPerson, fnr, person }: PersonSearchSelector = useSelector<State, PersonSearchSelector>(mapState)
  const [_person, setPerson] = useState<Person | undefined>(undefined)
  const [localValidation, setLocalValidation] = useState<string |undefined>(undefined)

  const isPersonValid = useCallback(
    (person: Person) => (person?.fornavn?.length !== undefined && person?.fnr !== undefined)
    , []
  )

  useEffect(() => {
    if (person && !_person && isPersonValid(person)) {
      setPerson(person)
      if (_.isFunction(onPersonFound)) {
        onPersonFound(person)
      }
    }
  }, [person, _person, isPersonValid, onPersonFound])

  const sokEtterPerson = () => {
    const fnrPattern = /^[0-9]{11}$/
    if (!fnrPattern.test(fnr)) {
      setLocalValidation(t('ui:validation-invalidFnr'))
      return
    }
    setLocalValidation(undefined)
    setPerson(undefined)
    dispatch(sakActions.getPerson(fnr))
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValidation(undefined)
    resetValidation('fnr')
    if (_.isFunction(onFnrChange)) {
      onFnrChange()
    }
    dispatch(formActions.set('fnr', e.target.value.trim()))
  }

  const onRemovePerson = () => {
    setLocalValidation(undefined)
    resetValidation('fnr')
    setPerson(undefined)
    dispatch(sakActions.resetPerson())
  }

  return (
    <div className={classNames('personsok', className)}>
      <div className='personsok__skjema'>
        <Ui.Nav.Input
          label={t('ui:form-searchUser')}
          className='personsok__input'
          value={fnr}
          onChange={onChange}
          feil={validation.fnr || localValidation}
        />
        <Ui.Nav.Knapp className='personsok__knapp' onClick={sokEtterPerson} disabled={gettingPerson}>
          {gettingPerson ? <Ui.WaitingPanel size='S' message={t('ui:form-searching')} oneLine /> : t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      {person && isPersonValid(person) ? <PersonCard className='neutral' person={person} onRemoveClick={onRemovePerson} /> : null}
    </div>
  )
}

PersonSearch.propTypes = {
  className: PT.string,
  onPersonFound: PT.func
}

export default PersonSearch
