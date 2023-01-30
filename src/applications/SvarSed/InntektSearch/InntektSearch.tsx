import { Search } from '@navikt/ds-icons'
import { Button, Loader } from '@navikt/ds-react'
import { AlignEndColumn, AlignStartRow, Column, HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { Periode } from 'declarations/sed'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateInntektSearch, ValidationInntektSearchProps } from './validation'

interface InntektSearchProps {
  amplitude ?: string
  fnr: string
  onInntektSearch: (fnr: string, fom: string, tom: string, inntektsliste: string) => void
  gettingInntekter: boolean
  defaultDates?: { [key: string]: string | null;}
}

const InntektSearch = ({
  amplitude,
  fnr,
  onInntektSearch,
  gettingInntekter,
  defaultDates
}: InntektSearchProps) => {
  const { t } = useTranslation()
  const namespace = 'inntekt-search'
  const [_searchPeriode, _setSearchPeriode] = useState<Periode>(() => ({
    startdato: defaultDates?.startDato ? defaultDates?.startDato : '2015-01',
    sluttdato: defaultDates?.sluttDato ? defaultDates?.sluttDato : moment(new Date()).format('YYYY-MM')
  }))
  const [_filter, _setFilter] = useState<string>('DAGPENGER')
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationInntektSearchProps>(validateInntektSearch, namespace)

  const filterOptions : Options = [
    { label: t('el:option-inntektsfilter-BARNETRYGD'), value: 'BARNETRYGD' },
    { label: t('el:option-inntektsfilter-KONTANTSTOETTE'), value: 'KONTANTSTOETTE' },
    { label: t('el:option-inntektsfilter-DAGPENGER'), value: 'DAGPENGER' }
  ]

  const setSearchPeriodeStartdato = (newStartdato: string) => {
    _setSearchPeriode({
      ..._searchPeriode,
      startdato: newStartdato.trim()
    })
    _resetValidation(namespace + '-startdato')
  }

  const setSearchPeriodeSluttdato = (newSluttdato: string) => {
    _setSearchPeriode({
      ..._searchPeriode,
      sluttdato: newSluttdato.trim()
    })
    _resetValidation(namespace + '-startdato')
  }

  const setFilter = (filter: string) => {
    _setFilter(filter)
  }

  const onInntektSearchClicked = () => {
    const valid = performValidation({
      fom: _searchPeriode?.startdato,
      tom: _searchPeriode?.sluttdato ?? '',
      inntektsliste: _filter
    })
    if (valid) {
      onInntektSearch(fnr, _searchPeriode?.startdato ?? '2015-01', _searchPeriode?.sluttdato ?? '', _filter ?? '')
      if (amplitude) {
        standardLogger(amplitude)
      }
    }
  }

  return (
    <AlignStartRow>
      <Column>
        <Input
          namespace={namespace}
          error={_validation[namespace + '-startdato']?.feilmelding}
          id='startdato'
          label={t('label:fra') + ' (ÅÅÅÅ-MM)'}
          onChanged={setSearchPeriodeStartdato}
          value={_searchPeriode.startdato}
        />
      </Column>
      <Column>
        <Input
          namespace={namespace}
          error={_validation[namespace + '-sluttdato']?.feilmelding}
          id='sluttdato'
          label={t('label:til') + ' (ÅÅÅÅ-MM)'}
          onChanged={setSearchPeriodeSluttdato}
          value={_searchPeriode.sluttdato}
        />
      </Column>
      <Column>
        <Select
          data-testid={namespace + '-inntektsliste'}
          error={_validation[namespace + '-inntektsliste']?.feilmelding}
          id={namespace + '-inntektsliste'}
          label={t('label:inntektsfilter')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setFilter((o as Option).value)}
          options={filterOptions}
          value={_.find(filterOptions, b => b.value === _filter)}
          defaultValue={_.find(filterOptions, b => b.value === _filter)}
        />
      </Column>
      <AlignEndColumn>
        <VerticalSeparatorDiv size='2' />
        <Button
          variant='secondary'
          disabled={gettingInntekter}
          onClick={onInntektSearchClicked}
        >
          <Search />
          <HorizontalSeparatorDiv />
          {gettingInntekter
            ? t('message:loading-searching')
            : t('el:button-search-i-x', { x: t('label:a-inntekt') })}
          {gettingInntekter && <Loader />}
        </Button>
      </AlignEndColumn>
    </AlignStartRow>
  )
}

export default InntektSearch
