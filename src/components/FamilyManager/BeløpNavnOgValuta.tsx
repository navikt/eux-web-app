import Select from 'components/Select/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BeløpNavnOgValutaProps {
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const BeløpNavnOgValuta: React.FC<BeløpNavnOgValutaProps> = ({
  highContrast,
  // onValueChanged,
  personID,
  // replySed,
  validation
}: BeløpNavnOgValutaProps): JSX.Element => {
  const { t } = useTranslation()
  const [_newName, setNewName] = useState<string>('')
  const [_newBenefitCause, setNewBenefitCause] = useState<string>('')
  const [_newAmount, setNewAmount] = useState<string>('')
  const [_newCurrency, setNewCurrency] = useState<Country | undefined>(undefined)
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newReceiver, setNewReceiver] = useState<string>('')
  const [_newFrequency, setNewFrequency] = useState<string>('')
  const namespace = 'familymanager-' + personID + '-beløpNavnOgValuta'

  const benefitCauseOptions = [{
    label: t('el:option-benefitCause-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-benefitCause-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setName = (e: string) => {
    setNewName(e)
  }

  const setBenefitCause = (e: string) => {
    setNewBenefitCause(e)
  }

  const setAmount = (e: string) => {
    setNewAmount(e)
  }

  const setCurrency = (e: Country) => {
    setNewCurrency(e)
  }

  const setStartDato = (e: string) => {
    setNewStartDato(e)
  }

  const setSluttDato = (e: string) => {
    setNewSluttDato(e)
  }

  const setReceiver = (e: string) => {
    setNewReceiver(e)
  }

  const setFrequency = (e: string) => {
    setNewFrequency(e)
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('el:title-amount-name-and-currency')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-name-input'}
            feil={validation[namespace + '-name']?.feilmelding}
            id={'c-' + namespace + '-name-input'}
            label={t('label:children-name')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder={t('el:placeholder-input-default')}
            value={_newName}
          />
        </Column>
        <Column>
          <Select
            data-test-id={'c-' + namespace + '-benefitCause-select'}
            feil={validation[namespace + '-benefitCause']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-benefitCause-select'}
            label={t('label:benefit-cause')}
            onChange={(e: any) => setBenefitCause(e.value)}
            options={benefitCauseOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(benefitCauseOptions, b => b.value === _newBenefitCause)}
            defaultValue={_.find(benefitCauseOptions, b => b.value === _newBenefitCause)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-amount-input'}
            feil={validation[namespace + '-amount']?.feilmelding}
            id={'c-' + namespace + '-amount-input'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            value={_newAmount}
            label={t('label:amount')}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
        <Column>
          <CountrySelect
            ariaLabel={t('label:currency')}
            data-test-id={'c-' + namespace + '-currency-countryselect'}
            error={validation[namespace + '-currency']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-currency-countryselect'}
            label={t('label:currency')}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={(country: Country) => setCurrency(country)}
            type='currency'
            values={_newCurrency}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        {t('el:title-grant-date')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-startdato-input'}
            feil={validation[namespace + '-startdato']?.feilmelding}
            id={'c-' + namespace + '-startdato-input'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value)}
            value={_newStartDato}
            label={t('label:start-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-sluttdato-input'}
            feil={validation[namespace + '-sluttdato']?.feilmelding}
            id={'c-' + namespace + '-sluttdato-input'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value)}
            value={_newSluttDato}
            label={t('label:end-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-receiver-input'}
            feil={validation[namespace + '--receiver']?.feilmelding}
            id={'c-' + namespace + '-receiver-input'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReceiver(e.target.value)}
            value={_newReceiver}
            label={t('label:receiver-name')}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newFrequency}
            data-test-id={'c-' + namespace + '-frequency-radiogroup'}
            id={'c-' + namespace + '-frequency-radiogroup'}
            feil={validation[namespace + '-frequency']?.feilmelding}
            name={namespace + '-frequency'}
            legend={t('label:period-frequency')}
            radios={[
              { label: t('label:monthly'), value: 'Månedlig' },
              { label: t('label:yearly'), value: 'Årlig' }
            ]}
            onChange={(e: any) => setFrequency(e.target.value)}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default BeløpNavnOgValuta
