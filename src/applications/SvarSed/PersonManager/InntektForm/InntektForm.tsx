import Search from 'assets/icons/Search'
import Select from 'components/Forms/Select'
import Inntekt from 'components/Inntekt/Inntekt'
import Period from 'components/Period/Period'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Options } from 'declarations/app'
import { Periode, ReplySed } from 'declarations/sed'
import { IInntekter, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'

interface InntektFormProps {
  inntekter: IInntekter | undefined
  getInntekter: () => void
  highContrast: boolean
  gettingInntekter: boolean
  parentNamespace: string
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const InntektForm: React.FC<InntektFormProps> = ({
  inntekter,
  getInntekter,
  gettingInntekter,
  highContrast,
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:InntektFormProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'xxx-inntekt'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-inntekt`

  const [_filter, _setFilter] = useState<string | undefined>(undefined)

  const filterOptions : Options = [
    { label: t('el:option-inntektsfilter-01'), value: 'inntektsfilter-01' }
  ]

  const setStartDato = (startdato: string) => {
    updateReplySed(`${target}.startdato`, startdato.trim())
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (sluttdato: string) => {
    const newAnmodningsperiode: Periode = _.cloneDeep(xxx)
    if (sluttdato === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = sluttdato.trim()
    }
    updateReplySed(target, newAnmodningsperiode)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }
  const setFilter = (filter: string) => {
    _setFilter(filter)
  }

  const onInntektClick = () => getInntekter()

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('el:title-inntekt-fra-komponent')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Period
          key={'' + xxx?.startdato + xxx?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={xxx?.startdato ?? ''}
          valueSluttDato={xxx?.sluttdato ?? ''}
        />
        <Column>
          <Select
            data-test-id={namespace + '-filter'}
            feil={validation[namespace + '-filter']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-filter'}
            label={t('label:inntektsfilter')}
            menuPortalTarget={document.body}
            onChange={(o: OptionTypeBase) => setFilter(o.value)}
            options={filterOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(filterOptions, b => b.value === _filter)}
            defaultValue={_.find(filterOptions, b => b.value === _filter)}
          />
        </Column>
        <Column>
          <VerticalSeparatorDiv data-size='1.8' />
          <HighContrastFlatknapp
            disabled={gettingInntekter}
            spinner={gettingInntekter}
            onClick={onInntektClick}
          >
            <Search />
            <HorizontalSeparatorDiv />
            {gettingInntekter ? t('message:loading-searching') : t('el:button-search')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2' />
      {gettingInntekter && <WaitingPanel />}
      {inntekter && (
        <Inntekt
          highContrast={highContrast}
          inntekter={inntekter}
          personID={personID}
        />
      )}

    </PaddedDiv>
  )
}

export default InntektForm
