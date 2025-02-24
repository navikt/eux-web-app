import React from "react";
import { HStack, Box, VStack, Heading, Ingress, Spacer} from "@navikt/ds-react";
import classNames from "classnames";
import { useTranslation } from 'react-i18next'
import styled from "styled-components";
import {PersonInfoPDL, PersonMedFamilie, Validation} from "../../../declarations/types";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import PersonPanel from "../PersonPanel/PersonPanel";
import {FadingLineSeparator} from "../../../components/StyledComponents";

export interface FamilieRelasjonerProps {
  personMedFamilie: PersonMedFamilie | null | undefined
  namespace?: string
  validation: Validation
}

export const WithErrorBox = styled(Box)`
  &.error {
    margin: -4px;
    border: 4px solid var(--a-border-danger) !important;
  }
`


const FamilieRelasjoner: React.FC<FamilieRelasjonerProps> = ({
  personMedFamilie, namespace, validation
}: FamilieRelasjonerProps): JSX.Element => {
  const { t } = useTranslation()

  const familieRelasjoner: Array<PersonInfoPDL> = [];

  personMedFamilie?.barn?.forEach((barn) => {
    barn.__rolle = "BARN"
    familieRelasjoner.push(barn)
  })

  if(personMedFamilie?.ektefelle){
    let ektefelle: PersonInfoPDL = personMedFamilie?.ektefelle
    ektefelle.__rolle = "EKTE"
    familieRelasjoner.push(ektefelle)
  }


  return(
    <WithErrorBox
      background="surface-default"
      borderWidth="1"
      borderColor="border-default"
      padding="4"
      data-testid='family'
      className={classNames({
        error: hasNamespaceWithErrors(validation, namespace! + "-familieRelasjoner")
      })}
    >
      <VStack gap="4">
        <Heading size='small'>
          {t('label:family-description')}
        </Heading>
        <HStack gap="4">
          <VStack gap="4">
            <Ingress>
              {t('label:familierelasjon-i-pdl')}
            </Ingress>
            {familieRelasjoner.map((r) =>
              <PersonPanel
                person={r}
                onAddClick={()=>{}}
              />
            )}
          </VStack>
          <Spacer/>
          <FadingLineSeparator className='fadeIn'>
            &nbsp;
          </FadingLineSeparator>
          <Spacer/>
          <VStack gap="4">
            <Ingress>
              {t('label:valgt-familie')}&nbsp;(0)
            </Ingress>
            {familieRelasjoner.map((r) =>
              <PersonPanel
                person={r}
                onRemoveClick={() => {}}
              />
            )}
          </VStack>
        </HStack>
      </VStack>
    </WithErrorBox>

  )
}

export default FamilieRelasjoner
