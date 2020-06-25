import classNames from 'classnames'
import 'components/PersonSearch/PersonSearch.css'
import * as types from 'constants/actionTypes'
import { Person } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PersonCard from '../PersonCard/PersonCard'

export interface PersonSearchProps {
  alertStatus: string | undefined;
  alertMessage: string | undefined;
  alertType: string | undefined;
  className?: string;
  initialFnr: any;
  gettingPerson: boolean;
  onAlertClose: () => void;
  onFnrChange?: () => void;
  onPersonFound? : (person: Person) => void;
  onSearchPerformed: (fnr: any) => void;
  onPersonRemoved: () => void;
  person?: Person;
  resetAllValidation: () => void;
  validation: any;
}

const PersonSearch: React.FC<PersonSearchProps> = ({
   alertStatus, alertMessage, alertType, className, initialFnr, gettingPerson,
   onAlertClose, onFnrChange, onPersonFound, onPersonRemoved, onSearchPerformed, person,
   resetAllValidation, validation
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const [_fnr, setFnr] = useState<string | undefined>(initialFnr)
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
    if (_fnr && !fnrPattern.test(_fnr)) {
      setLocalValidation(t('ui:validation-invalidFnr'))
      return
    }
    setLocalValidation(undefined)
    setPerson(undefined)
    if (_.isFunction(onSearchPerformed)) {
      onSearchPerformed(_fnr)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocalValidation(undefined)
    resetAllValidation()
    if (_.isFunction(onFnrChange)) {
      onFnrChange()
    }
    setFnr(e.target.value.trim())
  }

  const onRemovePerson = (): void => {
    setLocalValidation(undefined)
    resetAllValidation()
    setPerson(undefined)
    if (_.isFunction(onPersonRemoved)) {
      onPersonRemoved()
    }
  }

  return (
    <div className={classNames('personsok', className)}>
      <div className='personsok__skjema'>
        <Ui.Nav.Input
          id='personsok__input-id'
          label={t('ui:form-searchUser')}
          className='personsok__input'
          value={_fnr || ''}
          onChange={onChange}
          feil={validation.fnr || localValidation}
        />
        <Ui.Nav.Knapp className='personsok__knapp' onClick={sokEtterPerson} disabled={gettingPerson}>
          {gettingPerson ? <Ui.WaitingPanel size='S' message={t('ui:form-searching')} oneLine /> : t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      {alertMessage && alertType === types.SAK_PERSON_GET_FAILURE && (
        <Ui.Alert
          className='mt-4 mb-4 w-50'
          type='client'
          fixed={false}
          message={t(alertMessage)}
          status={alertStatus}
          onClose={onAlertClose}
        />
      )}
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
