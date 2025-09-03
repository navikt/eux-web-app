import {Alert, Loader, Search, VStack} from '@navikt/ds-react'
import {PersonInfoPDL, PersonMedFamilie} from 'declarations/types'
import _ from 'lodash'
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
  onPersonFound?: (person: PersonInfoPDL) => void
  onSearchPerformed: (fnr: any) => void
  person?: PersonInfoPDL | PersonMedFamilie | null | undefined
  value: string | undefined
  label?: string
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
  value,
  label
}: PersonSearchProps): JSX.Element => {
  const { t } = useTranslation()
  const [fnr, setFnr] = useState<string>(value ?? initialFnr)
  const [_person, setPerson] = useState<PersonInfoPDL | PersonMedFamilie | null | undefined>(undefined)
  const [localValidation, setLocalValidation] = useState<string | undefined>(undefined)
  const namespace = parentNamespace + '-personSearch'

  // Reset fnr when value prop changes or when component mounts
  useEffect(() => {
    console.log("Setting fnr from value prop:", value);
    setFnr(value ?? initialFnr)
  }, [value, initialFnr])

  // Additional effect to ensure field is always reset to the value prop on mount
  useEffect(() => {
    console.log("Setting initial fnr from value prop on mount:", value);
    if (value !== undefined && value !== null) {
      setFnr(value)
    }
  }, [])

  const isPersonValid = useCallback((person: PersonInfoPDL | PersonMedFamilie) =>
    person?.fnr !== undefined,
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

  const onSearch = () => {
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
    <VStack gap="1">
      <Search
        label={label ? label : t('label:søker')}
        /* error={error ?? localValidation} */
        data-testid={id ?? namespace + '-saksnummerOrFnr'}
        id={id ?? namespace + '-saksnummerOrFnr'}
        onChange={onChange}
        hideLabel={false}
        value={fnr || ''}
        disabled={searchingPerson}

      >
        <Search.Button onClick={onSearch}>
          {searchingPerson ? t('message:loading-searching') : t('el:button-search')}
          {searchingPerson && <Loader />}
        </Search.Button>
      </Search>
      {(error ?? localValidation) && (
        <span className='navds-error-message navds-error-message--medium'>
          {error ?? localValidation}
        </span>
      )}
      {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
        <Alert variant='warning'>
          {alertMessage}
        </Alert>
      )}
    </VStack>
  )
}

export default PersonSearch
