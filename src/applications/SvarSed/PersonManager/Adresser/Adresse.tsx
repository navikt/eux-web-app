import { resetValidation } from 'actions/validation'
import Input from 'components/Forms/Input'
import { Adresse, AdresseType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import { AlignStartRow, Column, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface AdresseProps {
  adresse: Adresse | null | undefined
  onAdressChanged: (a: Adresse) => void
  namespace: string
  validation: Validation
  resetValidation: (fullnamespace: string) => void
}

const AdresseFC: React.FC<AdresseProps> = ({
  adresse,
  onAdressChanged,
  namespace,
  validation
}: AdresseProps) => {

  const { t } = useTranslation()

  const setType = (type: AdresseType) => {
    onAdressChanged({
      ...adresse,
      type: type.trim() as AdresseType
    })
    resetValidation(namespace + '-type')
  }

  const setGate = (gate: string) => {
    onAdressChanged({
      ...adresse,
      gate: gate.trim()
    })
    resetValidation(namespace + '-gate')
  }

  const setPostnummer = (postnummer: string) => {
    onAdressChanged({
      ...adresse,
      postnummer: postnummer.trim()
    })
    resetValidation(namespace + '-postnummer')
  }

  const setBy = (by: string) => {
    onAdressChanged({
      ...adresse,
      by: by.trim()
    })
    resetValidation(namespace + '-by')
  }

  const setBygning = (bygning: string) => {
    onAdressChanged({
      ...adresse,
      bygning: bygning.trim()
    })
    resetValidation(namespace + '-bygning')
  }

  const setRegion = (region: string) => {
    onAdressChanged({
      ...adresse,
      region: region.trim()
    })
    resetValidation(namespace + '-region')
  }

  const setLand = (land: string) => {
    onAdressChanged({
      ...adresse,
      land: land.trim()
    })
    resetValidation(namespace + '-land')
  }

  return (
    <div>
      <AlignStartRow>
        <Column flex='4'>
          <HighContrastRadioPanelGroup
            checked={adresse?.type}
            data-no-border
            data-test-id={namespace + '-type'}
            feil={validation[namespace + '-type']?.feilmelding}
            id={namespace + '-type'}
            legend={t('label:adresse') + ' *'}
            name={namespace + '-type'}
            radios={[
              { label: t('label:bostedsland'), value: 'bosted' },
              { label: t('label:oppholdsland'), value: 'opphold' }
            ]}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType((e.target.value as AdresseType))}
          />
          <VerticalSeparatorDiv size='0.15' />
          <HighContrastRadioPanelGroup
            checked={adresse?.type}
            data-no-border
            data-test-id={namespace + '-type'}
            feil={validation[namespace + '-type']?.feilmelding}
            id={namespace + '-type'}
            name={namespace + '-type'}
            radios={[
              { label: t('label:kontaktadresse'), value: 'kontakt' },
              { label: t('label:annet'), value: 'annet' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType((e.target.value as AdresseType))}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='3'>
          <Input
            feil={validation[namespace + '-gate']?.feilmelding}
            namespace={namespace}
            id='gate'
            label={t('label:gateadresse') + ' *'}
            onChanged={setGate}
            required
            value={adresse?.gate}
          />
        </Column>
        <Column>
          <Input
            feil={validation[namespace + '-bygning']?.feilmelding}
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
            feil={validation[namespace + '-postnummer']?.feilmelding}
            namespace={namespace}
            id='postnummer'
            label={t('label:postnummer') + ' *'}
            onChanged={setPostnummer}
            required
            value={adresse?.postnummer}
          />
        </Column>
        <Column flex='3'>
          <Input
            feil={validation[namespace + '-by']?.feilmelding}
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
            feil={validation[namespace + '-region']?.feilmelding}
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
            id={namespace  + '-land'}
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

export default AdresseFC
