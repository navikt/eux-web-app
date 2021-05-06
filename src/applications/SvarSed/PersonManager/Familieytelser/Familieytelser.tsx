import HelpIcon from 'assets/icons/HelpIcon'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { Options } from 'declarations/app'
import { Motregning, ReplySed, Utbetalingshyppighet, YtelseNavn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import CountryData, { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, AlignStartRow, FlexCenterSpacedDiv, PaddedDiv, HighContrastRadioPanelGroup, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import Tooltip from 'rc-tooltip'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface FamilieYtelserProps {
  highContrast: boolean
  parentNamespace: string
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
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: FamilieYtelserProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.motregning[0]`
  const motregning: Motregning = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-familieytelser`

  const _currencyData = CountryData.getCurrencyInstance('nb')

  const [_newNumber, setNewNumber] = useState<string>('')

  const ytelseNavnOptions: Options = [{
    label: t('el:option-familieytelser-barnetrygd'), value: 'Barnetrygd'
  }, {
    label: t('el:option-familieytelser-kontantstøtte'), value: 'Kontantstøtte'
  }]

  const setNumber = (e: string) => {
    setNewNumber(e)
  }

  const setYtelseNavn = (ytelseNavn: YtelseNavn) => {
    updateReplySed(`${target}.ytelseNavn`, ytelseNavn)
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
        {t('label:beløp-for-hele-familien')}
      </Undertittel>
      <VerticalSeparatorDiv />
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
            selectedValue={_.find(ytelseNavnOptions, b => b.value === motregning?.ytelseNavn as YtelseNavn)}
            defaultValue={_.find(ytelseNavnOptions, b => b.value === motregning?.ytelseNavn as YtelseNavn)}
          />
        </Column>
        <Column>
          <Input
            type='number'
            feil={validation[namespace + '-number']?.feilmelding}
            namespace={namespace}
            id='number'
            label={t('label:antall-innvilges') + ' *'}
            onChanged={setNumber}
            value={_newNumber}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Input
            type='number'
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
            value={motregning?.beloep ?? ''}
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
            values={motregning?.valuta ? _currencyData.findByValue(motregning?.valuta) : ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <Undertittel className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        {t('label:grant-date')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Period
          key={'' + motregning?.startdato + motregning?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={motregning?.startdato ?? ''}
          valueSluttDato={motregning?.sluttdato ?? ''}
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
            value={motregning?.mottakersNavn ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={motregning?.utbetalingshyppighet}
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

export default FamilieYtelser
