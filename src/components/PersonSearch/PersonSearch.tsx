import Alert, { AlertStatus } from 'components/Alert/Alert'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as types from 'constants/actionTypes'
import { Person } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
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

const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`

const PersonSearchDiv = styled.div`
  margin-bottom: 2em;

  .personsok__skjema {
    display: flex;
    flex-direction: row;
  }
  .personsok__input {
    min-width: 24.5em;
  }
  .personsok__spinnerwrapper {
    margin: 2.3em 1em 0 -2.5em;
  }

  .personsok__knapp {
    display: flex;
    flex: 0;
    height: 2.4em;
    align-self: flex-start;
    margin: 1.9em 0 0 1em;
  }

  .personsok__kort {
    display: flex !important;
    flex-direction: row;
    justify-content: flex-start;
    margin: .6em 0;
    align-items: center;

    .fodselsdato {
      flex: 1;
    }
  }

  .personsok__advarsel {
    margin-top: 1em;
  }

  .familierelasjoner__knapp__ikon {
    margin: -0.0em 0.5em 0 0;

    path {
      stroke: @navBla;
    }
  }
`

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
    <PersonSearchDiv>
      <div className='personsok__skjema'>
        <Input
          id='personsok__input-id'
          label={t('ui:form-searchUser')}
          className='personsok__input'
          value={_fnr || ''}
          onChange={onChange}
          feil={validation.fnr || localValidation}
        />
        <Knapp className='personsok__knapp' onClick={sokEtterPerson} disabled={gettingPerson}>
          {gettingPerson ? <WaitingPanel size='S' message={t('ui:form-searching')} oneLine /> : t('ui:form-search')}
        </Knapp>
      </div>
      {alertMessage && alertType === types.SAK_PERSON_GET_FAILURE && (
        <AlertstripeDiv>
          <Alert
            type='client'
            fixed={false}
            message={t(alertMessage)}
            status={alertStatus as AlertStatus}
            onClose={onAlertClose}
          />
        </AlertstripeDiv>
      )}
      {person && isPersonValid(person) && <PersonCard className='neutral' person={person} onRemoveClick={onRemovePerson} />}
    </PersonSearchDiv>
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
