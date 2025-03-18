import React, {useEffect, useState} from "react";
import {Kodeverk, PersonInfoUtland, Validation} from "../../../declarations/types";
import styled from "styled-components";
import {BodyLong, Button, HGrid, Select, TextField, VStack} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {Country} from "@navikt/land-verktoy";
import CountryDropdown from "../../../components/CountryDropdown/CountryDropdown";
import DateField from "../../../components/DateField/DateField";
import useLocalValidation from "../../../hooks/useLocalValidation";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {RelasjonUtlandValidationProps, validateRelasjonUtland} from "./validation";
import useUnmount from "../../../hooks/useUnmount";

export interface RelasjonUtlandProps {
  onAddClick?: (p: PersonInfoUtland) => void
  namespace: string
  validation: Validation
  rolleList: Array<Kodeverk>
  valgteFamilieRelasjonerUtland?: Array<PersonInfoUtland>
  closeAndOpen?: () => void
  setOpenAgain?: (s: any) => void
  flashBackground?: boolean | null
}

type StyleTypes = {
  flashBackground?: boolean | null
}

const FlashDiv = styled.div<StyleTypes>`
  background: #ffffff;
  animation: ${props => props.flashBackground ? 'fadeBackground 1s' : ''};

  @keyframes fadeBackground {
    from { background-color: #ffffff; }
    to { background-color: #FCE97F; }
  }
`

const RelasjonUtland: React.FC<RelasjonUtlandProps> =({
  namespace, rolleList, onAddClick, valgteFamilieRelasjonerUtland, closeAndOpen, setOpenAgain, flashBackground
}: RelasjonUtlandProps): JSX.Element => {
  const { t } = useTranslation()
  namespace = namespace + '-relasjonutland'
  const [_relation, setRelation] = useState<PersonInfoUtland>({})
  const [_validation, resetValidation, performValidation] = useLocalValidation<RelasjonUtlandValidationProps>(validateRelasjonUtland, namespace)

  useUnmount(() => {
    if(setOpenAgain) setOpenAgain(null)
  })

  useEffect(() => {
    setRelation({})
    resetValidation()
  }, [valgteFamilieRelasjonerUtland])

  const updateRelation = (felt: string, value: string): void => {
    setRelation({
      ..._relation,
      [felt]: value ?? ''
    })
    resetValidation(felt);
  }

  const onDatoChanged = (date: string) => {
    updateRelation('foedselsdato', date)
  }

  const addRelation = (): void => {
    const valid = performValidation({
      namespace,
      relation: _relation
    })

    if (valid && onAddClick) {
      onAddClick(_relation)
      if(closeAndOpen) closeAndOpen()
    }
  }

  return(
    <FlashDiv flashBackground={flashBackground}>
      <VStack gap="4">
        <BodyLong>{t('label:family-utland-add-form')}</BodyLong>
        <HGrid gap="4" columns={3} align="start">
          <TextField
            id={namespace + '-pin'}
            error={_validation[namespace + '-pin']?.feilmelding}
            label={t('label:utenlandsk-pin')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateRelation('pin', e.currentTarget.value)
            }}
            value={_relation.pin ?? ''}
          />
          <CountryDropdown
            id={namespace + '-pinLandkode'}
            error={_validation[namespace + '-pinLandkode']?.feilmelding}
            label={t('label:land')}
            countryCodeListName="euEftaLand"
            excludeNorway={true}
            onOptionSelected={(e: Country) => {
              updateRelation('pinLandkode', e.value3)
            }}
            values={_relation.pinLandkode ?? ''}
          />
          <CountryDropdown
            id={namespace + '-statsborgerskap'}
            error={_validation[namespace + '-statsborgerskap']?.feilmelding}
            countryCodeListName="statsborgerskap"
            label={t('label:statsborgerskap')}
            onOptionSelected={(e: Country) => {
              updateRelation('statsborgerskap', e.value3)
            }}
            values={_relation.statsborgerskap ?? ''}
          />
        </HGrid>
        <HGrid gap="4" columns={2} align="start">
          <TextField
            id={namespace + '-fornavn'}
            error={_validation[namespace + '-fornavn']?.feilmelding}
            label={t('label:fornavn')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateRelation('fornavn', e.currentTarget.value)
            }}
            value={_relation.fornavn ?? ''}
          />
          <TextField
            id={namespace + '-etternavn'}
            error={_validation[namespace + '-etternavn']?.feilmelding}
            label={t('label:etternavn')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateRelation('etternavn', e.currentTarget.value)

            }}
            value={_relation.etternavn ?? ''}
          />
        </HGrid>
        <HGrid gap="4" columns={2} align="start">
          <Select
            id={namespace + '-kjoenn'}
            error={_validation[namespace + '-kjoenn']?.feilmelding}
            label={t('label:kjønn')}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              updateRelation('kjoenn', e.currentTarget.value)
            }}
            value={_relation.kjoenn ?? ''}
          >
            <option value='' disabled>
              {t('el:placeholder-select-default')}
            </option>
            <option value="M" key="M">
              Mann
            </option>
            <option value="K" key="K">
              Kvinne
            </option>
            <option value="U" key="U">
              Ukjent
            </option>
          </Select>
          <DateField
            id='foedselsdato'
            error={_validation[namespace + '-foedselsdato']?.feilmelding}
            namespace={namespace!}
            label={t('label:fødselsdato')}
            onChanged={onDatoChanged}
            dateValue={_relation.foedselsdato}
          />
        </HGrid>
        <HGrid gap="4" columns={2} align="start">
          <Select
            id={namespace + '-familierelasjon'}
            error={_validation[namespace + '-familierelasjon']?.feilmelding}
            label={t('label:familierelasjon')}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              updateRelation('__rolle', e.currentTarget.value)
            }}
            value={_relation.__rolle}
          >
            <option value='' disabled selected>
              {t('el:placeholder-select-default')}
            </option>
            {rolleList.map((element: Kodeverk) => (
              <option value={element.kode} key={element.kode}>
                {element.term}
              </option>
            ))}
          </Select>
          <div style={{ marginTop: '2rem' }}>
            <Button
              variant='secondary'
              onClick={addRelation}
              className='relasjon familierelasjoner__knapp'
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add')}
            </Button>
          </div>
        </HGrid>
      </VStack>
    </FlashDiv>
  )
}

export default RelasjonUtland
