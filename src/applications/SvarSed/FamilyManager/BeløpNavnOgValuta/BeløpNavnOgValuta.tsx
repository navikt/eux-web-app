import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { ReplySed, Utbetalingshyppighet, Ytelse, YtelseNavn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
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

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setBarnetsNavn = (newBarnetsNavn: string) => {
    updateReplySed(`${target}.barnetsNavn`, newBarnetsNavn)
    if (validation[namespace + '-barnetsNavn']) {
      resetValidation(namespace + '-barnetsNavn')
    }
  }

  const setYtelseNavn = (newYtelseNavn: YtelseNavn) => {
    updateReplySed(`${target}.ytelseNavn`, newYtelseNavn)
    if (validation[namespace + '-ytelseNavn']) {
      resetValidation(namespace + '-ytelseNavn')
    }
  }

  const setBeløp = (newBeløp: string) => {
    updateReplySed(`${target}.beloep`, newBeløp)
    if (validation[namespace + '-beloep']) {
      resetValidation(namespace + '-beloep')
    }
  }

  const setValuta = (newValuta: Currency) => {
    updateReplySed(`${target}.valuta`, newValuta?.currencyValue)
    if (validation[namespace + '-valuta']) {
      resetValidation(namespace + '-valuta')
    }
  }

  const setStartDato = (newDato: string) => {
    updateReplySed(`${target}.startdato`, newDato)
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (newDato: string) => {
    updateReplySed(`${target}.sluttdato`, newDato)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setMottakersNavn = (newMottakersNavn: string) => {
    updateReplySed(`${target}.mottakersNavn`, newMottakersNavn)
    if (validation[namespace + '-mottakersNavn']) {
      resetValidation(namespace + '-mottakersNavn')
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet) => {
    updateReplySed(`${target}.utbetalingshyppighet`, newUtbetalingshyppighet)
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
          <Input
            feil={validation[namespace + '-barnetsNavn']?.feilmelding}
            namespace={namespace}
            id='barnetsNavn'
            label={t('label:barnets-navn') + ' *'}
            onChanged={setBarnetsNavn}
            value={ytelse?.barnetsNavn ?? ''}
          />
        </Column>
        <Column>
          <Select
            data-test-id={namespace + '-ytelseNavn'}
            feil={validation[namespace + '-ytelseNavn']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-ytelseNavn'}
            label={t('label:betegnelse-på-ytelse') + ' *'}
            menuPortalTarget={document.body}
            onChange={(e: any) => setYtelseNavn(e.value)}
            options={ytelseNavnOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(ytelseNavnOptions, b => b.value === ytelse?.ytelseNavn as YtelseNavn)}
            defaultValue={_.find(ytelseNavnOptions, b => b.value === ytelse?.ytelseNavn as YtelseNavn)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Input
            feil={validation[namespace + '-beloep']?.feilmelding}
            namespace={namespace}
            id='beloep'
            label={t('label:beløp') + ' *'}
            onChanged={setBeløp}
            value={ytelse?.beloep ?? ''}
          />
        </Column>
        <Column>
          <CountrySelect
            ariaLabel={t('label:valuta')}
            data-test-id={namespace + '-valuta'}
            error={validation[namespace + '-valuta']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-valuta'}
            label={t('label:valuta') + ' *'}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={setValuta}
            type='currency'
            values={_currencyData.findByValue(ytelse?.valuta ?? '')}
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
          key={'' + ytelse?.startdato + ytelse?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={ytelse?.startdato ?? ''}
          valueSluttDato={ytelse?.sluttdato ?? ''}
        />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          <Input
            feil={validation[namespace + '-mottakersNavn']?.feilmelding}
            namespace={namespace}
            id='mottakersNavn'
            label={t('label:mottakers-navn') + ' *'}
            onChanged={setMottakersNavn}
            value={ytelse?.mottakersNavn ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={ytelse?.utbetalingshyppighet}
            data-no-border
            data-test-id={namespace + '-utbetalingshyppighet'}
            id={namespace + '-utbetalingshyppighet'}
            feil={validation[namespace + '-utbetalingshyppighet']?.feilmelding}
            name={namespace + '-utbetalingshyppighet'}
            legend={t('label:periode-avgrensing') + ' *'}
            radios={[
              { label: t('label:månedlig'), value: 'Månedlig' },
              { label: t('label:årlig'), value: 'Årlig' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtbetalingshyppighet(e.target.value as Utbetalingshyppighet)}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default BeløpNavnOgValuta
