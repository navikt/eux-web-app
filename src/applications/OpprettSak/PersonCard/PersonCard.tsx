import kvinne from 'assets/icons/Woman.png'
import mann from 'assets/icons/Man.png'
import ukjent from 'assets/icons/Unknown.png'
import { Delete, AddCircle } from '@navikt/ds-icons'
import { toDateFormat } from 'components/Forms/PeriodeInput'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv, FlexCenterSpacedDiv, FlexDiv } from '@navikt/hoykontrast'
import { OldFamilieRelasjon, Kodeverk, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import _ from 'lodash'
import { Button, Panel, Select, Heading } from '@navikt/ds-react'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const PersonCardPanel = styled(Panel)`
  background: transparent;
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
const Undertitle = styled.div`
  display: flex;
  flex-direction: column;
`
const RemoveButton = styled(Button)`
  display: flex;
  align-self: center;
  justify-self: flex-end;
`

export interface PersonCardProps {
  className?: string
  familierelasjonKodeverk?: Array<Kodeverk>
  onAddClick?: (p: Person | OldFamilieRelasjon) => void
  onRemoveClick?: (p: Person | OldFamilieRelasjon) => void
  person: Person | OldFamilieRelasjon
  rolleList?: Array<Kodeverk>,
  disableAll?: boolean
}

const PersonCard: React.FC<PersonCardProps> = ({
  className, familierelasjonKodeverk, onAddClick, onRemoveClick, person, rolleList, disableAll
}: PersonCardProps): JSX.Element => {
  const [rolle, setRolle] = useState<any>(undefined)
  const { fnr, fdato, fornavn, etternavn, kjoenn } = (person as OldFamilieRelasjon)
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

  if ((person as OldFamilieRelasjon).rolle && (familierelasjonKodeverk || rolleList)) {
    let rolleObjekt
    if (familierelasjonKodeverk) {
      rolleObjekt = familierelasjonKodeverk.find((item: any) => item.kode === (person as OldFamilieRelasjon).rolle)
    }
    if (rolleList) {
      rolleObjekt = rolleList.find((item: any) => item.kode === (person as OldFamilieRelasjon).rolle)
    }
    const kodeverkObjektTilTerm = (kodeverkObjekt: any) => {
      if (!kodeverkObjekt || !kodeverkObjekt.term) {
        return undefined
      }
      return Object.keys(kodeverkObjekt).includes('term') ? kodeverkObjekt.term : undefined
    }

    rolleTerm = kodeverkObjektTilTerm(rolleObjekt)
    if (!rolleTerm) {
      rolleTerm = t('label:ukjent-rolle')
    }
  }

  const _onRemoveClick = (p: Person | OldFamilieRelasjon) => {
    if (rolle) {
      (p as OldFamilieRelasjon).rolle = rolle
    }
    if (onRemoveClick) {
      onRemoveClick(p)
    }
  }

  const _onAddClick = (p: Person | OldFamilieRelasjon) => {
    if (rolle) {
      (p as OldFamilieRelasjon).rolle = rolle
    }
    if (onAddClick) {
      onAddClick(p)
    }
  }

  const updateFamilyRelation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRolle(e.target.value)
  }

  return (
    <PersonCardPanel border className={className}>
      <FlexCenterSpacedDiv>
        <FlexDiv>
          <img
            alt={kind}
            width={50}
            height={50}
            src={src}
          />
          <HorizontalSeparatorDiv />
          <div data-testid='panelheader__tittel'>
            <Heading size='small' data-testid='panelheader__tittel__hoved'>
              {fornavn}
              {' '}
              {etternavn}
              {(person as OldFamilieRelasjon).rolle ? ' - ' + rolleTerm : ''}
            </Heading>
            <Undertitle>
              <div>{t('label:fnr') + ' : ' + fnr}</div>
              <div>{t('label:fødselsdato') + ': ' + toDateFormat(fdato, 'DD.MM.YYYY')}</div>
            </Undertitle>
          </div>
        </FlexDiv>
        {_.isFunction(onRemoveClick) && (
          <FlexDiv>
            <HorizontalSeparatorDiv size='0.5' />
            <RemoveButton
              kompakt
              onClick={() => _onRemoveClick(person)}
              disabled={disableAll}
            >
              <Delete width='20' height='20' />
            </RemoveButton>
          </FlexDiv>
        )}
        {_.isFunction(onAddClick) && (
          <FlexDiv>
            <HorizontalSeparatorDiv size='0.5' />
            <Button
              variant='secondary'
              data-testid='familierelasjoner__knapp--legg-til'
              disabled={rolleList !== undefined && !rolle || disableAll}
              onClick={() => _onAddClick(person)}
            >
              <AddCircle width={20} />
            </Button>
          </FlexDiv>
        )}
      </FlexCenterSpacedDiv>
      {rolleList !== undefined && (
        <>
          <VerticalSeparatorDiv />
          <FlexDiv>
            <Select
              label={t('label:familierelasjon')}
              date-testid='familierelasjoner__select-familirelasjon-rolle'
              value={(person as OldFamilieRelasjon).rolle}
              onChange={updateFamilyRelation}
              disabled={disableAll}
            >
              <option value=''>{t('label:velg')}</option>
              {rolleList && rolleList.map((element: Kodeverk) => (
                <option value={element.kode} key={element.kode}>{element.term}</option>)
              )}
            </Select>
          </FlexDiv>
        </>
      )}
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
