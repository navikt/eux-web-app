import Input from 'components/Forms/Input'
import { Adresse, AdresseType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import { AlignStartRow, Column, FlexRadioPanels, RadioPanel, RadioPanelGroup, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
  useUK ?: boolean
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
  useUK = false
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
      land: land.trim()
    }, 'land')
  }

  return (
    <>
      <VerticalSeparatorDiv />
      {type && (
        <AlignStartRow>
          <Column flex='4'>
            <RadioPanelGroup
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
              <FlexRadioPanels>
                <RadioPanel error={validation[namespace + '-type']?.feilmelding} value='bosted'>{t('label:bostedsadresse')}</RadioPanel>
                <RadioPanel value='opphold'>{t('label:opphold')}</RadioPanel>
                <RadioPanel value='kontakt'>{t('label:kontakt')}</RadioPanel>
                <RadioPanel value='annet'>{t('label:annet')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
        </AlignStartRow>
      )}
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='3'>
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
        </Column>
        {!options.bygning === false && (
          <Column>
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
          </Column>
        )}
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
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
        </Column>
        <Column>
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
        </Column>
        {!options.region === false && (
          <Column>
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
          </Column>
        )}
        <Column>
          <div style={{ maxWidth: '400px' }}>
            <CountrySelect
              isDisabled={disabled}
              closeMenuOnSelect
              key={adresse?.land}
              data-testid={namespace + '-land'}
              error={validation[namespace + '-land']?.feilmelding}
              includeList={CountryFilter.STANDARD({ useUK })}
              flagWave
              id={namespace + '-land'}
              label={t('label:land')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setLand(e.value)}
              required={required.indexOf('land') >= 0}
              values={adresse?.land}
            />
          </div>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </>
  )
}

export default AdresseForm
