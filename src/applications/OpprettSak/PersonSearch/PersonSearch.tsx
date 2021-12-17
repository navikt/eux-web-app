import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { Alert, TextField, Button } from '@navikt/ds-react'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const PersonSearchDiv = styled.div`
  margin-bottom: 2em;
`
const PersonSearchPanel = styled.div`
  display: flex;
  flex-direction: row;
`
const PersonSearchInput = styled(TextField)`
  min-width: 24.5em;
`
const MyButton = styled(Button)`
  display: flex;
  flex: 0;
  height: 2.4em;
  align-self: flex-start;
  margin: 1.9em 0 0 1em;
`

export interface PersonSearchProps {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  error: string | undefined
  id: string
  initialFnr: any
  searchingPerson: boolean
  onFnrChange?: (newFnr: string) => void
  onPersonFound?: (person: Person) => void
  onSearchPerformed: (fnr: any) => void
  onPersonRemoved: () => void
  person?: Person | null | undefined
  resetAllValidation: () => void
}

const PersonSearch: React.FC<PersonSearchProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  error,
  id,
  initialFnr,
  searchingPerson,
  onFnrChange,
  onPersonFound,
  onPersonRemoved,
  onSearchPerformed,
  person,
  resetAllValidation
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const [_fnr, setFnr] = useState<string | undefined>(undefined)
  const [_person, setPerson] = useState<Person | null | undefined>(undefined)
  const [localValidation, setLocalValidation] = useState<string | undefined>(
    undefined
  )

  const isPersonValid = useCallback(
    (person: Person) =>
      person?.fornavn?.length !== undefined && person?.fnr !== undefined,
    []
  )

  useEffect(() => {
    if (person && !_person && isPersonValid(person)) {
      setPerson(person)
      if (_.isFunction(onPersonFound)) {
        onPersonFound(person)
      }
    }
  }, [person, _person, isPersonValid, onPersonFound])

  useEffect(() => {
    if (initialFnr && !_fnr) {
      setFnr(initialFnr)
    }
  }, [_fnr, initialFnr])

  const sokEtterPerson = (): void => {
    if (!_fnr) {
      setLocalValidation(t('validation:noFnr'))
      return
    }
    const fnrPattern = /^[0-9]{11}$/
    if (_fnr && !fnrPattern.test(_fnr)) {
      setLocalValidation(t('validation:invalidFnr'))
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
    const newFnr = e.target.value.trim()
    setFnr(newFnr)
    if (_.isFunction(onFnrChange)) {
      onFnrChange(newFnr)
    }
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
      <PersonSearchPanel>
        <PersonSearchInput
          id={id}
          data-test-id={id}
          label={t('label:søker')}
          value={_fnr || ''}
          onChange={onChange}
          error={error ?? localValidation}
        />
        <MyButton onClick={sokEtterPerson} disabled={searchingPerson}>
          {searchingPerson
            ? <WaitingPanel size='xsmall' message={t('message:loading-searching')} oneLine />
            : t('el:button-search')}
        </MyButton>
      </PersonSearchPanel>
      {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
        <Alert variant='warning'>
          {alertMessage}
        </Alert>
      )}
      {person && isPersonValid(person) && (
        <PersonCard
          className='neutral'
          person={person}
          onRemoveClick={onRemovePerson}
        />
      )}
    </PersonSearchDiv>
  )
}

PersonSearch.propTypes = {
  className: PT.string,
  onFnrChange: PT.func,
  onPersonFound: PT.func,
  resetAllValidation: PT.func.isRequired
  // validation: ErrorElementPropType
}

export default PersonSearch
