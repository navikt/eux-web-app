import { Alert, Loader, Search } from '@navikt/ds-react'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PersonSearchProps {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  error: string | undefined
  id ?: string
  initialFnr: any
  parentNamespace: string
  searchingPerson: boolean
  onFnrChange?: (newFnr: string) => void
  onPersonFound?: (person: Person) => void
  onSearchPerformed: (fnr: any) => void
  person?: Person | null | undefined
  value: string | undefined
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
  onSearchPerformed,
  person,
  value
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const [fnr, setFnr] = useState<string>(initialFnr ?? value)
  const [_person, setPerson] = useState<Person | null | undefined>(undefined)
  const [localValidation, setLocalValidation] = useState<string | undefined>(undefined)
  const namespace = parentNamespace + '-personSearch'

  useEffect(() => {
    setFnr(value ?? initialFnr)
  }, [value])

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

  const onSearch = (fnr: string | number | readonly string[]) => {
    if (!fnr) {
      setLocalValidation(t('validation:noFnr'))
      return
    }
    const fnrPattern = /^[0-9]{11}$/
    if (fnr && !fnrPattern.test('' + fnr)) {
      setLocalValidation(t('validation:invalidFnr'))
      return
    }
    setLocalValidation(undefined)
    setPerson(undefined)
    if (_.isFunction(onSearchPerformed)) {
      onSearchPerformed(fnr)
    }
  }

  const onChange = (fnr: string): void => {
    setLocalValidation(undefined)
    const newFnr = fnr.trim()
    setFnr(newFnr)
    if (_.isFunction(onFnrChange)) {
      onFnrChange(newFnr)
    }
  }

  return (
    <PileDiv style={{ alignItems: 'flex-start' }}>
      <Search
        label={t('label:søker')}
        /* error={error ?? localValidation} */
        data-testid={id ?? namespace + '-saksnummerOrFnr'}
        id={id ?? namespace + '-saksnummerOrFnr'}
        onChange={onChange}
        required
        hideLabel={false}
        value={fnr || ''}
        disabled={searchingPerson}
        onSearch={onSearch}
      >
        <Search.Button>
          {searchingPerson ? t('message:loading-searching') : t('el:button-search')}
          {searchingPerson && <Loader />}
        </Search.Button>
      </Search>
      {(error ?? localValidation) && (
        <>
          <VerticalSeparatorDiv size='0.5' />
          <span className='navds-error-message navds-error-message--medium'>
            {error ?? localValidation}
          </span>
        </>
      )}
      {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
        <Alert variant='warning'>
          {alertMessage}
        </Alert>
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
