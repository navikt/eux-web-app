import classNames from 'classnames'
import Alert, { AlertStatus } from '..//Alert/Alert'
import PersonCard from '..//PersonCard/PersonCard'
import { Cell, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from '../StyledComponents'
import * as types from '../../constants/actionTypes'
import { FamilieRelasjon, Kodeverk, Person } from '../../declarations/types'
import { KodeverkPropType } from '../../declarations/types.pt'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import { Knapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface TPSPersonFormProps {
  alertStatus: string | undefined
  alertMessage: string | undefined
  alertType: string | undefined
  className?: string
  onAddFailure: () => void
  onAlertClose: () => void
  onAddSuccess: (e: any) => void
  onResetPersonRelatert: () => void
  personRelatert: Person | undefined
  person: Person
  rolleList: Array<Kodeverk>
  onSearchFnr: (sok: any) => void
  existingFamilyRelationships: Array<FamilieRelasjon>
}

const Container = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const MarginDiv = styled.div`
  margin: 0.5rem;
`
const AlignCenterCell = styled(Cell)`
  display: flex;
  align-items: center;
`
const TPSPersonForm: React.FC<TPSPersonFormProps> = ({
  alertStatus,
  alertMessage,
  alertType,
  className,
  onAddFailure,
  onAddSuccess,
  onAlertClose,
  onResetPersonRelatert,
  personRelatert,
  person,
  rolleList,
  onSearchFnr,
  existingFamilyRelationships
}: TPSPersonFormProps): JSX.Element => {
  const [sok, setSok] = useState('')
  const [_personRelatert, setPersonRelatert] = useState<
    FamilieRelasjon | undefined
  >(undefined)
  const [tpsperson, setTpsPerson] = useState<FamilieRelasjon | undefined>(
    undefined
  )

  const { t } = useTranslation()

  const sokEtterFnr = () => {
    setPersonRelatert(undefined)
    setTpsPerson(undefined)
    if (_.isFunction(onSearchFnr)) {
      onSearchFnr(sok)
    }
  }

  useEffect(() => {
    if (personRelatert && !_personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = _.omit(personRelatert, 'relasjoner')
      const tpsperson =
        personRelatert && personRelatert.relasjoner
          ? personRelatert.relasjoner.find(
            (elem: FamilieRelasjon) => elem.fnr === person.fnr
          )
          : undefined
      setTpsPerson(tpsperson)
      if (!tpsperson) {
        setPersonRelatert(person)
      } else {
        if (onResetPersonRelatert) {
          onResetPersonRelatert()
        }
        setPersonRelatert(undefined)
      }
    }
  }, [personRelatert, _personRelatert, onResetPersonRelatert])

  const updateSok = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSok(e.target.value)
    setPersonRelatert(undefined)
    if (onResetPersonRelatert) {
      onResetPersonRelatert()
    }
  }

  const conflictingPerson = (): boolean => {
    const { fnr } = _personRelatert!
    if (
      _.find(existingFamilyRelationships, (f) => f.fnr === fnr) !== undefined
    ) {
      if (onAddFailure) {
        onAddFailure()
      }
      return true
    }
    return false
  }

  const leggTilPersonOgRolle = (person: FamilieRelasjon) => {
    if (!conflictingPerson()) {
      setSok('')
      setPersonRelatert(undefined)
      setTpsPerson(undefined)
      if (onResetPersonRelatert) {
        onResetPersonRelatert()
      }
      /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
      if (onAddSuccess) {
        onAddSuccess({
          ...person,
          nasjonalitet: 'NO'
        })
      }
    }
  }

  return (
    <Container>
      <Row
        className={classNames(className, 'slideAnimate', {
          feil: !!alertMessage
        })}
      >
        <Cell>
          <Input
            data-testid='c-TPSPersonForm__input-fnr-or-dnr-id'
            label={t('ui:label-fnr-or-dnr')}
            placeholder={t('ui:label-fnr-or-dnr')}
            value={sok}
            onChange={updateSok}
          />
          <VerticalSeparatorDiv />
        </Cell>
        <HorizontalSeparatorDiv />
        <AlignCenterCell>
          <Knapp
            disabled={person.fnr === sok}
            onClick={sokEtterFnr}
          >
            {t('ui:form-search')}
          </Knapp>
        </AlignCenterCell>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Cell>
          {person.fnr === sok && (
            <AlertstripeDiv>
              <AlertStripe type='advarsel'>
                {t('ui:error-fnr-is-user', { sok: sok })}
              </AlertStripe>
            </AlertstripeDiv>
          )}
          {tpsperson && (
            <AlertstripeDiv>
              <AlertStripe className='mt-4 mb-4' type='advarsel'>
                {t('ui:error-relation-already-in-tps')}
              </AlertStripe>
            </AlertstripeDiv>
          )}
          {alertMessage &&
          (alertType === types.SAK_PERSON_RELATERT_GET_FAILURE ||
            alertType === types.FORM_TPSPERSON_ADD_FAILURE) &&
            (
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
          {_personRelatert &&
            (
              <MarginDiv>
                <PersonCard
                  person={_personRelatert}
                  onAddClick={leggTilPersonOgRolle}
                  rolleList={rolleList}
                />
              </MarginDiv>
            )}
        </Cell>
      </Row>
    </Container>
  )
}

TPSPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default TPSPersonForm
