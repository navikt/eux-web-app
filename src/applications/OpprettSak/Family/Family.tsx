import { FlexDiv, PileCenterDiv } from 'components/StyledComponents'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import { Ingress, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import AbroadPersonForm from './AbroadPersonForm'
import TPSPersonForm from './TPSPersonForm'

const FamilySubArea = styled.div`
  flex: 10;
`
const FamilySeparator = styled.div`
  flex: 1;
  border-left: 1px solid lightgrey;
`
const MarginDiv = styled.div`
  margin: 0.5rem;
`

export interface FamilyProps {
  abroadPersonFormAlertTypesWatched: Array<string> | undefined
  alertStatus: string | undefined
  alertMessage: string | undefined
  alertType: string | undefined
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  onAbroadPersonAddedFailure: () => void
  onAbroadPersonAddedSuccess: (r: FamilieRelasjon) => void
  onAlertClose: () => void
  onRelationAdded: (p: Person | FamilieRelasjon) => void
  onRelationRemoved: (p: Person | FamilieRelasjon) => void
  onRelationReset: () => void
  onSearchFnr: (sok: any) => void
  onTPSPersonAddedFailure: () => void
  onTPSPersonAddedSuccess: (e: any) => void
  person: Person | undefined
  personRelatert: Person | undefined
  TPSPersonFormAlertTypesWatched: Array<string> | undefined
  valgteFamilieRelasjoner: Array<FamilieRelasjon> | undefined
}

const Family: React.FC<FamilyProps> = ({
  abroadPersonFormAlertTypesWatched,
  alertStatus,
  alertMessage,
  alertType,
  familierelasjonKodeverk,
  onAbroadPersonAddedFailure,
  onAbroadPersonAddedSuccess,
  onAlertClose,
  onRelationAdded,
  onRelationRemoved,
  onRelationReset,
  onSearchFnr,
  onTPSPersonAddedFailure,
  onTPSPersonAddedSuccess,
  personRelatert,
  person,
  valgteFamilieRelasjoner,
  TPSPersonFormAlertTypesWatched
}: FamilyProps): JSX.Element => {
  const [_viewAbroadPersonForm, setViewAbroadPersonForm] = useState<boolean>(false)
  const [_viewTPSRelatedForm, setViewTPSRelatedForm] = useState<boolean>(false)
  const { t } = useTranslation()

  const remainingRelationsFromTPS: Array<FamilieRelasjon> = _.filter(person!.relasjoner, (relation: FamilieRelasjon) =>
    _.find(valgteFamilieRelasjoner, (valgteRelasjon: FamilieRelasjon) => valgteRelasjon.fnr === relation.fnr) === undefined
  )

  const toggleViewAbroadPersonForm = (): void => {
    setViewAbroadPersonForm(!_viewAbroadPersonForm)
  }

  const toggleViewTPSRelatedForm = (): void => {
    setViewTPSRelatedForm(!_viewTPSRelatedForm)
  }

  const ekskluderteVerdier: Array<string> = []

  if (!_.isEmpty(valgteFamilieRelasjoner)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: FamilieRelasjon) => relation.rolle === 'EKTE')) {
      ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA')
    }
    // Hvis registret partner allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: FamilieRelasjon) => relation.rolle === 'REPA')) {
      ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA')
    }
    // Det skal kun være mulig å legge til en relasjon av typen annen
    if (valgteFamilieRelasjoner?.find((relation: FamilieRelasjon) => relation.rolle === 'ANNEN')) {
      ekskluderteVerdier.push('ANNEN')
    }
  }

  const rolleList: Array<Kodeverk> = familierelasjonKodeverk!.filter(
    (kt: Kodeverk) => ekskluderteVerdier.includes(kt.kode) === false
  )

  return (
    <div data-test-id='c-family'>
      <HorizontalSeparatorDiv />
      <Undertittel>
        {t('el:title-family-description')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <FlexDiv>
        <FamilySubArea>
          <HorizontalSeparatorDiv />
          <Ingress>
            {t('label:family-relations-in-tps')}
          </Ingress>
          {remainingRelationsFromTPS.map((relation: FamilieRelasjon) => (
            <MarginDiv key={relation.fnr}>
              <PersonCard
                className='slideInFromLeft personNotSelected'
                familierelasjonKodeverk={familierelasjonKodeverk}
                key={relation.fnr}
                onAddClick={onRelationAdded}
                person={relation}
              />
            </MarginDiv>
          ))}
          {!_.isEmpty(person!.relasjoner) && _.isEmpty(remainingRelationsFromTPS) && (
            <>
              <HorizontalSeparatorDiv data-size='0.5' />
              <VerticalSeparatorDiv data-size='1.5' />
              <UndertekstBold>
                ({t('label:family-added-all')})
              </UndertekstBold>
            </>
          )}
          {_.isEmpty(person!.relasjoner) && (
            <>
              <HorizontalSeparatorDiv data-size='0.5' />
              <VerticalSeparatorDiv data-size='1.5' />
              <UndertekstBold>
                ({t('label:family-none-in-tps')})
              </UndertekstBold>
            </>
          )}
        </FamilySubArea>
        <FamilySeparator />
        <FamilySubArea>
          <HorizontalSeparatorDiv />
          <Ingress>
            {t('label:family-chosen')}&nbsp;({valgteFamilieRelasjoner ? valgteFamilieRelasjoner.length : 0})
          </Ingress>
          {valgteFamilieRelasjoner && valgteFamilieRelasjoner.map((relation: FamilieRelasjon) => (
            <MarginDiv key={relation.fnr}>
              <PersonCard
                className='slideInFromLeft personSelected'
                familierelasjonKodeverk={familierelasjonKodeverk}
                key={relation.fnr}
                onRemoveClick={onRelationRemoved}
                person={relation}
              />
            </MarginDiv>
          ))}
        </FamilySubArea>
      </FlexDiv>
      <PileCenterDiv>
        <div>
          <VerticalSeparatorDiv data-size='1.5' />
          <Ingress>
            {t('el:title-family-utland')}
          </Ingress>
          {_viewAbroadPersonForm && (
            <>
              <VerticalSeparatorDiv />
              <AbroadPersonForm
                alertStatus={alertStatus}
                alertMessage={alertMessage}
                alertType={alertType}
                alertTypesWatched={abroadPersonFormAlertTypesWatched}
                existingFamilyRelationships={(valgteFamilieRelasjoner || []).concat(remainingRelationsFromTPS || [])}
                onAbroadPersonAddedFailure={onAbroadPersonAddedFailure}
                onAbroadPersonAddedSuccess={onAbroadPersonAddedSuccess}
                onAlertClose={onAlertClose}
                person={person}
                rolleList={rolleList}
              />
            </>
          )}
          <VerticalSeparatorDiv />
          <Knapp
            onClick={toggleViewAbroadPersonForm}
          >
            {_viewAbroadPersonForm
              ? t('label:hide-form')
              : t('label:show-form')}
          </Knapp>
        </div>
        <div>
          <VerticalSeparatorDiv data-size='1.5' />
          <Ingress>
            {t('el:title-family-tps')}
          </Ingress>
          {_viewTPSRelatedForm && person && (
            <>
              <VerticalSeparatorDiv />
              <TPSPersonForm
                alertStatus={alertStatus}
                alertMessage={alertMessage}
                alertType={alertType}
                alertTypesWatched={TPSPersonFormAlertTypesWatched}
                existingFamilyRelationships={(valgteFamilieRelasjoner || []).concat(remainingRelationsFromTPS || [])}
                onAlertClose={onAlertClose}
                onSearchFnr={onSearchFnr}
                onRelationReset={onRelationReset}
                onTPSPersonAddedFailure={onTPSPersonAddedFailure}
                onTPSPersonAddedSuccess={onTPSPersonAddedSuccess}
                person={person}
                personRelatert={personRelatert}
                rolleList={rolleList}
              />
            </>
          )}
          <VerticalSeparatorDiv />
          <Knapp onClick={toggleViewTPSRelatedForm}>
            {_viewTPSRelatedForm
              ? t('label:hide-form')
              : t('label:show-form')}
          </Knapp>
        </div>
      </PileCenterDiv>
    </div>
  )
}

export default Family
