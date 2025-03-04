import React, {useState} from "react";
import {Box, VStack, Heading, BodyLong, HGrid} from "@navikt/ds-react";
import classNames from "classnames";
import { useTranslation } from 'react-i18next'
import styled from "styled-components";
import {Kodeverk, PersonInfoPDL, PersonMedFamilie, Validation} from "../../../declarations/types";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import PersonPanel from "../PersonPanel/PersonPanel";
import {useAppDispatch, useAppSelector} from "../../../store";
import {addFamilierelasjoner, removeFamilierelasjoner} from "../../../actions/sak";
import {FadingLineSeparator} from "../../../components/StyledComponents";
import {State} from "../../../declarations/reducers";
import _ from "lodash";

export interface FamilieRelasjonerSelector {
  familierelasjonKodeverk: Array<Kodeverk> | undefined
}

const mapState = (state: State): FamilieRelasjonerSelector => ({
  familierelasjonKodeverk: state.app.familierelasjoner,
})

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
  const {
    familierelasjonKodeverk
  }: FamilieRelasjonerSelector = useAppSelector(mapState)

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

  const ekskluderteVerdier: Array<string> = ["SAMB", 'REPA']
  if (!_.isEmpty(valgteFamilieRelasjoner)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjoner?.find((relation: PersonInfoPDL) => relation.__rolle === 'EKTE')) {
      ekskluderteVerdier.push('EKTE')
    }
    // Det skal kun være mulig å legge til en relasjon av typen annen
    if (valgteFamilieRelasjoner?.find((relation: PersonInfoPDL) => relation.__rolle === 'ANNEN')) {
      ekskluderteVerdier.push('ANNEN')
    }
  }

  const rolleList: Array<Kodeverk> = familierelasjonKodeverk!.filter((kt: Kodeverk) => !ekskluderteVerdier.includes(kt.kode))
  console.log(rolleList)

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
        <HGrid gap="4" columns={'minmax(450px, auto) 21px minmax(450px, auto)'}>
          <VStack gap="4">
            <BodyLong size="large">
              {t('label:familierelasjon-i-pdl')}
            </BodyLong>
            {_ikkeValgteFamilieRelasjoner.map((r) =>
              <PersonPanel
                className='personNotSelected'
                person={r}
                onAddClick={(r: PersonInfoPDL)=> addRelasjon(r)}
                familierelasjonKodeverk={familierelasjonKodeverk}
              />
            )}
            {!_.isEmpty(familieRelasjoner) && _.isEmpty(_ikkeValgteFamilieRelasjoner) && (
              <BodyLong>
                ({t('label:familie-alle-lagt-inn')})
              </BodyLong>
            )}
            {_.isEmpty(familieRelasjoner) && (
              <BodyLong>
                ({t('label:ingen-familie-i-pdl')})
              </BodyLong>
            )}
          </VStack>
          <FadingLineSeparator style={{ marginLeft: '10px', marginRight: '10px' }} className='fadeIn'>
            &nbsp;
          </FadingLineSeparator>
          <VStack gap="4">
            <BodyLong size="large">
              {t('label:valgt-familie')}&nbsp;({valgteFamilieRelasjoner ? valgteFamilieRelasjoner.length : 0})
            </BodyLong>
            {valgteFamilieRelasjoner?.map((r) =>
              <PersonPanel
                className='personSelected'
                person={r}
                onRemoveClick={(r: PersonInfoPDL)=> removeRelasjon(r)}
                familierelasjonKodeverk={familierelasjonKodeverk}
              />
            )}
          </VStack>
        </HGrid>
      </VStack>
    </WithErrorBox>

  )
}

export default FamilieRelasjoner
