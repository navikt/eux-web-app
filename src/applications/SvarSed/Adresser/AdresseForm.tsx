import Input from 'components/Forms/Input'
import { Adresse, AdresseType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from '@navikt/land-verktoy'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CountryDropdown from "components/CountryDropdown/CountryDropdown";
import {HGrid, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import commonStyles from 'assets/css/common.module.css'

export interface AdresseFormProps {
  disabled?: boolean
  options?: {[k in string]: any}
  required?: Array<string>
  adresse: Adresse | null | undefined
  onAdressChanged: (a: Adresse, id: string) => void
  namespace: string
  validation: Validation
  type?: boolean
  keyForCity ?: string
  keyforZipCode ?: string
  labelforZipCode ?: string
}

const AdresseForm: React.FC<AdresseFormProps> = ({
  disabled = false,
  options = { bygning: true, region: true },
  required = ['type', 'by', 'land'],
  adresse,
  onAdressChanged,
  namespace,
  validation,
  type = true,
  keyForCity = 'by',
  keyforZipCode = 'postnummer',
  labelforZipCode = 'postnr',
}: AdresseFormProps) => {
  const { t } = useTranslation()

  const setType = (type: AdresseType) => {
    onAdressChanged({
      ...adresse,
      type: type.trim() as AdresseType
    }, 'type')
  }

  const setGate = (gate: string) => {
    onAdressChanged({
      ...adresse,
      gate: gate.trim()
    }, 'gate')
  }

  const setPostnummer = (postnummer: string) => {
    onAdressChanged({
      ...adresse,
      [keyforZipCode]: postnummer.trim()
    }, 'postnummer')
  }

  const setBy = (by: string) => {
    onAdressChanged({
      ...adresse,
      [keyForCity]: by.trim()
    }, 'by')
  }

  const setBygning = (bygning: string) => {
    onAdressChanged({
      ...adresse,
      bygning: bygning.trim()
    }, 'bygning')
  }

  const setRegion = (region: string) => {
    onAdressChanged({
      ...adresse,
      region: region.trim()
    }, 'region')
  }

  const setLand = (land: string) => {
    onAdressChanged({
      ...adresse,
      landkode: land.trim(),
    }, 'land')
  }

  return (
    <VStack gap="4">
      {type && (
        <RadioGroup
          disabled={disabled}
          value={adresse?.type}
          data-no-border
          data-testid={namespace + '-type'}
          error={validation[namespace + '-type']?.feilmelding}
          id={namespace + '-type'}
          legend={t('label:adresse-type') + (required.indexOf('type') >= 0 ? ' *' : '')}
          name={namespace + '-type'}
          required={required.indexOf('type') >= 0}
          onChange={(e: string) => setType((e as AdresseType))}
        >
          <HStack gap="4">
            <Radio className={commonStyles.radioPanel} value='bosted'>{t('label:bosted')}</Radio>
            <Radio className={commonStyles.radioPanel} value='opphold'>{t('label:opphold')}</Radio>
            <Radio className={commonStyles.radioPanel} value='kontakt'>{t('label:kontakt')}</Radio>
          </HStack>
        </RadioGroup>
      )}
      <HGrid columns={"2fr 1fr"} gap="4">
        <Input
          disabled={disabled}
          error={validation[namespace + '-gate']?.feilmelding}
          namespace={namespace}
          id='gate'
          label={t('label:gateadresse')}
          onChanged={setGate}
          required={required.indexOf('gate') >= 0}
          value={adresse?.gate}
        />
        {!options.bygning === false && (
          <Input
            disabled={disabled}
            error={validation[namespace + '-bygning']?.feilmelding}
            namespace={namespace}
            id='bygning'
            label={t('label:bygning')}
            onChanged={setBygning}
            required={required.indexOf('bygning') >= 0}
            value={adresse?.bygning}
          />
        )}
      </HGrid>
      <HGrid columns={4} gap="4" align="start">
        <Input
          disabled={disabled}
          error={validation[namespace + '-postnummer']?.feilmelding}
          namespace={namespace}
          id='postnummer'
          label={t('label:' + labelforZipCode)}
          onChanged={setPostnummer}
          required={required.indexOf('postnummer') >= 0}
          value={_.get(adresse, keyforZipCode)}
        />
        <Input
          disabled={disabled}
          error={validation[namespace + '-by']?.feilmelding}
          namespace={namespace}
          id='by'
          label={t('label:' + keyForCity)}
          onChanged={setBy}
          required={required.indexOf('by') >= 0}
          value={_.get(adresse, keyForCity)}
        />
      {!options.region === false && (
          <Input
            disabled={disabled}
            error={validation[namespace + '-region']?.feilmelding}
            namespace={namespace}
            id='region'
            label={t('label:region')}
            onChanged={setRegion}
            required={required!.indexOf('region') >= 0}
            value={adresse?.region}
          />
      )}
        <div style={{ maxWidth: '400px' }}>
          <CountryDropdown
            isDisabled={disabled}
            closeMenuOnSelect
            data-testid={namespace + '-land'}
            error={validation[namespace + '-land']?.feilmelding}
            countryCodeListName="verdensLand"
            flagWave
            id={namespace + '-land'}
            label={t('label:land')}
            onOptionSelected={(e: Country) => setLand(e.value3)}
            required={required.indexOf('land') >= 0}
            values={adresse?.landkode}
          />
        </div>
      </HGrid>
    </VStack>
  )
}

export default AdresseForm
