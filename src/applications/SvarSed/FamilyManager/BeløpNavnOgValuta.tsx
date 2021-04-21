import Select from 'components/Select/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
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
  updateReplySed: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const BeløpNavnOgValuta: React.FC<BeløpNavnOgValutaProps> = ({
  highContrast,
  //updateReplySed,
  personID,
  //replySed,
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

  //const target = '${personID}.ytelse'
  //const ytelse = _.get(replySed, target)
  const namespace = `familymanager-${personID}-beløpNavnOgValuta`

  const benefitCauseOptions: Options = [{
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
            data-test-id={'c-' + namespace + '-name-text'}
            feil={validation[namespace + '-name']?.feilmelding}
            id={'c-' + namespace + '-name-text'}
            label={t('label:barnets-navn')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder={t('el:placeholder-input-default')}
            value={_newName}
          />
        </Column>
        <Column>
          <Select
            data-test-id={'c-' + namespace + '-benefitCause-text'}
            feil={validation[namespace + '-benefitCause']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-benefitCause-text'}
            label={t('label:betegnelse-på-ytelse')}
            menuPortalTarget={document.body}
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
            data-test-id={'c-' + namespace + '-amount-text'}
            feil={validation[namespace + '-amount']?.feilmelding}
            id={'c-' + namespace + '-amount-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            value={_newAmount}
            label={t('label:beløp')}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
        <Column>
          <CountrySelect
            ariaLabel={t('label:valuta')}
            data-test-id={'c-' + namespace + '-currency-text'}
            error={validation[namespace + '-currency']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-currency-text'}
            label={t('label:valuta')}
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
            data-test-id={'c-' + namespace + '-startdato-date'}
            feil={validation[namespace + '-startdato']?.feilmelding}
            id={'c-' + namespace + '-startdato-date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value)}
            value={_newStartDato}
            label={t('label:startdato')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-sluttdato-date'}
            feil={validation[namespace + '-sluttdato']?.feilmelding}
            id={'c-' + namespace + '-sluttdato-date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value)}
            value={_newSluttDato}
            label={t('label:sluttdato')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-receiver-text'}
            feil={validation[namespace + '--receiver']?.feilmelding}
            id={'c-' + namespace + '-receiver-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReceiver(e.target.value)}
            value={_newReceiver}
            label={t('label:mottakers-navn')}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newFrequency}
            data-no-border
            data-test-id={'c-' + namespace + '-frequency-text'}
            id={'c-' + namespace + '-frequency-text'}
            feil={validation[namespace + '-frequency']?.feilmelding}
            name={namespace + '-frequency'}
            legend={t('label:periode-avgrensing')}
            radios={[
              { label: t('label:månedlig'), value: 'Månedlig' },
              { label: t('label:årlig'), value: 'Årlig' }
            ]}
            onChange={(e: any) => setFrequency(e.target.value)}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default BeløpNavnOgValuta
