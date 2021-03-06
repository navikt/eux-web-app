import kvinne from 'assets/icons/icon-kvinne.png'
import mann from 'assets/icons/icon-mann.png'
import ukjent from 'assets/icons/icon-ukjent.png'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import { FamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import { Select } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatterDatoTilNorsk } from 'utils/dato'

export interface PersonCardProps {
  className?: string,
  familierelasjonKodeverk?: Array<Kodeverk>;
  onAddClick?: (p: Person | FamilieRelasjon) => void;
  onRemoveClick?: (p: Person | FamilieRelasjon) => void;
  person: Person | FamilieRelasjon;
  rolleList?: Array<Kodeverk>;
}

const PersonCardDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const PersonCardPanel = styled(Panel)`
  border: 1px solid lightgray;
  background: transparent;
  margin-top: 1.5rem;
  max-width: 800px;
  min-width: 400px;
  padding: 1rem;
  border-radius: 5px;

  &.personNotSelected  {
    border: 3px solid red;
  }
  &.personSelected  {
    border: 3px solid green;
  }
  &.neutral {
    background: white;
  }
`
const Description = styled.div`
  display: flex;
`
const Undertitle = styled.div`
  display: flex;
  flex-direction: column;
`
const RemoveButton = styled(Knapp)`
  display: flex;
  align-self: center;
  justify-self: flex-end;
`
const ButtonLabel = styled.div`
  display: flex;
  align-self: center;
`
/* .knapp--disabled {
    path {
      stroke: @white !important;
    }
  }

  .familierelasjoner__knapp {

    &:hover:not(.knapp--disabled) {
      .familierelasjoner__knapp__ikon path {
        stroke: @white !important;
      }
    }
  } */
const PersonCard: React.FC<PersonCardProps> = ({
  className, familierelasjonKodeverk, onAddClick, onRemoveClick, person, rolleList
}: PersonCardProps): JSX.Element => {
  // const [_person, setPerson] = useState<Person | FamilieRelasjon>(person)
  const [rolle, setRolle] = useState<any>(undefined)
  const { fnr, fdato, fornavn, etternavn, kjoenn } = (person as FamilieRelasjon)
  const { t } = useTranslation()

  let kind: string = 'nav-unknown-icon'
  let src = ukjent
  if (kjoenn === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (kjoenn === 'M') {
    kind = 'nav-man-icon'
    src = mann
  }

  let rolleTerm

  if ((person as FamilieRelasjon).rolle && (familierelasjonKodeverk || rolleList)) {
    let rolleObjekt
    if (familierelasjonKodeverk) {
      rolleObjekt = familierelasjonKodeverk.find((item: any) => item.kode === (person as FamilieRelasjon).rolle)
    }
    if (rolleList) {
      rolleObjekt = rolleList.find((item: any) => item.kode === (person as FamilieRelasjon).rolle)
    }
    const kodeverkObjektTilTerm = (kodeverkObjekt: any) => {
      if (!kodeverkObjekt || !kodeverkObjekt.term) return undefined
      return Object.keys(kodeverkObjekt).includes('term') ? kodeverkObjekt.term : undefined
    }

    rolleTerm = kodeverkObjektTilTerm(rolleObjekt)
    if (!rolleTerm) {
      rolleTerm = t('ui:form-unknownRolle')
    }
  }

  const _onRemoveClick = (p: Person | FamilieRelasjon) => {
    if (rolle) {
      (p as FamilieRelasjon).rolle = rolle
    }
    if (onRemoveClick) {
      onRemoveClick(p)
    }
  }

  const _onAddClick = (p: Person | FamilieRelasjon) => {
    if (rolle) {
      (p as FamilieRelasjon).rolle = rolle
    }
    if (onAddClick) {
      onAddClick(p)
    }
  }

  const updateFamilyRelation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRolle(e.target.value)
  }

  return (
    <PersonCardPanel className={className}>
      <PersonCardDiv>
        <Description>
          <img
            alt={kind}
            width={50}
            height={50}
            src={src}
          />
          <HorizontalSeparatorDiv />
          <div data-testid='panelheader__tittel'>
            <Undertittel data-testid='panelheader__tittel__hoved'>
              {fornavn}
              {' '}
              {etternavn}
              {(person as FamilieRelasjon).rolle ? ' - ' + rolleTerm : ''}
            </Undertittel>
            <Undertitle>
              <div>{t('ui:form-fnr') + ' : ' + fnr}</div>
              <div>{t('ui:form-birthdate') + ': ' + formatterDatoTilNorsk(fdato)}</div>
            </Undertitle>
          </div>
        </Description>
        {rolleList !== undefined && (
          <Select
            label={t('ui:label-familyRelationship')}
            date-testid='familierelasjoner__select-familirelasjon-rolle'
            value={(person as FamilieRelasjon).rolle}
            onChange={updateFamilyRelation}
          >
            <option value=''>{t('ui:form-choose')}</option>
            {rolleList && rolleList.map((element: Kodeverk) => (
              <option value={element.kode} key={element.kode}>{element.term}</option>)
            )}
          </Select>
        )}
        {_.isFunction(onRemoveClick) && (
          <RemoveButton
            onClick={() => _onRemoveClick(person)}
          >
            <Trashcan color='#0067C5' width='20' height='20' />
            <HorizontalSeparatorDiv />
            <ButtonLabel>
              {t('ui:form-remove')}
            </ButtonLabel>
          </RemoveButton>
        )}
        {_.isFunction(onAddClick) && (
          <Knapp
            data-testid='familierelasjoner__knapp--legg-til'
            disabled={rolleList !== undefined && !rolle}
            onClick={() => _onAddClick(person)}
          >
            <Tilsette width='20' />
            <HorizontalSeparatorDiv />
            <ButtonLabel>
              {t('ui:form-add')}
            </ButtonLabel>
          </Knapp>
        )}
      </PersonCardDiv>
    </PersonCardPanel>
  )
}

PersonCard.propTypes = {
  className: PT.string,
  familierelasjonKodeverk: PT.arrayOf(KodeverkPropType.isRequired),
  onAddClick: PT.func,
  onRemoveClick: PT.func,
  person: PT.any.isRequired,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired)
}

export default PersonCard
