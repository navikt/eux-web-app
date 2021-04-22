import Period from 'components/Period/Period'
import Select from 'components/Select/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { ReplySed, Ytelse, Utbetalingshyppighet, YtelseNavn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastInput, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BeløpNavnOgValutaProps {
  highContrast: boolean
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const BeløpNavnOgValuta: React.FC<BeløpNavnOgValutaProps> = ({
  highContrast,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: BeløpNavnOgValutaProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.ytelse`
  const ytelse: Ytelse = _.get(replySed, target)
  const namespace: string = `familymanager-${personID}-beløpnavnogvaluta`

  const _currencyData = CountryData.getCurrencyInstance('nb')

  const [_newBarnetsNavn, _setNewBarnetsNavn] = useState<string>(ytelse?.barnetsNavn ?? '')
  const [_newYtelseNavn, _setNewYtelseNavn] = useState<YtelseNavn | undefined>(ytelse?.ytelseNavn as YtelseNavn)
  const [_newBeløp, _setNewBeløp] = useState<string>(ytelse?.beloep ?? '')
  const [_newValuta, _setNewValuta] = useState<Currency | undefined>(_currencyData.findByValue(ytelse?.valuta ?? ''))
  const [_newStartDato, _setNewStartDato] = useState<string>(ytelse?.startdato ?? '')
  const [_newSluttDato, _setNewSluttDato] = useState<string>(ytelse?.sluttdato ?? '')
  const [_newMottakersNavn, _setNewMottakersNavn] = useState<string>(ytelse?.mottakersNavn)
  const [_newUtbetalingshyppighet, _setNewUtbetalingshyppighet] = useState<Utbetalingshyppighet | undefined>(ytelse?.utbetalingshyppighet as Utbetalingshyppighet)

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setBarnetsNavn = () => {
    updateReplySed(`${target}.barnetsNavn`, _newBarnetsNavn)
    if (validation[namespace + '-barnetsNavn']) {
      resetValidation(namespace + '-barnetsNavn')
    }
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
        {t('el:title-amount-name-and-currency')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-barnetsNavn-text'}
            feil={validation[namespace + '-barnetsNavn']?.feilmelding}
            id={'c-' + namespace + '-barnetsNavn-text'}
            label={t('label:barnets-navn') + ' *'}
            onBlur={setBarnetsNavn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setNewBarnetsNavn(e.target.value)}
            placeholder={t('el:placeholder-input-default')}
            value={_newBarnetsNavn}
          />
        </Column>
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
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-beloep-text'}
            feil={validation[namespace + '-beloep']?.feilmelding}
            id={'c-' + namespace + '-beloep-text'}
            label={t('label:beløp') + ' *'}
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
      <VerticalSeparatorDiv data-size='2' />
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

export default BeløpNavnOgValuta
