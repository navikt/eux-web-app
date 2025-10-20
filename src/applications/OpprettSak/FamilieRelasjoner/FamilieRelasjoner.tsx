import React, {useEffect, useState} from "react";
import {Box, VStack, Heading, BodyLong, HGrid, Button} from "@navikt/ds-react";
import classNames from "classnames";
import { useTranslation } from 'react-i18next'
import styled from "styled-components";
import {Kodeverk, PersonInfoPDL, PersonInfoUtland, PersonMedFamilie, Validation} from "../../../declarations/types";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import PersonPanel from "../PersonPanel/PersonPanel";
import {useAppDispatch, useAppSelector} from "../../../store";
import {addFamilierelasjoner, removeFamilierelasjoner} from "../../../actions/sak";
import {FadingLineSeparator} from "../../../components/StyledComponents";
import {State} from "../../../declarations/reducers";
import _ from "lodash";
import RelasjonUtland from "./RelasjonUtland";
import ErrorLabel from "../../../components/Forms/ErrorLabel";
import SearchPersonRelatert from "./SearchPersonRelatert";

export interface FamilieRelasjonerSelector {
  familierelasjonKodeverk: Array<Kodeverk> | undefined
  cdmVersjon: string | undefined
}

const mapState = (state: State): FamilieRelasjonerSelector => ({
  familierelasjonKodeverk: state.app.familierelasjoner,
  cdmVersjon: state.app.cdmVersjon
})

export interface FamilieRelasjonerProps {
  personMedFamilie: PersonMedFamilie | null | undefined
  valgteFamilieRelasjonerPDL: Array<PersonInfoPDL>
  valgteFamilieRelasjonerUtland: Array<PersonInfoUtland>
  namespace: string
  validation: Validation
}

export const WithErrorBox = styled(Box)`
  &.error {
    margin: -4px;
    border: 4px solid var(--a-border-danger) !important;
  }
`


const FamilieRelasjoner: React.FC<FamilieRelasjonerProps> = ({
  personMedFamilie, valgteFamilieRelasjonerPDL, valgteFamilieRelasjonerUtland, namespace, validation
}: FamilieRelasjonerProps): JSX.Element => {
  const {
    familierelasjonKodeverk,
    cdmVersjon
  }: FamilieRelasjonerSelector = useAppSelector(mapState)

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  namespace = namespace + '-familierelasjoner'

  const familieRelasjoner: Array<PersonInfoPDL> = [];
  const [_ikkeValgteFamilieRelasjoner, setIkkeValgteFamilieRelasjoner] = useState<Array<PersonInfoPDL>>(familieRelasjoner)
  const [_viewRelasjonUtland, setViewRelasjonUtland] = useState<boolean>(false)
  const [_viewPersonRelatert, setViewPersonRelatert] = useState<boolean>(false)
  const [_openAgain, setOpenAgain] = useState<boolean | null>(null)

  const toggleViewRelasjonUtland = (): void => setViewRelasjonUtland(!_viewRelasjonUtland)
  const toggleViewPersonRelatert = (): void => setViewPersonRelatert(!_viewPersonRelatert)


  const closeAndOpen = (): void => {
    setViewRelasjonUtland(false)
    setOpenAgain(false)
  }

  const openAgain = (): void => {
    setViewRelasjonUtland(true)
    setOpenAgain(true)
  }

  useEffect(() => {
    if(_openAgain === false){
      setTimeout(openAgain, 500)
    }
  }, [_openAgain])

  personMedFamilie?.barn?.forEach((barn) => {
    barn = {
      ...barn,
      __rolle:"BARN",
      __fraPersonMedFamilie:true
    }
    familieRelasjoner.push(barn)
  })

  if(personMedFamilie?.ektefelle){
    let ektefelle: PersonInfoPDL = personMedFamilie?.ektefelle
    ektefelle = {
      ...ektefelle,
      __rolle:"EKTE",
      __fraPersonMedFamilie:true
    }
    familieRelasjoner.push(ektefelle)
  }

  if(personMedFamilie?.annenperson){
    let annenperson: PersonInfoPDL = personMedFamilie?.annenperson
    annenperson = {
      ...annenperson,
      __rolle:"ANNEN",
      __fraPersonMedFamilie:true
    }
    familieRelasjoner.push(annenperson)
  }

  personMedFamilie?.andrepersoner?.forEach((annenPerson) => {
    annenPerson = {
      ...annenPerson,
      __rolle:"ANNEN",
      __fraPersonMedFamilie:true
    }
    familieRelasjoner.push(annenPerson)
  })

  const addRelasjonFromPDL = (relasjon: PersonInfoPDL) => {
    dispatch(addFamilierelasjoner(relasjon))
    setIkkeValgteFamilieRelasjoner(_ikkeValgteFamilieRelasjoner.filter(r => r.fnr !== relasjon.fnr))
  }

  const removeRelasjonFromPDL = (relasjon: PersonInfoPDL) => {
    const a: Array<PersonInfoPDL> = []
    a.push(relasjon)

    dispatch(removeFamilierelasjoner(relasjon))

    if(relasjon.__fraPersonMedFamilie){
      setIkkeValgteFamilieRelasjoner(_ikkeValgteFamilieRelasjoner.concat(a))
    }
  }

  const addRelasjonFromUtland = (relasjon: PersonInfoUtland) => {
    dispatch(addFamilierelasjoner(relasjon))
  }

  const removeRelasjonFromUtland = (relasjon: PersonInfoUtland) => {
    dispatch(removeFamilierelasjoner(relasjon))
  }

  const ekskluderteVerdier: Array<string> = ["SAMB", 'REPA']
  if (!_.isEmpty(valgteFamilieRelasjonerPDL)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjonerPDL?.find((relation: PersonInfoPDL) => relation.__rolle === 'EKTE')) {
      ekskluderteVerdier.push('EKTE')
    }
    // Det skal kun være mulig å legge til en relasjon av typen annen CDM 4.3 eller lavere
    if (cdmVersjon && parseFloat(cdmVersjon) <= 4.3 && valgteFamilieRelasjonerPDL?.find((relation: PersonInfoPDL) => relation.__rolle === 'ANNEN')) {
      ekskluderteVerdier.push('ANNEN')
    }
  }

  if (!_.isEmpty(valgteFamilieRelasjonerUtland)) {
    // Hvis ektefelle allerede er lagt til, fjern mulighet for andre typer samlivspartnere
    if (valgteFamilieRelasjonerUtland?.find((relation: PersonInfoUtland) => relation.__rolle === 'EKTE')) {
      ekskluderteVerdier.push('EKTE')
    }
    // Det skal kun være mulig å legge til en relasjon av typen annen CDM 4.3 eller lavere
    if (cdmVersjon && parseFloat(cdmVersjon) <= 4.3 && valgteFamilieRelasjonerUtland?.find((relation: PersonInfoUtland) => relation.__rolle === 'ANNEN')) {
      ekskluderteVerdier.push('ANNEN')
    }
  }

  const rolleList: Array<Kodeverk> = familierelasjonKodeverk!.filter((kt: Kodeverk) => !ekskluderteVerdier.includes(kt.kode))
  let totalValgt = 0

  if(valgteFamilieRelasjonerPDL && valgteFamilieRelasjonerPDL.length > 0) totalValgt = totalValgt + valgteFamilieRelasjonerPDL.length
  if(valgteFamilieRelasjonerUtland && valgteFamilieRelasjonerUtland.length > 0) totalValgt = totalValgt + valgteFamilieRelasjonerUtland.length

  const disableAddPerson = (rolle: string) => {
    return !!ekskluderteVerdier.find((ekskludertRolle: string) => ekskludertRolle === rolle)
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
        <HGrid gap="4" columns={'minmax(450px, auto) 21px minmax(450px, auto)'}>
          <VStack gap="4">
            <BodyLong size="large">
              {t('label:familierelasjon-i-pdl')}
            </BodyLong>
            {_ikkeValgteFamilieRelasjoner.map((r) =>
              <PersonPanel
                className='personNotSelected'
                person={r}
                onAddClick={(r: PersonInfoPDL | PersonInfoUtland) => addRelasjonFromPDL(r as PersonInfoPDL)}
                familierelasjonKodeverk={familierelasjonKodeverk}
                disableAll={disableAddPerson(r.__rolle!)}
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
          <FadingLineSeparator style={{marginLeft: '10px', marginRight: '10px'}} className='fadeIn'>
            &nbsp;
          </FadingLineSeparator>
          <VStack gap="4">
            <BodyLong size="large">
              {t('label:valgt-familie')}&nbsp;({totalValgt})
            </BodyLong>
            {valgteFamilieRelasjonerPDL?.map((r) =>
              <PersonPanel
                className='personSelected'
                person={r}
                onRemoveClick={(r: PersonInfoPDL | PersonInfoUtland) => removeRelasjonFromPDL(r as PersonInfoPDL)}
                familierelasjonKodeverk={familierelasjonKodeverk}
              />
            )}
            {valgteFamilieRelasjonerUtland?.map((r) =>
              <PersonPanel
                className='personSelected'
                person={r}
                onRemoveClick={(r: PersonInfoPDL | PersonInfoUtland) => removeRelasjonFromUtland(r as PersonInfoUtland)}
                familierelasjonKodeverk={familierelasjonKodeverk}
              />
            )}
          </VStack>
        </HGrid>
        <BodyLong size="large">
          {t('label:family-utland')}
        </BodyLong>
        {_viewRelasjonUtland &&
          <RelasjonUtland
            onAddClick={(r: PersonInfoUtland) => addRelasjonFromUtland(r)}
            validation={validation}
            namespace={namespace}
            rolleList={rolleList}
            valgteFamilieRelasjonerUtland={valgteFamilieRelasjonerUtland}
            closeAndOpen={closeAndOpen}
            setOpenAgain={setOpenAgain}
            flashBackground={_openAgain}
          />
        }
        <div>
          <Button
            variant='secondary'
            onClick={toggleViewRelasjonUtland}
          >
            {_viewRelasjonUtland
              ? t('label:skjul-skjema')
              : t('label:vis-skjema')}
          </Button>
        </div>
        <BodyLong size="large">
          {t('label:family-pdl')}
        </BodyLong>
        {_viewPersonRelatert &&
          <SearchPersonRelatert
            parentNamespace={namespace}
            rolleList={rolleList}
            onAddClick={(r: PersonInfoPDL | PersonInfoUtland) => addRelasjonFromPDL(r as PersonInfoPDL)}
            valgteFamilieRelasjonerPDL={valgteFamilieRelasjonerPDL}
            familieRelasjonerPDL={familieRelasjoner}
          />
        }
        <div>
          <Button
            variant='secondary'
            onClick={toggleViewPersonRelatert}
          >
            {_viewPersonRelatert
              ? t('label:skjul-skjema')
              : t('label:vis-skjema')}
          </Button>
        </div>
        <ErrorLabel error={validation[namespace + '-familieRelasjoner']?.feilmelding}/>
      </VStack>
    </WithErrorBox>

  )
}

export default FamilieRelasjoner
