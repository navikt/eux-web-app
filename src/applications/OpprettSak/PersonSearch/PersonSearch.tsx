import { Search } from '@navikt/ds-icons'
import { Alert, Loader, SearchField } from '@navikt/ds-react'
import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { PileDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PersonSearchProps {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  error: string | undefined
  id: string
  initialFnr: any
  parentNamespace: string
  searchingPerson: boolean
  onFnrChange?: (newFnr: string) => void
  onPersonFound?: (person: Person) => void
  onSearchPerformed: (fnr: any) => void
  onPersonRemoved: () => void
  person?: Person | null | undefined
}

const PersonSearch: React.FC<PersonSearchProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  error,
  id,
  initialFnr,
  parentNamespace,
  searchingPerson,
  onFnrChange,
  onPersonFound,
  onPersonRemoved,
  onSearchPerformed,
  person
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const [_fnr, setFnr] = useState<string>(initialFnr)
  const [_person, setPerson] = useState<Person | null | undefined>(undefined)
  const [localValidation, setLocalValidation] = useState<string | undefined>(undefined)
  const namespace = parentNamespace + '-personSearch'

  const isPersonValid = useCallback((person: Person) =>
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
  }, [person])

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
    const newFnr = e.target.value.trim()
    setFnr(newFnr)
    if (_.isFunction(onFnrChange)) {
      onFnrChange(newFnr)
    }
  }

  const onRemovePerson = (): void => {
    setLocalValidation(undefined)
    setPerson(undefined)
    if (_.isFunction(onPersonRemoved)) {
      onPersonRemoved()
    }
  }

  return (
    <PileDiv style={{ alignItems: 'flex-start' }}>
      <SearchField
        id={id}
        data-test-id={id}
        label={t('label:søker')}
        error={error ?? localValidation}
      >
        <SearchField.Input
          data-test-id={namespace + '-saksnummerOrFnr'}
          id={namespace + '-saksnummerOrFnr'}
          onChange={onChange}
          required
          value={_fnr || ''}
        />
        <SearchField.Button
          disabled={searchingPerson}
          onClick={sokEtterPerson}
        >
          <Search />
          {t('el:button-search')}
          {searchingPerson && <Loader />}
        </SearchField.Button>
      </SearchField>
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
    </PileDiv>
  )
}

PersonSearch.propTypes = {
  className: PT.string,
  onFnrChange: PT.func,
  onPersonFound: PT.func
  // validation: ErrorElementPropType
}

export default PersonSearch
