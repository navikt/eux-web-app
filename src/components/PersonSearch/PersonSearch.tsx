import { clientClear } from 'actions/alert'
import * as sakActions from 'actions/sak'
import * as formActions from 'actions/form'
import classNames from 'classnames'
import 'components/PersonSearch/PersonSearch.css'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
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
  resetAllValidation: () => void;
  validation: any;
}

export interface PersonSearchSelector {
  alertStatus: string | undefined;
  alertMessage: string | undefined;
  alertType: string | undefined;
  fnr: any;
  gettingPerson: boolean;
  person: Person;
}

const mapState = (state: State): PersonSearchSelector => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  fnr: state.form.fnr,
  gettingPerson: state.loading.gettingPerson,
  person: state.sak.person
})

const PersonSearch: React.FC<PersonSearchProps> = ({
  className, onFnrChange, onPersonFound, resetAllValidation, validation
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { alertStatus, alertMessage, alertType, gettingPerson, fnr, person }: PersonSearchSelector = useSelector<State, PersonSearchSelector>(mapState)
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

  const sokEtterPerson = (): void => {
    const fnrPattern = /^[0-9]{11}$/
    if (!fnrPattern.test(fnr)) {
      setLocalValidation(t('ui:validation-invalidFnr'))
      return
    }
    setLocalValidation(undefined)
    setPerson(undefined)
    dispatch(sakActions.getPerson(fnr))
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocalValidation(undefined)
    resetAllValidation()
    if (_.isFunction(onFnrChange)) {
      onFnrChange()
    }
    dispatch(formActions.set('fnr', e.target.value.trim()))
  }

  const onRemovePerson = (): void => {
    setLocalValidation(undefined)
    resetAllValidation()
    setPerson(undefined)
    dispatch(sakActions.resetPerson())
  }

  return (
    <div className={classNames('personsok', className)}>
      <div className='personsok__skjema'>
        <Ui.Nav.Input
          id='personsok__input-id'
          label={t('ui:form-searchUser')}
          className='personsok__input'
          value={fnr || ''}
          onChange={onChange}
          feil={validation.fnr || localValidation}
        />
        <Ui.Nav.Knapp className='personsok__knapp' onClick={sokEtterPerson} disabled={gettingPerson}>
          {gettingPerson ? <Ui.WaitingPanel size='S' message={t('ui:form-searching')} oneLine /> : t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      {alertMessage && alertType === types.SAK_PERSON_GET_FAILURE && <Ui.Alert
        className='mt-4 mb-4 w-50'
        type='client'
        fixed={false}
        message={t(alertMessage)}
        status={alertStatus}
        onClose={() => dispatch(clientClear())}
      />}
      {person && isPersonValid(person) ? <PersonCard className='neutral' person={person} onRemoveClick={onRemovePerson} /> : null}
    </div>
  )
}

PersonSearch.propTypes = {
  className: PT.string,
  onFnrChange: PT.func,
  onPersonFound: PT.func,
  resetAllValidation: PT.func.isRequired,
  validation: ValidationPropType.isRequired
}

export default PersonSearch
