import React from "react";
import {PersonInfoPDL, PersonMedFamilie} from "declarations/types";
import {useTranslation} from "react-i18next";
import ukjent from "assets/icons/Unknown.png";
import kvinne from "assets/icons/Woman.png";
import mann from "assets/icons/Man.png";
import {Alert, Box, Heading, HStack, VStack} from "@navikt/ds-react";
import styled from 'styled-components'
import {toDateFormat} from "components/DateField/DateField";

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
  onAddClick?: (p: PersonInfoPDL) => void
  onRemoveClick?: (p: PersonInfoPDL) => void
  person: PersonMedFamilie | PersonInfoPDL
  disableAll?: boolean
}

const PersonPanel: React.FC<PersonPanelProps> = ({
 className, person
}: PersonPanelProps): JSX.Element => {
  const {fnr, foedselsdato, fornavn, etternavn, kjoenn} = (person)
  const {t} = useTranslation()

  let kind: string = 'nav-unknown-icon'
  let src = ukjent
  if (kjoenn === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (kjoenn === 'M') {
    kind = 'nav-man-icon'
    src = mann
  }

  return (
    <PersonBox className={className} borderWidth="1" padding="4" borderRadius="large" borderColor="border-default">
      <HStack gap="4">
        <img
          alt={kind}
          width={50}
          height={50}
          src={src}
        />
        <VStack>
          <Heading size='small' data-testid='panelheader__tittel__hoved'>
            {fornavn ? fornavn + ' ' : ''}
            {etternavn}
          </Heading>
          <Box>
            <div>{t('label:fnr') + ' : ' + fnr}</div>
            <div>{t('label:fødselsdato') + ': ' + toDateFormat(foedselsdato, 'DD.MM.YYYY')}</div>
          </Box>
          {person.adressebeskyttelse &&
            <Alert size="small" variant='warning'>
              {t('label:sensitivPerson', {gradering: person.adressebeskyttelse})}
            </Alert>
          }
        </VStack>
      </HStack>
    </PersonBox>
  )
}

export default PersonPanel
