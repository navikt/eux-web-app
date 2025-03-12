import React, {useState} from "react";
import {Kodeverk, PersonInfoPDL, PersonInfoUtland, PersonMedFamilie} from "declarations/types";
import {useTranslation} from "react-i18next";
import ukjent from "assets/icons/Unknown.png";
import kvinne from "assets/icons/Woman.png";
import mann from "assets/icons/Man.png";
import {Alert, Box, Heading, HStack, VStack, Button, Spacer, Select} from "@navikt/ds-react";
import { TrashIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import styled from 'styled-components'
import {toDateFormat} from "components/DateField/DateField";
import _, {cloneDeep} from "lodash";

const PersonBox = styled(Box)`
  min-width: 400px;
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

export interface PersonPanelProps {
  className?: string
  onAddClick?: (p: PersonInfoPDL | PersonInfoUtland) => void
  onRemoveClick?: (p: PersonInfoPDL | PersonInfoUtland) => void
  person: PersonMedFamilie | PersonInfoPDL | PersonInfoUtland
  familierelasjonKodeverk?: Array<Kodeverk>
  rolleList?: Array<Kodeverk>,
  disableAll?: boolean
}

const PersonPanel: React.FC<PersonPanelProps> = ({
 className, person, familierelasjonKodeverk, rolleList, onAddClick, onRemoveClick, disableAll
}: PersonPanelProps): JSX.Element => {
  const {t} = useTranslation()
  const [rolle, setRolle] = useState<any>(undefined)

  const isPersonPDL = (person: PersonInfoPDL | PersonInfoUtland) => {
    return ("fnr" in person)
  }

  const isPersonUtland = (person: PersonInfoPDL | PersonInfoUtland) => {
    return ("pin" in person)
  }

  let kind: string = 'nav-unknown-icon'
  let src = ukjent
  if (person.kjoenn === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (person.kjoenn === 'M') {
    kind = 'nav-man-icon'
    src = mann
  }

  let rolleTerm

  if ((person as PersonInfoPDL).__rolle && (familierelasjonKodeverk || rolleList)) {
    let rolleObjekt
    if (familierelasjonKodeverk) {
      rolleObjekt = familierelasjonKodeverk.find((item: any) => item.kode === (person as PersonInfoPDL).__rolle)
    }
    if (rolleList) {
      rolleObjekt = rolleList.find((item: any) => item.kode === (person as PersonInfoPDL).__rolle)
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

  const updateRolle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value !== ""){
      setRolle(e.target.value)
    } else {
      setRolle(undefined)
    }
  }

  const _onAddClick = (p: PersonInfoPDL | PersonInfoUtland) => {
    const pp = cloneDeep(p)
    if (rolle) {
      (pp as PersonInfoPDL).__rolle = rolle
    }
    if (onAddClick) {
      onAddClick(pp)
    }
  }

  return (
    <PersonBox className={className} borderWidth="1" padding="4" borderRadius="large" borderColor="border-default">
      <VStack gap="4">
        <HStack gap="4">
          <img
            alt={kind}
            width={50}
            height={50}
            src={src}
          />
          <VStack>
            <Heading size='small' data-testid='panelheader__tittel__hoved'>
              {person.fornavn ? person.fornavn + ' ' : ''}
              {person.etternavn}
              {(person as PersonInfoPDL).__rolle ? ' - ' + rolleTerm : ''}
            </Heading>
            <Box>
              {isPersonPDL(person) && <div>{t('label:fnr') + ' : ' + (person as PersonInfoPDL).fnr}</div>}
              {isPersonUtland(person) && <div>{t('label:pin') + ' : ' + (person as PersonInfoUtland).pin}</div>}
              <div>{t('label:fødselsdato') + ': ' + toDateFormat(person.foedselsdato, 'DD.MM.YYYY')}</div>
            </Box>
            {isPersonPDL(person) && (person as PersonInfoPDL).adressebeskyttelse && (person as PersonInfoPDL).adressebeskyttelse !== "UGRADERT" &&
              <Alert size="small" variant='warning'>
                {t('label:sensitivPerson', {gradering: (person as PersonInfoPDL).adressebeskyttelse})}
              </Alert>
            }
          </VStack>
          <Spacer/>
          {_.isFunction(onRemoveClick) && (
            <Box>
              <Button
                onClick={() => onRemoveClick(person)}
                icon={<TrashIcon/>}
                disabled={disableAll}
              />
            </Box>
          )}
          {_.isFunction(onAddClick) && (
            <Box>
              <Button
                variant='secondary'
                onClick={() => _onAddClick(person)}
                icon={<PlusCircleIcon/>}
                disabled={rolleList !== undefined && !rolle || disableAll}
              />
            </Box>
          )}
        </HStack>
        {rolleList !== undefined && (
          <Select
            label={t('label:familierelasjon')}
            value={(person as PersonInfoPDL).__rolle}
            onChange={updateRolle}
            disabled={disableAll}
          >
            <option value=''>{t('label:velg')}</option>
            {rolleList && rolleList.map((element: Kodeverk) => (
              <option value={element.kode} key={element.kode}>{element.term}</option>)
            )}
          </Select>
        )}
      </VStack>
    </PersonBox>
  )
}

export default PersonPanel
