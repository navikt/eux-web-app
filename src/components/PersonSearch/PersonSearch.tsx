import Alert from 'components/Alert/Alert'
import PersonCard from 'components/PersonCard/PersonCard'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AlertStatus } from 'declarations/components'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import { FeiloppsummeringFeil, Input } from 'nav-frontend-skjema'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const PersonSearchDiv = styled.div`
  margin-bottom: 2em;
`
const PersonSearchPanel = styled.div`
  display: flex;
  flex-direction: row;
`
const PersonSearchInput = styled(Input)`
  min-width: 24.5em;
`
const Button = styled(Knapp)`
  display: flex;
  flex: 0;
  height: 2.4em;
  align-self: flex-start;
  margin: 1.9em 0 0 1em;
`

export interface PersonSearchProps {
  alertStatus: string | undefined
  alertMessage: string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  id: string
  initialFnr: any
  gettingPerson: boolean
  onAlertClose: () => void
  onFnrChange?: (newFnr: string) => void
  onPersonFound?: (person: Person) => void
  onSearchPerformed: (fnr: any) => void
  onPersonRemoved: () => void
  person?: Person | null | undefined
  resetAllValidation: () => void
  validation: FeiloppsummeringFeil | undefined
}

const PersonSearch: React.FC<PersonSearchProps> = ({
  alertStatus,
  alertMessage,
  alertType,
  alertTypesWatched = [],
  id,
  initialFnr,
  gettingPerson,
  onAlertClose,
  onFnrChange,
  onPersonFound,
  onPersonRemoved,
  onSearchPerformed,
  person,
  resetAllValidation,
  validation
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
      setLocalValidation(t('ui:validation-noFnr'))
      return
    }
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
          label={t('ui:label-searchUser')}
          value={_fnr || ''}
          onChange={onChange}
          feil={validation ? validation.feilmelding : localValidation}
        />
        <Button onClick={sokEtterPerson} disabled={gettingPerson}>
          {gettingPerson
            ? <WaitingPanel size='S' message={t('ui:loading-searching')} oneLine />
            : t('ui:label-search')}
        </Button>
      </PersonSearchPanel>
      {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
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
  // validation: FeiloppsummeringFeilPropType
}

export default PersonSearch
