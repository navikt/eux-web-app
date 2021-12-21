import Input from 'components/Forms/Input'
import { Adresse, AdresseType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country, CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { AlignStartRow, Column, FlexRadioPanels, RadioPanel, RadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AdresseFormProps {
  options?: {[k in string]: any}
  required?: Array<string>
  adresse: Adresse | null | undefined
  onAdressChanged: (a: Adresse, id: string) => void
  namespace: string
  validation: Validation
  type?: boolean
  keyForCity ?: string
  keyforZipCode ?: string
  useUK ?: boolean
}

const RadioPanelGroupWithNoErrorVisible = styled(RadioPanelGroup)`
  .typo-feilmelding {
     display: none;
  }
`

const AdresseForm: React.FC<AdresseFormProps> = ({
  options = { bygning: true, region: true },
  required = ['type', 'by', 'land'],
  adresse,
  onAdressChanged,
  namespace,
  validation,
  type = true,
  keyForCity = 'by',
  keyforZipCode = 'postnummer',
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
    <div>
      {type && (
        <AlignStartRow>
          <Column flex='4'>
            <RadioPanelGroup
              value={adresse?.type}
              data-no-border
              data-test-id={namespace + '-type'}
              error={validation[namespace + '-type']?.feilmelding}
              id={namespace + '-type'}
              legend={t('label:adresse-type') + (required.indexOf('type') >= 0 ? ' *' : '')}
              name={namespace + '-type'}
              required={required.indexOf('type') >= 0}
              onChange={(e: string) => setType((e as AdresseType))}
            >
              <FlexRadioPanels>
                <RadioPanel value='bosted'>{t('label:bostedsland')}</RadioPanel>
                <RadioPanel value='opphold'>{t('label:oppholdsland')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
            <VerticalSeparatorDiv size='0.15' />
            <RadioPanelGroupWithNoErrorVisible
              value={adresse?.type}
              data-no-border
              data-test-id={namespace + '-type'}
              error={validation[namespace + '-type']?.feilmelding}
              id={namespace + '-type'}
              name={namespace + '-type'}
              required={required.indexOf('type') >= 0}
              onChange={(e: string) => setType((e as AdresseType))}
            >
              <FlexRadioPanels>
                <RadioPanel value='kontakt'>{t('label:kontaktadresse')}</RadioPanel>
                <RadioPanel value='annet'>{t('label:annet')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroupWithNoErrorVisible>
          </Column>
        </AlignStartRow>
      )}
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='3'>
          <Input
            error={validation[namespace + '-gate']?.feilmelding}
            namespace={namespace}
            id='gate'
            label={t('label:gateadresse') + (required.indexOf('gate') >= 0 ? ' *' : '')}
            onChanged={setGate}
            required={required.indexOf('gate') >= 0}
            value={adresse?.gate}
          />
        </Column>
        {!options.bygning === false && (
          <Column>
            <Input
              error={validation[namespace + '-bygning']?.feilmelding}
              namespace={namespace}
              id='bygning'
              label={t('label:bygning') + (required.indexOf('bygning') >= 0 ? ' *' : '')}
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
            error={validation[namespace + '-postnummer']?.feilmelding}
            namespace={namespace}
            id='postnummer'
            label={t('label:postnummer') + (required.indexOf('postnummer') >= 0 ? ' *' : '')}
            onChanged={setPostnummer}
            required={required.indexOf('postnummer') >= 0}
            value={_.get(adresse, keyforZipCode)}
          />
        </Column>
        <Column flex='3'>
          <Input
            error={validation[namespace + '-by']?.feilmelding}
            namespace={namespace}
            id='by'
            label={t('label:by') + (required.indexOf('by') >= 0 ? ' *' : '')}
            onChanged={setBy}
            required={required.indexOf('by') >= 0}
            value={_.get(adresse, keyForCity)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        {!options.region === false && (
          <Column flex='1.3'>
            <Input
              error={validation[namespace + '-region']?.feilmelding}
              namespace={namespace}
              id='region'
              label={t('label:region') + (required.indexOf('region') >= 0 ? ' *' : '')}
              onChanged={setRegion}
              required={required.indexOf('region') >= 0}
              value={adresse?.region}
            />
          </Column>
        )}
        <Column flex='1.3'>
          <div style={{ maxWidth: '400px' }}>
            <CountrySelect
              closeMenuOnSelect
              key={adresse?.land}
              data-test-id={namespace + '-land'}
              error={validation[namespace + '-land']?.feilmelding}
              includeList={CountryFilter.STANDARD({ useUK })}
              flagWave
              id={namespace + '-land'}
              label={t('label:land') + (required.indexOf('land') >= 0 ? ' *' : '')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setLand(e.value)}
              required={required.indexOf('land') >= 0}
              values={adresse?.land}
            />
          </div>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
    </div>
  )
}

export default AdresseForm
