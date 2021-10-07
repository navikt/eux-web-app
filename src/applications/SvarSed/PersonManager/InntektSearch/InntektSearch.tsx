import { Periode } from 'declarations/sed'
import { standardLogger } from 'metrics/loggers'
import {
  validateInntektSearch,
  ValidationInntektSearchProps
} from './validation'
import Search from 'assets/icons/Search'
import Select from 'components/Forms/Select'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { Options } from 'declarations/app'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Option } from 'declarations/app.d'

interface InntektSearchProps {
  amplitude ?: string
  fnr: string
  highContrast: boolean
  onInntektSearch: (fnr: string, fom: string, tom: string, inntektsliste: string) => void
  gettingInntekter: boolean
}

const InntektSearch = ({
  amplitude,
  fnr,
  highContrast,
  onInntektSearch,
  gettingInntekter
}: InntektSearchProps) => {
  const { t } = useTranslation()

  const [_searchPeriode, _setSearchPeriode] = useState<Periode>({ startdato: '' })
  const [_filter, _setFilter] = useState<string | undefined>(undefined)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationInntektSearchProps>({}, validateInntektSearch)
  const namespace = 'inntekt-search'

  const filterOptions : Options = [
    { label: t('el:option-inntektsfilter-BARNETRYGD'), value: 'BARNETRYGD' },
    { label: t('el:option-inntektsfilter-KONTANTSTOETTE'), value: 'KONTANTSTOETTE' },
    { label: t('el:option-inntektsfilter-DAGPENGER'), value: 'DAGPENGER' }
  ]

  const setSearchPeriode = (p: Periode) => {
    _setSearchPeriode(p)
    _resetValidation(namespace + '-startdato')
    _resetValidation(namespace + '-sluttdato')
  }

  const setFilter = (filter: string) => {
    _setFilter(filter)
  }

  const onInntektSearchClicked = () => {
    const valid = performValidation({
      fom: _searchPeriode?.startdato,
      tom: _searchPeriode?.sluttdato ?? '',
      inntektsliste: _filter,
      namespace: namespace
    })
    if (valid) {
      onInntektSearch(fnr, _searchPeriode?.startdato ?? '2015-01', _searchPeriode?.sluttdato ?? '', _filter ?? '')
      if (amplitude) {
        standardLogger(amplitude)
      }
    }
  }

  return (
    <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
      <PeriodeInput
        key={'' + _searchPeriode?.startdato + _searchPeriode?.sluttdato}
        namespace={namespace}
        error={{
          startdato: _validation[namespace + '-startdato']?.feilmelding,
          sluttdato: _validation[namespace + '-sluttdato']?.feilmelding
        }}
        setPeriode={setSearchPeriode}
        value={_searchPeriode}
        periodeType='simple'
      />
      <Column>
        <Select
          data-test-id={namespace + '-inntektsliste'}
          feil={_validation[namespace + '-inntektsliste']?.feilmelding}
          highContrast={highContrast}
          id={namespace + '-inntektsliste'}
          label={t('label:inntektsfilter')}
          menuPortalTarget={document.body}
          onChange={(o: Option) => setFilter(o.value)}
          options={filterOptions}
          placeholder={t('el:placeholder-select-default')}
          value={_.find(filterOptions, b => b.value === _filter)}
          defaultValue={_.find(filterOptions, b => b.value === _filter)}
        />
      </Column>
      <Column>
        <VerticalSeparatorDiv size='1.8' />
        <HighContrastFlatknapp
          disabled={gettingInntekter}
          spinner={gettingInntekter}
          onClick={onInntektSearchClicked}
        >
          <Search />
          <HorizontalSeparatorDiv />
          {gettingInntekter ? t('message:loading-searching') : t('el:button-search')}
        </HighContrastFlatknapp>
      </Column>
    </AlignStartRow>
  )
}

export default InntektSearch
