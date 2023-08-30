import { Alert, Loader, Search } from '@navikt/ds-react'
import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import { Kodeverk, OldFamilieRelasjon, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { FlexDiv, HorizontalSeparatorDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TPSPersonFormValidationProps, validateTPSPersonForm } from './validation'

export interface TPSPersonFormProps {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  existingFamilyRelationships: Array<OldFamilieRelasjon>
  onRelationReset: () => void
  onSearchFnr: (sok: any) => void
  onTPSPersonAddedFailure: () => void
  onTPSPersonAddedSuccess: (e: any) => void
  person: Person
  personRelatert: Person | null | undefined
  searchingRelatertPerson: boolean
  rolleList: Array<Kodeverk>
  disableAll?: boolean
}

const TPSPersonForm: React.FC<TPSPersonFormProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  existingFamilyRelationships,
  onRelationReset,
  onSearchFnr,
  onTPSPersonAddedFailure,
  onTPSPersonAddedSuccess,
  person,
  personRelatert,
  searchingRelatertPerson,
  rolleList,
  disableAll
}: TPSPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = 'tpspersonform'
  const [_query, setQuery] = useState<string>('')
  const [_personRelatert, setPersonRelatert] = useState<OldFamilieRelasjon | undefined>(undefined)
  const [_tpsperson, setTpsPerson] = useState<OldFamilieRelasjon | undefined>(undefined)
  const [validation, resetValidation, performValidation] = useLocalValidation<TPSPersonFormValidationProps>(validateTPSPersonForm, namespace)

  const sokEtterFnr = () => {
    const valid = performValidation({
      person,
      fnr: _query,
      tpsperson: _tpsperson
    })
    if (valid) {
      setPersonRelatert(undefined)
      setTpsPerson(undefined)
      if (_.isFunction(onSearchFnr)) {
        onSearchFnr(_query)
      }
    }
  }

  useEffect(() => {
    if (personRelatert && !_personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = _.omit(personRelatert, 'relasjoner')
      const tpsperson = personRelatert?.relasjoner?.find((elem: OldFamilieRelasjon) => elem.fnr === person.fnr)
      setTpsPerson(tpsperson)
      if (!tpsperson) {
        setPersonRelatert(person)
      } else {
        if (onRelationReset) {
          onRelationReset()
        }
        setPersonRelatert(undefined)
      }
    }
  }, [personRelatert])

  const updateQuery = (q: string) => {
    setQuery(q)
    resetValidation(namespace + '-fnr-dnr')
    setPersonRelatert(undefined)
    if (onRelationReset) {
      onRelationReset()
    }
  }

  const conflictingPerson = (): boolean => {
    if (_.find(existingFamilyRelationships, (f) => f.fnr === _personRelatert?.fnr) !== undefined) {
      if (onTPSPersonAddedFailure) {
        onTPSPersonAddedFailure()
      }
      return true
    }
    return false
  }

  const leggTilPersonOgRolle = (person: OldFamilieRelasjon) => {
    if (!conflictingPerson()) {
      setQuery('')
      setPersonRelatert(undefined)
      setTpsPerson(undefined)
      if (onRelationReset) {
        onRelationReset()
      }
      /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
      if (onTPSPersonAddedSuccess) {
        onTPSPersonAddedSuccess({
          ...person,
          nasjonalitet: 'NO'
        })
      }
    }
  }

  return (
    <>
      <FlexDiv>
        <PileDiv>
          <Search
            id='TPSPersonForm__input-fnr-or-dnr-id'
            data-testid='TPSPersonForm__input-fnr-or-dnr-id'
            label={t('label:fnr-dnr')}
          /* error={validation[namespace + '-fnr-dnr']?.feilmelding} */
            onChange={updateQuery}
            required
            value={_query}
            disabled={searchingRelatertPerson || disableAll}
          >
            <Search.Button onClick={sokEtterFnr}>
              {t('el:button-search')}
              {searchingRelatertPerson && <Loader />}
            </Search.Button>
          </Search>
          {validation[namespace + '-fnr-dnr']?.feilmelding && (
            <>
              <VerticalSeparatorDiv size='0.5' />
              <span className='navds-error-message navds-error-message--medium'>
                {validation[namespace + '-fnr-dnr']?.feilmelding}
              </span>
            </>
          )}
          {_personRelatert?.adressebeskyttelse &&
            <>
              <VerticalSeparatorDiv size='0.5' />
              <Alert size="small" variant='warning'>
                {t('label:sensitivPerson', {gradering: _personRelatert.adressebeskyttelse})}
              </Alert>
            </>
          }
        </PileDiv>

        <HorizontalSeparatorDiv />
        {_personRelatert && (
          <PersonCard
            person={_personRelatert}
            onAddClick={leggTilPersonOgRolle}
            rolleList={rolleList}
            disableAll={disableAll}
          />
        )}
      </FlexDiv>
      <VerticalSeparatorDiv />
      {_tpsperson && (
        <Alert variant='warning'>
          {t('message:error-relation-already-in-tps')}
        </Alert>
      )}
      {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
        <Alert variant='error'>
          {alertMessage}
        </Alert>
      )}

    </>
  )
}

TPSPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default TPSPersonForm
