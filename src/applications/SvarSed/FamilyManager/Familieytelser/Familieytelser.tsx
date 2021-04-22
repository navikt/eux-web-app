import HelpIcon from 'assets/icons/HelpIcon'
import Period from 'components/Period/Period'
import Select from 'components/Select/Select'
import { AlignStartRow, FlexCenterDiv, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { Motregning, ReplySed, Utbetalingshyppighet, YtelseNavn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import CountryData, { Currency } from 'land-verktoy'
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
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
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
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: FamilieYtelserProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.motregning[0]`
  const motregning: Motregning = _.get(replySed, target)
  const namespace: string = `familymanager-${personID}-familieytelser`

  const _currencyData = CountryData.getCurrencyInstance('nb')

  const [_newYtelseNavn, _setNewYtelseNavn] = useState<YtelseNavn | undefined>(motregning?.ytelseNavn as YtelseNavn)
  const [_newNumber, setNewNumber] = useState<string>('')
  const [_newBeløp, _setNewBeløp] = useState<string>(motregning?.beloep ?? '')
  const [_newValuta, _setNewValuta] = useState<Currency | undefined>(_currencyData.findByValue(motregning?.valuta ?? ''))
  const [_newStartDato, _setNewStartDato] = useState<string>(motregning?.startdato ?? '')
  const [_newSluttDato, _setNewSluttDato] = useState<string>(motregning?.sluttdato ?? '')
  const [_newMottakersNavn, _setNewMottakersNavn] = useState<string>(motregning?.mottakersNavn)
  const [_newUtbetalingshyppighet, _setNewUtbetalingshyppighet] = useState<Utbetalingshyppighet | undefined>(motregning?.utbetalingshyppighet as Utbetalingshyppighet)

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setNumber = (e: string) => {
    setNewNumber(e)
  }

  const setYtelseNavn = (ytelseNavn: YtelseNavn) => {
    _setNewYtelseNavn(ytelseNavn)
    updateReplySed(`${target}.ytelseNavn`, ytelseNavn)
    if (validation[namespace + '-ytelseNavn']) {
      resetValidation(namespace + '-ytelseNavn')
    }
  }

  const setBeløp = () => {
    updateReplySed(`${target}.beloep`, _newBeløp)
    if (validation[namespace + '-beloep']) {
      resetValidation(namespace + '-beloep')
    }
  }

  const setValuta = (valuta: Currency) => {
    _setNewValuta(valuta)
    updateReplySed(`${target}.valuta`, _newValuta?.currencyValue)
    if (validation[namespace + '-valuta']) {
      resetValidation(namespace + '-valuta')
    }
  }

  const setStartDato = (dato: string) => {
    _setNewStartDato(dato)
    updateReplySed(`${target}.startdato`, dato)
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (dato: string) => {
    _setNewSluttDato(dato)
    updateReplySed(`${target}.sluttdato`, dato)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setMottakersNavn = (mottakersNavn: string) => {
    updateReplySed(`${target}.mottakersNavn`, mottakersNavn)
    if (validation[namespace + '-mottakersNavn']) {
      resetValidation(namespace + '-mottakersNavn')
    }
  }

  const setUtbetalingshyppighet = (utbetalingshyppighet: Utbetalingshyppighet) => {
    _setNewUtbetalingshyppighet(utbetalingshyppighet)
    updateReplySed(`${target}.utbetalingshyppighet`, utbetalingshyppighet)
    if (validation[namespace + '-utbetalingshyppighet']) {
      resetValidation(namespace + '-utbetalingshyppighet')
    }
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
            data-test-id={'c-' + namespace + '-ytelseNavn-text'}
            feil={validation[namespace + '-ytelseNavn']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-ytelseNavn-text'}
            label={t('label:betegnelse-på-ytelse') + ' *'}
            menuPortalTarget={document.body}
            onChange={(e: any) => setYtelseNavn(e.value)}
            options={ytelseNavnOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(ytelseNavnOptions, b => b.value === _newYtelseNavn)}
            defaultValue={_.find(ytelseNavnOptions, b => b.value === _newYtelseNavn)}
          />
        </Column>
        <Column>
          <HighContrastInput
            type='number'
            data-test-id={'c-' + namespace + '-number-text'}
            feil={validation[namespace + '-number']?.feilmelding}
            id={'c-' + namespace + '-number-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)}
            value={_newNumber}
            label={t('label:antall-innvilges') + ' *'}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-beloep-text'}
            feil={validation[namespace + '-beloep']?.feilmelding}
            id={'c-' + namespace + '-beloep-text'}
            label={(
              <FlexCenterDiv>
                <span>{t('label:beløp') + ' *'}</span>
                <HorizontalSeparatorDiv data-size='0.5' />
                <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('message:help-familieytelser-beløp')}</span>}>
                  <HelpProperIcon className='hjelpetekst__ikon' />
                </Tooltip>
              </FlexCenterDiv>
            )}
            onBlur={setBeløp}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setNewBeløp(e.target.value)}
            placeholder={t('el:placeholder-input-default')}
            value={_newBeløp}
          />
        </Column>
        <Column>
          <CountrySelect
            ariaLabel={t('label:valuta')}
            data-test-id={'c-' + namespace + '-valuta-text'}
            error={validation[namespace + '-valuta']?.feilmelding}
            highContrast={highContrast}
            id={'c-' + namespace + '-valuta-text'}
            label={t('label:valuta') + ' *'}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={setValuta}
            type='currency'
            values={_newValuta}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        {t('el:title-grant-date')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Period
          key={'' + _newStartDato + _newSluttDato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={_newStartDato}
          valueSluttDato={_newSluttDato}
        />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-mottakersNavn-text'}
            feil={validation[namespace + '--mottakersNavn']?.feilmelding}
            id={'c-' + namespace + '-mottakersNavn-text'}
            label={t('label:mottakers-navn') + ' *'}
            onBlur={setMottakersNavn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setNewMottakersNavn(e.target.value)}
            value={_newMottakersNavn}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_newUtbetalingshyppighet}
            data-no-border
            data-test-id={'c-' + namespace + '-utbetalingshyppighet-text'}
            id={'c-' + namespace + '-utbetalingshyppighet-text'}
            feil={validation[namespace + '-utbetalingshyppighet']?.feilmelding}
            name={namespace + '-utbetalingshyppighet'}
            legend={t('label:periode-avgrensing') + ' *'}
            radios={[
              { label: t('label:månedlig'), value: 'Månedlig' },
              { label: t('label:årlig'), value: 'Årlig' }
            ]}
            onChange={(e: any) => setUtbetalingshyppighet(e.target.value)}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default FamilieYtelser
