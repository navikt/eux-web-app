import { resetValidation } from 'actions/validation'
import Input from 'components/Forms/Input'
import { Adresse, AdresseType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import { AlignStartRow, Column, FlexRadioPanels, RadioPanel, RadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface AdresseFormProps {
  adresse: Adresse | null | undefined
  onAdressChanged: (a: Adresse, id: string) => void
  namespace: string
  validation: Validation
  resetValidation: (fullnamespace: string) => void
  type?: boolean
}

const RadioPanelGroupWithNoErrorVisible = styled(RadioPanelGroup)`
  .typo-feilmelding {
     display: none;
  }
`

const AdresseForm: React.FC<AdresseFormProps> = ({
  adresse,
  onAdressChanged,
  namespace,
  validation,
  type = true
}: AdresseFormProps) => {
  const { t } = useTranslation()

  const setType = (type: AdresseType) => {
    onAdressChanged({
      ...adresse,
      type: type.trim() as AdresseType
    }, 'type')
    resetValidation(namespace + '-type')
  }

  const setGate = (gate: string) => {
    onAdressChanged({
      ...adresse,
      gate: gate.trim()
    }, 'gate')
    resetValidation(namespace + '-gate')
  }

  const setPostnummer = (postnummer: string) => {
    onAdressChanged({
      ...adresse,
      postnummer: postnummer.trim()
    }, 'postnummer')
    resetValidation(namespace + '-postnummer')
  }

  const setBy = (by: string) => {
    onAdressChanged({
      ...adresse,
      by: by.trim()
    }, 'by')
    resetValidation(namespace + '-by')
  }

  const setBygning = (bygning: string) => {
    onAdressChanged({
      ...adresse,
      bygning: bygning.trim()
    }, 'bygning')
    resetValidation(namespace + '-bygning')
  }

  const setRegion = (region: string) => {
    onAdressChanged({
      ...adresse,
      region: region.trim()
    }, 'region')
    resetValidation(namespace + '-region')
  }

  const setLand = (land: string) => {
    onAdressChanged({
      ...adresse,
      land: land.trim()
    }, 'land')
    resetValidation(namespace + '-land')
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
              legend={t('label:adresse') + ' *'}
              name={namespace + '-type'}
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
            label={t('label:gateadresse')}
            onChanged={setGate}
            value={adresse?.gate}
          />
        </Column>
        <Column>
          <Input
            error={validation[namespace + '-bygning']?.feilmelding}
            namespace={namespace}
            id='bygning'
            label={t('label:bygning')}
            onChanged={setBygning}
            value={adresse?.bygning}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-postnummer']?.feilmelding}
            namespace={namespace}
            id='postnummer'
            label={t('label:postnummer')}
            onChanged={setPostnummer}
            value={adresse?.postnummer}
          />
        </Column>
        <Column flex='3'>
          <Input
            error={validation[namespace + '-by']?.feilmelding}
            namespace={namespace}
            id='by'
            label={t('label:by') + ' *'}
            onChanged={setBy}
            required
            value={adresse?.by}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='1.3'>
          <Input
            error={validation[namespace + '-region']?.feilmelding}
            namespace={namespace}
            id='region'
            label={t('label:region')}
            onChanged={setRegion}
            value={adresse?.region}
          />
        </Column>
        <Column flex='1.3'>
          <CountrySelect
            closeMenuOnSelect
            key={adresse?.land}
            data-test-id={namespace + '-land'}
            error={validation[namespace + '-land']?.feilmelding}
            flagWave
            id={namespace + '-land'}
            label={t('label:land') + ' *'}
            menuPortalTarget={document.body}
            onOptionSelected={(e: Country) => setLand(e.value)}
            placeholder={t('el:placeholder-select-default')}
            values={adresse?.land}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
    </div>
  )
}

export default AdresseForm
