import { GetArbeidsperiodeOptions, fetchArbeidsperioder } from 'actions/arbeidsperioder'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import {Button, BodyLong, HStack, VStack} from '@navikt/ds-react'
import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from 'store'
import { validateArbeidsperioderSøk, ValidationArbeidsperioderSøkProps } from './validation'

interface ArbeidsperioderSøkProps {
  fnr: string | undefined
  namespace: string
  fillOutFnr ?: () => void
  defaultDates?: { [key: string]: string | null;}
  type: string
}

interface ArbeidsperioderSøkSelector {
  gettingArbeidsperioder: boolean
}

const mapState = (state: State): ArbeidsperioderSøkSelector => ({
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder
})

const ArbeidsperioderSøk: React.FC<ArbeidsperioderSøkProps> = ({
  fnr,
  namespace,
  fillOutFnr,
  defaultDates,
  type
}: ArbeidsperioderSøkProps): JSX.Element => {
  const { t } = useTranslation()
  const { gettingArbeidsperioder }: ArbeidsperioderSøkSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()


  const [_arbeidssøkStartDato, _setArbeidssøkStartDato] = useState<string>(defaultDates?.startDato ? defaultDates?.startDato : '2015-01')
  const [_arbeidssøkSluttDato, _setArbeidssøkSluttDato] = useState<string>(defaultDates?.sluttDato ? defaultDates?.sluttDato : moment().format('YYYY-MM'))
  const [_arbeidssøkInntektslistetype, _setArbeidssøkInntektslistetype] = useState<string>(type === 'familie' ? 'BARNETRYGD' : 'DAGPENGER')

  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationArbeidsperioderSøkProps>(validateArbeidsperioderSøk, namespace + '-arbeidssok')

  const initArbeidsperiodertypeOptions = (type: String): Options => {
    if(type === 'familie') {
      return [
        { label: t('el:option-inntektsfilter-BARNETRYGD'), value: 'BARNETRYGD' },
        { label: t('el:option-inntektsfilter-KONTANTSTOETTE'), value: 'KONTANTSTOETTE' }
      ]
    } else {
      return [
        { label: t('el:option-inntektsfilter-DAGPENGER'), value: 'DAGPENGER' }
      ]
    }
  }

  const inntektslistetypeOptions : Options = initArbeidsperiodertypeOptions(type)

  const setArbeidssøkStartDato = (value: string) => {
    _resetValidation('arbeidssok-startdato')
    _setArbeidssøkStartDato(value.trim())
  }

  const setArbeidssøkSluttDato = (value: string) => {
    _resetValidation('arbeidssok-sluttdato')
    _setArbeidssøkSluttDato(value.trim())
  }

  const setArbeidssøkInntektslistetype = (value: string) => {
    _resetValidation('arbeidssok-inntektslistetype')
    _setArbeidssøkInntektslistetype(value.trim())
  }

  const getArbeidsperioder = () => {
    const valid = performValidation({
      fom: _arbeidssøkStartDato,
      tom: _arbeidssøkSluttDato,
      inntektslistetype: _arbeidssøkInntektslistetype
    })
    if (valid) {
      const options:GetArbeidsperiodeOptions = {
        fnr: fnr!.trim(),
        fom: _arbeidssøkStartDato.trim(),
        tom: _arbeidssøkSluttDato.trim(),
        inntektslistetype: _arbeidssøkInntektslistetype.trim()
      }
      dispatch(fetchArbeidsperioder(options))
    }
  }

  return (
    <VStack gap="4">
      <HStack gap="2" align="start">
        <Input
          namespace={namespace + '-arbeidssok'}
          error={_validation[namespace + '-arbeidssok-startdato']?.feilmelding}
          id='startdato'
          label={t('label:fra') + ' (ÅÅÅÅ-MM)'}
          onChanged={setArbeidssøkStartDato}
          value={_arbeidssøkStartDato}
        />
        <Input
          namespace={namespace + '-arbeidssok'}
          error={_validation[namespace + '-arbeidssok-sluttdato']?.feilmelding}
          id='sluttdato'
          label={t('label:til') + ' (ÅÅÅÅ-MM)'}
          onChanged={setArbeidssøkSluttDato}
          value={_arbeidssøkSluttDato}
        />
        <Select
          data-testid={namespace + '-arbeidssok-inntektsliste'}
          error={_validation[namespace + '-arbeidssok-inntektsliste']?.feilmelding}
          id={namespace + '-arbeidssok-inntektsliste'}
          label={t('label:filter')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setArbeidssøkInntektslistetype((o as Option).value)}
          options={inntektslistetypeOptions}
          value={_.find(inntektslistetypeOptions, b => b.value === _arbeidssøkInntektslistetype)}
          defaultValue={_.find(inntektslistetypeOptions, b => b.value === _arbeidssøkInntektslistetype)}
        />

        <Button
          loading={gettingArbeidsperioder}
          variant='secondary'
          className='nolabel'
          disabled={gettingArbeidsperioder || _.isNil(fnr)}
          onClick={getArbeidsperioder}
          icon={<MagnifyingGlassIcon/>}
        >
          {t('el:button-search')}
        </Button>
      </HStack>
      {_.isNil(fnr) && _.isFunction(fillOutFnr) && (
        <HStack gap="4">
          <BodyLong>
            {t('message:error-no-fnr')}
          </BodyLong>
          <Link
            to='#' onClick={() => {
            if (_.isFunction(fillOutFnr)) {
              fillOutFnr()
            }
          }}
          >
            {t('label:fill-fnr')}
          </Link>
        </HStack>
      )}
    </VStack>
  )
}

export default ArbeidsperioderSøk
