import HelpIcon from 'assets/icons/HelpIcon'
import Select from 'components/Select/Select'
import { AlignStartRow, FlexCenterDiv, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastInput,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import Tooltip from 'rc-tooltip'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface FamilieYtelserProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const HelpProperIcon = styled(HelpIcon)`
  &.hjelpetekst__ikon {
    width: 22px;
    height: 22px;
  }
`

const FamilieYtelser: React.FC<FamilieYtelserProps> = ({
  highContrast,
  // updateReplySed,
  personID,
  // replySed,
  validation
}:FamilieYtelserProps): JSX.Element => {
  const { t } = useTranslation()
  const [_newBenefitCause, setNewBenefitCause] = useState<string>('')
  const [_newNumber, setNewNumber] = useState<string>('')
  const [_newAmount, setNewAmount] = useState<string>('')
  const [_newCurrency, setNewCurrency] = useState<Country | undefined>(undefined)
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newReceiver, setNewReceiver] = useState<string>('')
  const [_newFrequency, setNewFrequency] = useState<string>('')
  const namespace = 'familymanager-' + personID + '-familieytelser'

  const benefitCauseOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setNumber = (e: string) => {
    setNewNumber(e)
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
        {t('el:title-amount-for-whole-familie')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Select
            data-test-id={'c-' + namespace + '-benefitCause-text'}
            error={validation[namespace + '-benefitCause']?.feilmelding}
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
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-number-text'}
            feil={validation[namespace + '-number']?.feilmelding}
            id={'c-' + namespace + '-number-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)}
            value={_newNumber}
            label={t('label:antall-innvilges')}
            placeholder={t('el:placeholder-input-default')}
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
            label={(
              <FlexCenterDiv>
                <span>{t('label:beløp')}</span>
                <HorizontalSeparatorDiv data-size='0.5' />
                <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('message:help-familieytelser-beløp')}</span>}>
                  <HelpProperIcon className='hjelpetekst__ikon' />
                </Tooltip>
              </FlexCenterDiv>
            )}
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

export default FamilieYtelser
