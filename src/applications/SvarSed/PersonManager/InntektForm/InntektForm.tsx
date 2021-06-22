import { fetchInntekt } from 'actions/inntekt'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Search from 'assets/icons/Search'
import Select from 'components/Forms/Select'
import Inntekt from 'components/Inntekt/Inntekt'
import Period from 'components/Period/Period'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import { IInntekter } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'
import { getFnr } from 'utils/fnr'

interface InntektFormSelector extends PersonManagerFormSelector {
  gettingInntekter: boolean
  highContrast: boolean
  inntekter: IInntekter | undefined
}

const mapState = (state: State): InntektFormSelector => ({
  gettingInntekter: state.loading.gettingInntekter,
  highContrast: state.ui.highContrast,
  inntekter: state.inntekt.inntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const InntektForm: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    gettingInntekter,
    highContrast,
    inntekter,
    replySed,
    validation
  } = useSelector<State, InntektFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'xxxinntekt'
  const inntekt: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-inntekt`

  const [_filter, _setFilter] = useState<string | undefined>(undefined)

  const filterOptions : Options = [
    { label: t('el:option-inntektsfilter-01'), value: 'inntektsfilter-01' }
  ]

  const setStartDato = (startdato: string) => {
    dispatch(updateReplySed(`${target}.startdato`, startdato.trim()))
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
  }

  const setSluttDato = (sluttdato: string) => {
    const newAnmodningsperiode: Periode = _.cloneDeep(inntekt)
    if (sluttdato === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = sluttdato.trim()
    }
    dispatch(updateReplySed(target, newAnmodningsperiode))
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }
  const setFilter = (filter: string) => {
    _setFilter(filter)
  }

  const fnr = getFnr(replySed)

  const onInntektClick = () => dispatch(fetchInntekt(fnr))

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:inntekt-fra-komponent')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Period
          key={'' + inntekt?.startdato + inntekt?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={inntekt?.startdato ?? ''}
          valueSluttDato={inntekt?.sluttdato ?? ''}
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
          <VerticalSeparatorDiv size='1.8' />
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
      <VerticalSeparatorDiv size='2' />
      {gettingInntekter && <WaitingPanel />}
      {inntekter && (
        <Inntekt inntekter={inntekter} />
      )}

    </PaddedDiv>
  )
}

export default InntektForm
