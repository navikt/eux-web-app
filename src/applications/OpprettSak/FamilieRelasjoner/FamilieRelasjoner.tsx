import React, {useState} from "react";
import {Box, VStack, Heading, BodyLong, HGrid, HStack, Spacer, Ingress} from "@navikt/ds-react";
import classNames from "classnames";
import { useTranslation } from 'react-i18next'
import styled from "styled-components";
import {PersonInfoPDL, PersonMedFamilie, Validation} from "../../../declarations/types";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import PersonPanel from "../PersonPanel/PersonPanel";
import {useAppDispatch} from "../../../store";
import {addFamilierelasjoner, removeFamilierelasjoner} from "../../../actions/sak";
import {FadingLineSeparator} from "../../../components/StyledComponents";

export interface FamilieRelasjonerProps {
  personMedFamilie: PersonMedFamilie | null | undefined
  valgteFamilieRelasjoner: Array<PersonInfoPDL> | undefined
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
  personMedFamilie, valgteFamilieRelasjoner, namespace, validation
}: FamilieRelasjonerProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const familieRelasjoner: Array<PersonInfoPDL> = [];
  const [_ikkeValgteFamilieRelasjoner, setIkkeValgteFamilieRelasjoner] = useState<Array<PersonInfoPDL>>(familieRelasjoner)


  personMedFamilie?.barn?.forEach((barn) => {
    barn = {
      ...barn,
      __rolle:"BARN",
      __fraPDL:true
    }
    familieRelasjoner.push(barn)
  })

  if(personMedFamilie?.ektefelle){
    let ektefelle: PersonInfoPDL = personMedFamilie?.ektefelle
    ektefelle = {
      ...ektefelle,
      __rolle:"EKTE",
      __fraPDL:true
    }
    familieRelasjoner.push(ektefelle)
  }

  if(personMedFamilie?.annenperson){
    let annenperson: PersonInfoPDL = personMedFamilie?.annenperson
    annenperson = {
      ...annenperson,
      __rolle:"ANNEN",
      __fraPDL:true
    }
    familieRelasjoner.push(annenperson)
  }

  const addRelasjon = (relasjon: PersonInfoPDL) => {
    console.log("ADD: " + relasjon.fnr)
    dispatch(addFamilierelasjoner(relasjon))
    setIkkeValgteFamilieRelasjoner(_ikkeValgteFamilieRelasjoner.filter(r => r.fnr !== relasjon.fnr))
  }

  const removeRelasjon = (relasjon: PersonInfoPDL) => {
    const a: Array<PersonInfoPDL> = []
    a.push(relasjon)

    dispatch(removeFamilierelasjoner(relasjon))

    if(relasjon.__fraPDL){
      setIkkeValgteFamilieRelasjoner(_ikkeValgteFamilieRelasjoner.concat(a))
    }
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
        <HGrid gap="4" columns={'auto 21px auto'}>
          <VStack gap="4">
            <BodyLong size="large">
              {t('label:familierelasjon-i-pdl')}
            </BodyLong>
            {_ikkeValgteFamilieRelasjoner.map((r) =>
              <PersonPanel
                person={r}
                onAddClick={(r: PersonInfoPDL)=> addRelasjon(r)}
              />
            )}
          </VStack>
          <FadingLineSeparator style={{ marginLeft: '10px', marginRight: '10px' }} className='fadeIn'>
            &nbsp;
          </FadingLineSeparator>

          <VStack gap="4">
            <BodyLong size="large">
              {t('label:valgt-familie')}&nbsp;(0)
            </BodyLong>
            {valgteFamilieRelasjoner?.map((r) =>
              <PersonPanel
                className='personSelected'
                person={r}
                onRemoveClick={(r: PersonInfoPDL)=> removeRelasjon(r)}
              />
            )}
          </VStack>
        </HGrid>
      </VStack>
    </WithErrorBox>

  )
}

export default FamilieRelasjoner
