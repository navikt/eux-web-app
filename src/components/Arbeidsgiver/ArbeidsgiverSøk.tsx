import { GetArbeidsperiodeOptions, fetchArbeidsperioder } from 'actions/arbeidsgiver'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Button, BodyLong, Loader } from '@navikt/ds-react'
import { AlignEndRow, AlignStartRow, Column, HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { validateArbeidsgiverSøk, ValidationArbeidsgiverSøkProps } from './validation'
import { Search } from '@navikt/ds-icons'

interface ArbeidsgiverSøkProps {
  amplitude ?: string
  fnr: string | undefined
  namespace: string
  fillOutFnr ?: () => void
}

interface ArbeidsgiverSøkSelector {
  gettingArbeidsperioder: boolean
}

const mapState = (state: State): ArbeidsgiverSøkSelector => ({
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder
})

const ArbeidsgiverSøk: React.FC<ArbeidsgiverSøkProps> = ({
  amplitude,
  fnr,
  namespace,
  fillOutFnr
}: ArbeidsgiverSøkProps): JSX.Element => {
  const { t } = useTranslation()
  const { gettingArbeidsperioder }: ArbeidsgiverSøkSelector = useSelector<State, ArbeidsgiverSøkSelector>(mapState)
  const dispatch = useDispatch()

  const [_arbeidssøkStartDato, _setArbeidssøkStartDato] = useState<string>('2015-01')
  const [_arbeidssøkSluttDato, _setArbeidssøkSluttDato] = useState<string>(moment().format('YYYY-MM'))
  const [_arbeidssøkInntektslistetype, _setArbeidssøkInntektslistetype] = useState<string>('DAGPENGER')

  const [_validation, _resetValidation, performValidation] = useValidation<ValidationArbeidsgiverSøkProps>({}, validateArbeidsgiverSøk)

  const inntektslistetypeOptions : Options = [
    { label: t('el:option-inntektsfilter-BARNETRYGD'), value: 'BARNETRYGD' },
    { label: t('el:option-inntektsfilter-KONTANTSTOETTE'), value: 'KONTANTSTOETTE' },
    { label: t('el:option-inntektsfilter-DAGPENGER'), value: 'DAGPENGER' }
  ]

  const setArbeidssøkStartDato = (value: string) => {
    _resetValidation('arbeidssok-startdato')
    _setArbeidssøkStartDato(value)
  }

  const setArbeidssøkSluttDato = (value: string) => {
    _resetValidation('arbeidssok-sluttdato')
    _setArbeidssøkSluttDato(value)
  }

  const setArbeidssøkInntektslistetype = (value: string) => {
    _resetValidation('arbeidssok-inntektslistetype')
    _setArbeidssøkInntektslistetype(value)
  }

  const getArbeidsperioder = () => {
    const valid = performValidation({
      fom: _arbeidssøkStartDato,
      tom: _arbeidssøkSluttDato,
      inntektslistetype: _arbeidssøkInntektslistetype,
      namespace: namespace + '-arbeidssok'
    })
    if (valid) {
      const options:GetArbeidsperiodeOptions = {
        fnr: fnr!.trim(),
        fom: _arbeidssøkStartDato.trim(),
        tom: _arbeidssøkSluttDato.trim(),
        inntektslistetype: _arbeidssøkInntektslistetype.trim()
      }
      dispatch(fetchArbeidsperioder(options))
      if (amplitude) {
        standardLogger(amplitude)
      }
    }
  }

  return (
    <>
      <AlignStartRow>
        <Column>
          <Input
            namespace={namespace + '-arbeidssok'}
            error={_validation[namespace + '-arbeidssok-startdato']?.feilmelding}
            id='startdato'
            label={t('label:fra') + '(ÅÅÅÅ-MM)'}
            onChanged={setArbeidssøkStartDato}
            value={_arbeidssøkStartDato}
          />
        </Column>
        <Column>
          <Input
            namespace={namespace + '-arbeidssok'}
            error={_validation[namespace + '-arbeidssok-sluttdato']?.feilmelding}
            id='sluttdato'
            label={t('label:til') + '(ÅÅÅÅ-MM)'}
            onChanged={setArbeidssøkSluttDato}
            value={_arbeidssøkSluttDato}
          />
        </Column>
        <Column>
          <Select
            data-test-id={namespace + '-arbeidssok-inntektsliste'}
            error={_validation[namespace + '-arbeidssok-inntektsliste']?.feilmelding}
            id={namespace + '-arbeidssok-inntektsliste'}
            label={t('label:filter')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setArbeidssøkInntektslistetype((o as Option).value)}
            options={inntektslistetypeOptions}
            value={_.find(inntektslistetypeOptions, b => b.value === _arbeidssøkInntektslistetype)}
            defaultValue={_.find(inntektslistetypeOptions, b => b.value === _arbeidssøkInntektslistetype)}
          />
        </Column>
        <Column>
          <Button
            variant='secondary'
            className='nolabel'
            disabled={gettingArbeidsperioder || _.isNil(fnr)}
            onClick={getArbeidsperioder}
          >
            <Search />
            <HorizontalSeparatorDiv size='0.5' />
            {gettingArbeidsperioder
              ? t('message:loading-searching')
              : t('el:button-search-for-x', { x: t('label:arbeidsperioder') })}
            {gettingArbeidsperioder && <Loader />}
          </Button>
        </Column>
      </AlignStartRow>
      {_.isNil(fnr) && _.isFunction(fillOutFnr) && (
        <>
          <VerticalSeparatorDiv size='0.5' />
          <AlignEndRow>
            <Column>
              <HorizontalSeparatorDiv size='0.35' />
              <BodyLong>
                {t('message:error-no-fnr')}
              </BodyLong>
              <HorizontalSeparatorDiv size='0.35' />
              <Link
                to='#' onClick={() => {
                  if (_.isFunction(fillOutFnr())) {
                    fillOutFnr()
                  }
                }}
              >
                {t('label:fill-fnr')}
              </Link>
            </Column>
          </AlignEndRow>
        </>
      )}
    </>
  )
}

export default ArbeidsgiverSøk
