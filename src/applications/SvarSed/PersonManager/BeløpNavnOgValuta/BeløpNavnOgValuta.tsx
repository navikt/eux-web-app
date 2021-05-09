import { updateReplySed } from 'actions/svarpased'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Utbetalingshyppighet, Ytelse, YtelseNavn } from 'declarations/sed'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastRadioPanelGroup, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface BeløpNavnOgValutaSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): BeløpNavnOgValutaSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  resetValidation: state.validation.resetValidation,
  validation: state.validation.status
})

const BeløpNavnOgValuta: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    resetValidation,
    validation
  } = useSelector<State, BeløpNavnOgValutaSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.ytelse`
  const ytelse: Ytelse = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-beløpnavnogvaluta`

  const _currencyData = CountryData.getCurrencyInstance('nb')

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setBarnetsNavn = (newBarnetsNavn: string) => {
    dispatch(updateReplySed(`${target}.barnetsNavn`, newBarnetsNavn.trim()))
    if (validation[namespace + '-barnetsNavn']) {
      resetValidation(namespace + '-barnetsNavn')
    }
  }

  const setYtelseNavn = (newYtelseNavn: YtelseNavn) => {
    dispatch(updateReplySed(`${target}.ytelseNavn`, newYtelseNavn.trim()))
    if (validation[namespace + '-ytelseNavn']) {
      resetValidation(namespace + '-ytelseNavn')
    }
  }

  const setBeløp = (newBeløp: string) => {
    dispatch(updateReplySed(`${target}.beloep`, newBeløp.trim()))
    if (validation[namespace + '-beloep']) {
      resetValidation(namespace + '-beloep')
    }
  }

  const setValuta = (newValuta: Currency) => {
    dispatch(updateReplySed(`${target}.valuta`, newValuta?.currencyValue))
    if (validation[namespace + '-valuta']) {
      resetValidation(namespace + '-valuta')
    }
  }

  const setStartDato = (newDato: string) => {
    dispatch(updateReplySed(`${target}.startdato`, newDato.trim()))
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (newDato: string) => {
    dispatch(updateReplySed(`${target}.sluttdato`, newDato.trim()))
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setMottakersNavn = (newMottakersNavn: string) => {
    dispatch(updateReplySed(`${target}.mottakersNavn`, newMottakersNavn.trim()))
    if (validation[namespace + '-mottakersNavn']) {
      resetValidation(namespace + '-mottakersNavn')
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet) => {
    dispatch(updateReplySed(`${target}.utbetalingshyppighet`, newUtbetalingshyppighet.trim()))
    if (validation[namespace + '-utbetalingshyppighet']) {
      resetValidation(namespace + '-utbetalingshyppighet')
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:beløp-navn-valuta-barn')}
      </Undertittel>
      <VerticalSeparatorDiv size={2} />
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
            key={_currencyData.findByValue(ytelse?.valuta ?? '')}
            closeMenuOnSelect
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
      <VerticalSeparatorDiv size='2' />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        {t('label:grant-date')}
      </Undertittel>
      <VerticalSeparatorDiv size={2} />
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
