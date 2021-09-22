import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import HelpIcon from 'assets/icons/HelpIcon'
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
import {
  AlignStartRow,
  Column,
  FlexCenterSpacedDiv,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const HelpProperIcon = styled(HelpIcon)`
  &.hjelpetekst__ikon {
    width: 22px;
    height: 22px;
  }
`

interface FamilieYtelserSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): FamilieYtelserSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const FamilieYtelser: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  } = useSelector<State, FamilieYtelserSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.ytelse`
  const ytelse: Ytelse = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-familieytelser`
  const _currencyData = CountryData.getCurrencyInstance('nb')

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setAntallPersoner = (newAntallPersoner: string) => {
    dispatch(updateReplySed(`${target}.antallPersoner`, newAntallPersoner.trim()))
    if (validation[namespace + '-antallPersoner']) {
      dispatch(resetValidation(namespace + '-antallPersoner'))
    }
  }

  const setYtelseNavn = (ytelseNavn: YtelseNavn) => {
    dispatch(updateReplySed(`${target}.ytelseNavn`, ytelseNavn))
    if (validation[namespace + '-ytelseNavn']) {
      dispatch(resetValidation(namespace + '-ytelseNavn'))
    }
  }

  const setBeløp = (newBeløp: string) => {
    dispatch(updateReplySed(`${target}.beloep`, newBeløp))
    if (validation[namespace + '-beloep']) {
      dispatch(resetValidation(namespace + '-beloep'))
    }
  }

  const setValuta = (newValuta: Currency) => {
    dispatch(updateReplySed(`${target}.valuta`, newValuta?.value))
    if (validation[namespace + '-valuta']) {
      dispatch(resetValidation(namespace + '-valuta'))
    }
  }

  const setStartDato = (newDato: string) => {
    dispatch(updateReplySed(`${target}.startdato`, newDato))
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
  }

  const setSluttDato = (newDato: string) => {
    dispatch(updateReplySed(`${target}.sluttdato`, newDato))
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  const setMottakersNavn = (newMottakersNavn: string) => {
    dispatch(updateReplySed(`${target}.mottakersNavn`, newMottakersNavn))
    if (validation[namespace + '-mottakersNavn']) {
      dispatch(resetValidation(namespace + '-mottakersNavn'))
    }
  }

  const setUtbetalingshyppighet = (newUtbetalingshyppighet: Utbetalingshyppighet) => {
    dispatch(updateReplySed(`${target}.utbetalingshyppighet`, newUtbetalingshyppighet))
    if (validation[namespace + '-utbetalingshyppighet']) {
      dispatch(resetValidation(namespace + '-utbetalingshyppighet'))
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:beløp-for-hele-familien')}
      </Undertittel>
      <VerticalSeparatorDiv size={2} />
      <AlignStartRow className='slideInFromLeft'>
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
        <Column>
          <Input
            type='number'
            min='0'
            feil={validation[namespace + '-antallPersoner']?.feilmelding}
            key={'antall-innvilges' + ytelse?.antallPersoner}
            namespace={namespace}
            id='antallPersoner'
            label={t('label:antall-innvilges') + ' *'}
            onChanged={setAntallPersoner}
            value={ytelse?.antallPersoner ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Input
            type='number'
            min='0'
            feil={validation[namespace + '-beloep']?.feilmelding}
            namespace={namespace}
            id='beloep'
            label={(
              <FlexCenterSpacedDiv>
                <span>{t('label:beløp') + ' *'}</span>
                <HorizontalSeparatorDiv size='0.5' />
                <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('message:help-familieytelser-beløp')}</span>}>
                  <HelpProperIcon className='hjelpetekst__ikon' />
                </Tooltip>
              </FlexCenterSpacedDiv>
            )}
            onChanged={setBeløp}
            value={ytelse?.beloep ?? ''}
          />
        </Column>
        <Column>
          <CountrySelect
            key={ytelse?.valuta ? _currencyData.findByValue(ytelse?.valuta) : ''}
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
            values={ytelse?.valuta ? _currencyData.findByValue(ytelse?.valuta) : ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size={3} />
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
        <Column />
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
        <Column flex='2'>
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
        <Column/>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default FamilieYtelser
