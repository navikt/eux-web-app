import {
  validateInntektSearch,
  ValidationInntektSearchProps
} from './validation'
import Search from 'assets/icons/Search'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
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
import { OptionTypeBase } from 'react-select'

interface InntektSearchProps {
  fnr: string
  highContrast: boolean
  onInntektSearch: (fnr: string, fom: string, tom: string, inntektsliste: string) => void
  gettingInntekter: boolean
}

const InntektSearch = ({
  fnr,
  highContrast,
  onInntektSearch,
  gettingInntekter
}: InntektSearchProps) => {
  const { t } = useTranslation()

  const [_searchStartDato, _setSearchStartDato] = useState<string>('')
  const [_searchSluttDato, _setSearchSluttDato] = useState<string>('')
  const [_filter, _setFilter] = useState<string | undefined>(undefined)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationInntektSearchProps>({}, validateInntektSearch)
  const namespace = 'inntekt-search'

  const filterOptions : Options = [
    { label: t('el:option-inntektsfilter-BARNETRYGD'), value: 'BARNETRYGD' },
    { label: t('el:option-inntektsfilter-KONTANTSTOETTE'), value: 'KONTANTSTOETTE' },
    { label: t('el:option-inntektsfilter-DAGPENGER'), value: 'DAGPENGER' }
  ]

  const setSearchStartDato = (startdato: string) => {
    _setSearchStartDato(startdato.trim())
    _resetValidation(namespace + '-startdato')
  }

  const setSearchSluttDato = (sluttdato: string) => {
    _setSearchSluttDato(sluttdato.trim())
    _resetValidation(namespace + '-sluttdato')
  }

  const setFilter = (filter: string) => {
    _setFilter(filter)
  }

  const onInntektSearchClicked = () => {
    const valid = performValidation({
      fom: _searchStartDato,
      tom: _searchSluttDato,
      inntektsliste: _filter,
      namespace: namespace
    })
    if (valid) {
      onInntektSearch(fnr, _searchStartDato ?? '2015-01', _searchSluttDato, _filter ?? '')
    }
  }

  return (
    <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
      <Period
        key={'' + _searchStartDato + _searchSluttDato}
        namespace={namespace}
        errorStartDato={_validation[namespace + '-startdato']?.feilmelding}
        errorSluttDato={_validation[namespace + '-sluttdato']?.feilmelding}
        setStartDato={setSearchStartDato}
        setSluttDato={setSearchSluttDato}
        valueStartDato={_searchStartDato ?? ''}
        valueSluttDato={_searchSluttDato ?? ''}
      />
      <Column>
        <Select
          data-test-id={namespace + '-inntektsliste'}
          feil={_validation[namespace + '-inntektsliste']?.feilmelding}
          highContrast={highContrast}
          id={namespace + '-inntektsliste'}
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
