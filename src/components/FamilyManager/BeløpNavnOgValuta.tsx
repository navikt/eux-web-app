import Select from 'components/Select/Select'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface GrunnlagForBosettingProps {
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const RelasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

const Relasjon: React.FC<GrunnlagForBosettingProps> = ({
  highContrast,
  // onValueChanged,
  personID,
  // replySed,
  validation
}:GrunnlagForBosettingProps): JSX.Element => {
  const [_currentName, setCurrentName] = useState<string>('')
  const [_currentDesignationPerformance, setCurrentDesignationPerformance] = useState<string>('')
  const [_currentAmount, setCurrentAmount] = useState<string>('')
  const [_currentCurrency, setCurrentCurrency] = useState<Country | undefined>(undefined)
  const [_currentGrantStartDate, setCurrentGrantStartDate] = useState<string>('')
  const [_currentGrantEndDate, setCurrentGrantEndDate] = useState<string>('')
  const [_currentReceiverName, setCurrentReceiverName] = useState<string>('')
  const [_currentFrequency, setCurrentFrequency] = useState<string>('')

  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const setName = (e: string) => {
    setCurrentName(e)
    setIsDirty(true)
  }

  const setDesignationPerformance = (e: string) => {
    setCurrentDesignationPerformance(e)
    setIsDirty(true)
  }

  const setAmount = (e: string) => {
    setCurrentAmount(e)
    setIsDirty(true)
  }

  const setCurrency = (e: Country) => {
    setCurrentCurrency(e)
    setIsDirty(true)
  }

  const setGrantStartDate = (e: string) => {
    setCurrentGrantStartDate(e)
    setIsDirty(true)
  }

  const setGrantEndDate = (e: string) => {
    setCurrentGrantEndDate(e)
    setIsDirty(true)
  }

  const setReceiverName = (e: string) => {
    setCurrentReceiverName(e)
    setIsDirty(true)
  }

  const setFrequency = (e: string) => {
    setCurrentFrequency(e)
    setIsDirty(true)
  }

  return (
    <RelasjonDiv>
      <Undertittel>
        {t('ui:title-amount-name-and-currency')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-name-input'}
            feil={validation['person-' + personID + '-beløpNavnOgValuta-name']
              ? validation['person-' + personID + '-beløpNavnOgValuta-name']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-name-input'}
            onChange={(e: any) => setName(e.target.value)}
            value={_currentName}
            label={t('label:children-name')}
            placeholder={t('elements:placeholder-date-default')}
          />
        </Column>
        <Column>
          <Select
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-designationOfPerformance-select'}
            error={validation['person-' + personID + '-beløpNavnOgValuta-designationOfPerformance']
              ? validation['person-' + personID + '-beløpNavnOgValuta-designationOfPerformance']!.feilmelding
              : undefined}
            highContrast={highContrast}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-designationOfPerformance-select'}
            label={t('label:designation-of-performance')}
            onChange={(e: any) => setDesignationPerformance(e.value)}
            options={[{
              label: t('elements:option-declarationOfPerformance-barnetrygd'), value: 'Barnetrygd'
            }, {
              label: t('elements:option-declarationOfPerformance-kontantstøtte'), value: 'Kontantstøtte'
            }]}
            placeholder={t('elements:placeholder-select-default')}
            selectedValue={_currentDesignationPerformance}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-amount-input'}
            feil={validation['person-' + personID + '-beløpNavnOgValuta-amount']
              ? validation['person-' + personID + '-beløpNavnOgValuta-amount']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-amount-input'}
            onChange={(e: any) => setAmount(e.target.value)}
            value={_currentAmount}
            label={t('label:amount')}
            placeholder={t('elements:placeholder-input-default')}
          />
        </Column>
        <Column>
          <CountrySelect
            highContrast={highContrast}
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-currency-countryselect'}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-currency-countryselect'}
            ariaLabel={t('label:currency')}
            label={t('label:currency')}
            menuPortalTarget={document.body}
            values={_currentCurrency}
            locale='nb'
            error={undefined}
            type='currency'
            onOptionSelected={(country: Country) => setCurrency(country)}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Undertittel>
        {t('ui:title-grant-date')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-startdato-input'}
            feil={validation['person-' + personID + '-beløpNavnOgValuta-startdato']
              ? validation['person-' + personID + '-beløpNavnOgValuta-startdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-startdato-input'}
            onChange={(e: any) => setGrantStartDate(e.target.value)}
            value={_currentGrantStartDate}
            label={t('label:startDate')}
            placeholder={t('elements:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-sluttdato-input'}
            feil={validation['person-' + personID + '-beløpNavnOgValuta-sluttdato']
              ? validation['person-' + personID + '-beløpNavnOgValuta-sluttdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-sluttdato-input'}
            onChange={(e: any) => setGrantEndDate(e.target.value)}
            value={_currentGrantEndDate}
            label={t('label:endDate')}
            placeholder={t('elements:placeholder-date-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-receiverName-input'}
            feil={validation['person-' + personID + '-beløpNavnOgValuta-receiverName']
              ? validation['person-' + personID + '-beløpNavnOgValuta-receiverName']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-beløpNavnOgValuta-receiverName-input'}
            onChange={(e: any) => setReceiverName(e.target.value)}
            value={_currentReceiverName}
            label={t('label:receiver-name')}
            placeholder={t('elements:placeholder-input-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_currentFrequency}
            data-test-id={'c-familymanager-' + personID + '-beløpNavnOgValuta-frequency-radiogroup'}
            id={'c-familymanager-' + personID + '-frequency-radiogroup'}
            feil={validation['person-' + personID + '-frequency-radiogroup']
              ? validation['person-' + personID + '-frequency']!.feilmelding
              : undefined}
            name={'c-familymanager-' + personID + '-frequency-radiogroup'}
            legend={t('label:period-frequency')}
            radios={[
              { label: t('label:monthly'), value: 'Månedlig' },
              { label: t('label:yearly'), value: 'Årlig' }
            ]}
            onChange={(e: any) => setFrequency(e.target.value)}
          />
        </Column>
      </Row>
      {_isDirty && '*'}
    </RelasjonDiv>
  )
}

export default Relasjon
