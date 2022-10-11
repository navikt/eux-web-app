import { BodyLong, Button, Heading, Ingress, Panel } from '@navikt/ds-react'
import { resetPersonRelated } from 'actions/person'
import PersonCard from 'applications/OpprettSak/PersonCard/PersonCard'
import { FadingLineSeparator } from 'components/StyledComponents'
import { Kodeverk, OldFamilieRelasjon, Person } from 'declarations/types'
import _ from 'lodash'
import { FlexDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import AbroadPersonForm from './AbroadPersonForm'
import TPSPersonForm from './TPSPersonForm'

export interface FamilyProps {
  abroadPersonFormAlertTypesWatched: Array<string> | undefined
  alertVariant: string | undefined
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  onAbroadPersonAddedFailure: () => void
  onAbroadPersonAddedSuccess: (r: OldFamilieRelasjon) => void
  onRelationAdded: (p: Person | OldFamilieRelasjon) => void
  onRelationRemoved: (p: Person | OldFamilieRelasjon) => void
  onRelationReset: () => void
  onSearchFnr: (sok: any) => void
  onTPSPersonAddedFailure: () => void
  onTPSPersonAddedSuccess: (e: any) => void
  person: Person | null | undefined
  personRelatert: Person | null | undefined
  searchingRelatertPerson: boolean
  TPSPersonFormAlertTypesWatched: Array<string> | undefined
  valgteFamilieRelasjoner: Array<OldFamilieRelasjon> | undefined
  disableAll?: boolean
}

const Family: React.FC<FamilyProps> = ({
  abroadPersonFormAlertTypesWatched,
  alertMessage,
  alertType,
  familierelasjonKodeverk,
  onAbroadPersonAddedFailure,
  onAbroadPersonAddedSuccess,
  onRelationAdded,
  onRelationRemoved,
  onRelationReset,
  onSearchFnr,
  onTPSPersonAddedFailure,
  onTPSPersonAddedSuccess,
  personRelatert,
  person,
  searchingRelatertPerson,
  valgteFamilieRelasjoner,
  TPSPersonFormAlertTypesWatched,
  disableAll
}: FamilyProps): JSX.Element => {
  const [_viewAbroadPersonForm, setViewAbroadPersonForm] = useState<boolean>(false)
  const [_viewTPSRelatedForm, setViewTPSRelatedForm] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const remainingRelationsFromTPS: Array<OldFamilieRelasjon> | undefined = _.filter(person?.relasjoner, (relation: OldFamilieRelasjon) =>
    _.find(valgteFamilieRelasjoner, (valgteRelasjon: OldFamilieRelasjon) => valgteRelasjon.fnr === relation.fnr) === undefined
  )

  const toggleViewAbroadPersonForm = (): void => setViewAbroadPersonForm(!_viewAbroadPersonForm)

  const toggleViewTPSRelatedForm = (): void => {
    setViewTPSRelatedForm(!_viewTPSRelatedForm)
    if (personRelatert) {
      dispatch(resetPersonRelated())
    }
  }

  const ekskluderteVerdier: Array<string> = []

  if (!_.isEmpty(valgteFamilieRelasjoner)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: OldFamilieRelasjon) => relation.rolle === 'EKTE')) {
      ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA')
    }
    // Hvis registret partner allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: OldFamilieRelasjon) => relation.rolle === 'REPA')) {
      ekskluderteVerdier.push('EKTE', 'SAMB', 'REPA')
    }
    // Det skal kun være mulig å legge til en relasjon av typen annen
    if (valgteFamilieRelasjoner?.find((relation: OldFamilieRelasjon) => relation.rolle === 'ANNEN')) {
      ekskluderteVerdier.push('ANNEN')
    }
  }

  const rolleList: Array<Kodeverk> = familierelasjonKodeverk!.filter((kt: Kodeverk) => ekskluderteVerdier.includes(kt.kode) === false)

  return (
    <Panel border data-testid='family'>
      <Heading size='small'>
        {t('label:family-description')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div style={{ minWidth: '450px', flex: 1 }}>
          <Ingress>
            {t('label:familierelasjon-i-tps')}
          </Ingress>
          {remainingRelationsFromTPS?.map((relation: OldFamilieRelasjon) => (
            <div key={relation.fnr}>
              <PersonCard
                className='personNotSelected'
                familierelasjonKodeverk={familierelasjonKodeverk}
                onAddClick={onRelationAdded}
                person={relation}
                disableAll={disableAll}
              />
              <VerticalSeparatorDiv size='1.5' />
            </div>
          ))}
          {!_.isEmpty(person?.relasjoner) && _.isEmpty(remainingRelationsFromTPS) && (
            <>
              <VerticalSeparatorDiv size='1.5' />
              <BodyLong>
                ({t('label:familie-alle-lagt-inn')})
              </BodyLong>
            </>
          )}
          {_.isEmpty(person?.relasjoner) && (
            <>
              <VerticalSeparatorDiv size='1.5' />
              <BodyLong>
                ({t('label:ingen-familie-i-tps')})
              </BodyLong>
            </>
          )}
          <VerticalSeparatorDiv />
        </div>
        <FadingLineSeparator style={{ marginLeft: '1rem', marginRight: '1rem' }} className='fadeIn'>
          &nbsp;
        </FadingLineSeparator>
        <div style={{ minWidth: '450px', flex: 1 }}>
          <Ingress>
            {t('label:valgt-familie')}&nbsp;({valgteFamilieRelasjoner ? valgteFamilieRelasjoner.length : 0})
          </Ingress>
          {valgteFamilieRelasjoner && valgteFamilieRelasjoner.map((relation: OldFamilieRelasjon) => (
            <div key={relation.fnr}>
              <PersonCard
                className='personSelected'
                familierelasjonKodeverk={familierelasjonKodeverk}
                onRemoveClick={onRelationRemoved}
                person={relation}
                disableAll={disableAll}
              />
              <VerticalSeparatorDiv size='1.5' />
            </div>
          ))}
          <VerticalSeparatorDiv />
        </div>
      </FlexDiv>
      <VerticalSeparatorDiv size='1.5' />
      <PileDiv>
        <div>
          <Ingress>
            {t('label:family-utland')}
          </Ingress>
          <VerticalSeparatorDiv />
          {_viewAbroadPersonForm && (
            <AbroadPersonForm
              alertMessage={alertMessage}
              alertType={alertType}
              alertTypesWatched={abroadPersonFormAlertTypesWatched}
              existingFamilyRelationships={(valgteFamilieRelasjoner || []).concat(remainingRelationsFromTPS || [])}
              onAbroadPersonAddedFailure={onAbroadPersonAddedFailure}
              onAbroadPersonAddedSuccess={onAbroadPersonAddedSuccess}
              person={person}
              rolleList={rolleList}
              disableAll={disableAll}
            />
          )}
          <VerticalSeparatorDiv size='2' />
          <Button
            variant='secondary'
            onClick={toggleViewAbroadPersonForm}
            disabled={disableAll}
          >
            {_viewAbroadPersonForm
              ? t('label:skjul-skjema')
              : t('label:vis-skjema')}
          </Button>
        </div>
        <VerticalSeparatorDiv size='2' />
        <div>
          <Ingress>
            {t('label:family-tps')}
          </Ingress>
          <VerticalSeparatorDiv />
          {_viewTPSRelatedForm && person && (
            <TPSPersonForm
              alertMessage={alertMessage}
              alertType={alertType}
              alertTypesWatched={TPSPersonFormAlertTypesWatched}
              existingFamilyRelationships={(valgteFamilieRelasjoner || []).concat(remainingRelationsFromTPS || [])}
              onSearchFnr={onSearchFnr}
              onRelationReset={onRelationReset}
              onTPSPersonAddedFailure={onTPSPersonAddedFailure}
              onTPSPersonAddedSuccess={onTPSPersonAddedSuccess}
              person={person}
              personRelatert={personRelatert}
              searchingRelatertPerson={searchingRelatertPerson}
              rolleList={rolleList}
              disableAll={disableAll}
            />
          )}
          <VerticalSeparatorDiv size='2' />
          <Button
            variant='secondary'
            onClick={toggleViewTPSRelatedForm}
            disabled={disableAll}
          >
            {_viewTPSRelatedForm
              ? t('label:skjul-skjema')
              : t('label:vis-skjema')}
          </Button>
        </div>
      </PileDiv>
    </Panel>
  )
}

export default Family
