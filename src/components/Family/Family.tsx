import TPSPersonForm from 'components/Family/TPSPersonForm'
import AbroadPersonForm from 'components/Family/AbroadPersonForm'
import PersonCard from 'components/PersonCard/PersonCard'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import { Ingress, Systemtittel, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Panel from 'nav-frontend-paneler'
import styled from 'styled-components'

export interface FamilySelector {
  alertStatus: string | undefined
  alertMessage: string | undefined
  alertType: string | undefined
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  person: Person | undefined
  personRelatert: Person | undefined
  valgteFamilieRelasjoner: Array<FamilieRelasjon> | undefined
  onClickAddRelasjons: (p: Person | FamilieRelasjon) => void
  onClickRemoveRelasjons: (p: Person | FamilieRelasjon) => void
  onResetPersonRelatert: () => void
  onAddFailure: () => void
  onAddSuccess: (e: any) => void
  onAlertClose: () => void
}

const FamilyArea = styled.div`
  display: flex;
`
const FamilySubArea = styled.div`
  flex: 10;
`
const FamilySeparator = styled.div`
  flex: 1;
  borderLeft: 1px solid lightgrey;
`
const MarginDiv = styled.div`
  margin: 0.5rem;
`
const Forms = styled.div`
  display: flex;
`
const Family: React.FC<FamilySelector> = ({
  alertStatus,
  alertMessage,
  alertType,
  familierelasjonKodeverk,
  personRelatert,
  person,
  valgteFamilieRelasjoner,
  onClickAddRelasjons,
  onClickRemoveRelasjons,
  onResetPersonRelatert,
  onAddFailure,
  onAddSuccess,
  onAlertClose
}): JSX.Element => {
  const [viewFormRelatedUtland, setViewFormRelatedUtland] = useState<boolean>(
    false
  )
  const [viewFormRelatedTPS, setViewFormRelatedTPS] = useState<boolean>(false)
  const { t } = useTranslation()

  const remainingRelationsFromTPS: Array<FamilieRelasjon> = _.filter(
    person!.relasjoner,
    (relation: FamilieRelasjon) =>
      _.find(
        valgteFamilieRelasjoner,
        (valgteRelasjon: FamilieRelasjon) => valgteRelasjon.fnr === relation.fnr
      ) === undefined
  )

  const toggleFormRelatedUtland = (): void => {
    setViewFormRelatedUtland(!viewFormRelatedUtland)
  }

  const toggleFormRelatedTPS = (): void => {
    setViewFormRelatedTPS(!viewFormRelatedTPS)
  }

  const ekskluderteVerdier: Array<string> = []
  if (!_.isEmpty(valgteFamilieRelasjoner)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (
      valgteFamilieRelasjoner?.find(
        (relation: FamilieRelasjon) => relation.rolle === 'EKTE'
      )
    ) { ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA') }
    // Hvis registret partner allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (
      valgteFamilieRelasjoner?.find(
        (relation: FamilieRelasjon) => relation.rolle === 'REPA'
      )
    ) { ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA') }
    // Det skal kun være mulig å legge til en relasjon av typen annen
    if (
      valgteFamilieRelasjoner?.find(
        (relation: FamilieRelasjon) => relation.rolle === 'ANNEN'
      )
    ) { ekskluderteVerdier.push('ANNEN') }
  }

  const rolleList: Array<Kodeverk> = familierelasjonKodeverk!.filter(
    (kt: Kodeverk) => ekskluderteVerdier.includes(kt.kode) === false
  )

  return (
    <div data-testid='c-family'>
      <Systemtittel className='mb-4'>
        {t('ui:label-familyRelationships')}
      </Systemtittel>
      <VerticalSeparatorDiv />
      <Panel border>
        <HorizontalSeparatorDiv />
        <Undertittel>
          {t('ui:form-family-description')}
        </Undertittel>
        <VerticalSeparatorDiv />
        <FamilyArea>
          <FamilySubArea>
            <HorizontalSeparatorDiv />
            <Ingress>
              {t('ui:form-family-relations-in-tps')}
            </Ingress>
            {remainingRelationsFromTPS.map((relation: FamilieRelasjon) => (
              <MarginDiv key={relation.fnr}>
                <PersonCard
                  className='slideAnimate personNotSelected'
                  key={relation.fnr}
                  person={relation}
                  familierelasjonKodeverk={familierelasjonKodeverk}
                  onAddClick={(value) => onClickAddRelasjons(value)}
                />
              </MarginDiv>
            ))}
            {!_.isEmpty(person!.relasjoner) &&
              _.isEmpty(remainingRelationsFromTPS) && (
                <>
                <HorizontalSeparatorDiv data-size='0.5' />
                <VerticalSeparatorDiv data-size='1.5' />
                <UndertekstBold>
                    ({t('ui:form-family-added-all')})
                  </UndertekstBold>
              </>
            )}
            {_.isEmpty(person!.relasjoner) && (
              <>
                <HorizontalSeparatorDiv data-size='0.5' />
                <VerticalSeparatorDiv data-size='1.5' />
                <UndertekstBold>
                  ({t('ui:form-family-none-in-tps')})
                </UndertekstBold>
              </>
            )}
          </FamilySubArea>
          <FamilySeparator />
          <FamilySubArea>
            <HorizontalSeparatorDiv />
            <Ingress>
              {t('ui:form-family-chosen')}&nbsp;(
              {valgteFamilieRelasjoner ? valgteFamilieRelasjoner.length : 0})
            </Ingress>
            {valgteFamilieRelasjoner &&
              valgteFamilieRelasjoner.map((relation: FamilieRelasjon) => (
                <MarginDiv key={relation.fnr}>
                  <PersonCard
                    className='slideAnimate personSelected'
                    key={relation.fnr}
                    familierelasjonKodeverk={familierelasjonKodeverk}
                    person={relation}
                    onRemoveClick={(value) => onClickRemoveRelasjons(value)}
                  />
                </MarginDiv>
              ))}
          </FamilySubArea>
        </FamilyArea>

        <Forms>
          <VerticalSeparatorDiv data-size='1.5' />
          <div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <Ingress>
              {t('ui:form-family-utland-title')}
            </Ingress>
            {viewFormRelatedUtland && (
              <>
                <VerticalSeparatorDiv />
                <AbroadPersonForm
                  rolleList={rolleList}
                  existingFamilyRelationships={(
                    valgteFamilieRelasjoner || []
                  ).concat(remainingRelationsFromTPS || [])}
                />
              </>
            )}
            <VerticalSeparatorDiv />
            <Knapp onClick={toggleFormRelatedUtland}>
              {viewFormRelatedUtland
                ? t('ui:label-hide-form')
                : t('ui:label-show-form')}
            </Knapp>
          </div>
        </Forms>
        <Forms>
          <VerticalSeparatorDiv data-size='1.5' />
          <div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <Ingress>
              {t('ui:form-family-tps-title')}
            </Ingress>
            {viewFormRelatedTPS && person && (
              <>
                <VerticalSeparatorDiv />
                <TPSPersonForm
                  alertStatus={alertStatus}
                  alertMessage={alertMessage}
                  alertType={alertType}
                  personRelatert={personRelatert}
                  person={person}
                  rolleList={rolleList}
                  existingFamilyRelationships={(
                    valgteFamilieRelasjoner || []
                  ).concat(remainingRelationsFromTPS || [])}
                  onResetPersonRelatert={onResetPersonRelatert}
                  onAddFailure={onAddFailure}
                  onAddSuccess={onAddSuccess}
                  onAlertClose={onAlertClose}
                />
              </>
            )}
            <VerticalSeparatorDiv />
            <Knapp onClick={toggleFormRelatedTPS}>
              {viewFormRelatedTPS ? t('ui:label-hide-form') : t('ui:label-show-form')}
            </Knapp>
          </div>
        </Forms>
      </Panel>
    </div>
  )
}

export default Family
