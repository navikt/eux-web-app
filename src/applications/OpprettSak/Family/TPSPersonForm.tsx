import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import classNames from 'classnames'
import { AlertstripeDiv } from 'components/StyledComponents'
import { Kodeverk, OldFamilieRelasjon, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import { Input } from 'nav-frontend-skjema'
import { Column, HighContrastKnapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Container = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`

const MarginDiv = styled.div`
  margin: 0.5rem;
`
const AlignCenterColumn = styled(Column)`
  display: flex;
  align-items: center;
`

export interface TPSPersonFormProps {
  alertMessage: string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  existingFamilyRelationships: Array<OldFamilieRelasjon>
  onRelationReset: () => void
  onSearchFnr: (sok: any) => void
  onTPSPersonAddedFailure: () => void
  onTPSPersonAddedSuccess: (e: any) => void
  person: Person
  personRelatert: Person | undefined
  rolleList: Array<Kodeverk>
}

const TPSPersonForm: React.FC<TPSPersonFormProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  className,
  existingFamilyRelationships,
  onRelationReset,
  onSearchFnr,
  onTPSPersonAddedFailure,
  onTPSPersonAddedSuccess,
  person,
  personRelatert,
  rolleList
}: TPSPersonFormProps): JSX.Element => {
  const [_query, setQuery] = useState<string>('')
  const [_personRelatert, setPersonRelatert] = useState<OldFamilieRelasjon | undefined>(undefined)
  const [_tpsperson, setTpsPerson] = useState<OldFamilieRelasjon | undefined>(undefined)
  const { t } = useTranslation()

  const sokEtterFnr = () => {
    setPersonRelatert(undefined)
    setTpsPerson(undefined)
    if (_.isFunction(onSearchFnr)) {
      onSearchFnr(_query)
    }
  }

  useEffect(() => {
    if (personRelatert && !_personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = _.omit(personRelatert, 'relasjoner')
      const tpsperson = personRelatert && personRelatert.relasjoner
        ? personRelatert.relasjoner.find((elem: OldFamilieRelasjon) => elem.fnr === person.fnr)
        : undefined
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
  }, [personRelatert, _personRelatert, onRelationReset])

  const updateQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setPersonRelatert(undefined)
    if (onRelationReset) {
      onRelationReset()
    }
  }

  const conflictingPerson = (): boolean => {
    const { fnr } = _personRelatert!
    if (_.find(existingFamilyRelationships, (f) => f.fnr === fnr) !== undefined) {
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
    <Container>
      <Row
        className={classNames(className, 'slideInFromLeft', { feil: !!alertMessage })}
      >
        <Column>
          <Input
            data-test-id='TPSPersonForm__input-fnr-or-dnr-id'
            label={t('label:fnr-dnr')}
            placeholder={t('label:fnr-dnr')}
            value={_query}
            onChange={updateQuery}
          />
          <VerticalSeparatorDiv />
        </Column>
        <HorizontalSeparatorDiv />
        <AlignCenterColumn>
          <HighContrastKnapp
            disabled={person.fnr === _query}
            onClick={sokEtterFnr}
          >
            {t('el:button-search')}
          </HighContrastKnapp>
        </AlignCenterColumn>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          {person.fnr === _query && (
            <AlertstripeDiv>
              <AlertStripe type='advarsel'>
                {t('message:error-fnr-is-user', { sok: _query })}
              </AlertStripe>
            </AlertstripeDiv>
          )}
          {_tpsperson && (
            <AlertstripeDiv>
              <AlertStripe type='advarsel'>
                {t('message:error-relation-already-in-tps')}
              </AlertStripe>
            </AlertstripeDiv>
          )}
          {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
            <AlertstripeDiv>
              <AlertStripe type='advarsel'>
                t(alertMessage)
              </AlertStripe>
            </AlertstripeDiv>
          )}
          {_personRelatert && (
            <MarginDiv>
              <PersonCard
                person={_personRelatert}
                onAddClick={leggTilPersonOgRolle}
                rolleList={rolleList}
              />
            </MarginDiv>
          )}
        </Column>
      </Row>
    </Container>
  )
}

TPSPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default TPSPersonForm
