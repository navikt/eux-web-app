import * as svarpasedActions from 'actions/svarpased'
import classNames from 'classnames'
import {
  AlignedSelect
} from 'components/StyledComponents'
import {
  AlignedInput
  ,
  AlignCenterColumn,
  AlignedRow,
  Column,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'

import { IncomeSearch } from 'declarations/components'
import { Inntekter, Validation } from 'declarations/types'
import _ from 'lodash'
import { Knapp } from 'nav-frontend-knapper'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Item } from 'tabell'
import InntektsTabell from './InntektsTabell'

const SokKnapp = styled(Knapp)`
  &.feil {
    margin-bottom: 1rem;
  }
  margin-bottom: 3rem;
`

interface InntektProps {
  fnr: string
  highContrast: boolean
  inntekter: Inntekter | undefined
  onSelectedInntekt: (items: Array<Item>) => void
}

const emptyIncomeSearch: IncomeSearch = {
  fraDato: '',
  tilDato: '',
  tema: ''
}

const Inntekt: React.FC<InntektProps> = ({
  fnr,
  highContrast,
  inntekter,
  onSelectedInntekt
}: InntektProps) => {
  const { t } = useTranslation()
  const [inntektSøk, setInntektSøk] = useState<IncomeSearch>(emptyIncomeSearch)
  const [validation, setValidation] = useState<{ [k: string]: any }>({})
  const dispatch = useDispatch()

  const updateIncomeSearch = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const value = event.currentTarget.value
    setInntektSøk({
      ...inntektSøk,
      [felt]: value || ''
    })
  }

  const resetValidation = (key: Array<string> | string): void => {
    const newValidation = _.cloneDeep(validation)
    if (_.isString(key)) {
      newValidation[key] = null
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = null
      })
    }
    setValidation(newValidation)
  }

  const updateTema = (felt: string, value: string): void => {
    console.log('update value', value)
    setInntektSøk({
      ...inntektSøk,
      [felt]: value
    })
  }

  const updateDate = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.currentTarget.value.match(/\d{4}-\d{2}/)) {
      setInntektSøk({
        ...inntektSøk,
        [felt]: event.currentTarget.value
      })
    }
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== undefined) === undefined
  }

  const performValidation = (): boolean => {
    const fraDato: string | undefined = !inntektSøk.fraDato
      ? 'validation-noFraDato'
      : !inntektSøk.fraDato.match(/\d{4}-\d{2}/)
          ? 'validation-fraDatoFormat'
          : parseInt(inntektSøk.fraDato.split('-')[0]) < 2015
            ? 'validation-fraDato2015'
            : parseInt(inntektSøk.fraDato.split('-')[1]) > 12
              ? 'validation-fraDatoMonth'
              : undefined

    const tilDato: string | undefined = !inntektSøk.tilDato
      ? 'validation-noTilDato'
      : !inntektSøk.tilDato.match(/\d{4}-\d{2}/)
          ? 'validation-tilDatoFormat'
          : parseInt(inntektSøk.tilDato.split('-')[0]) < 2015
            ? 'validation-tilDato2015'
            : parseInt(inntektSøk.tilDato.split('-')[1]) > 12
              ? 'validation-tilDatoMonth'
              : undefined

    const validation: Validation = {
      fraDato: fraDato
        ? {
          feilmelding: t(fraDato),
          skjemaelementId: 'inntekt-fradato'
        } as FeiloppsummeringFeil
        : undefined,
      tilDato: tilDato
        ? {
          feilmelding: t(tilDato),
          skjemaelementId: 'inntekt-tildato'
        } as FeiloppsummeringFeil
        : undefined,
      tema: !inntektSøk.tema
        ? {
          feilmelding: t('validation-noTema'),
          skjemaelementId: 'inntekt-tema'
        } as FeiloppsummeringFeil
        : undefined
    }
    setValidation(validation)
    return isValid(validation)
  }

  const fetchInntekt = () => {
    if (performValidation()) {
      dispatch(
        svarpasedActions.fetchInntekt({
          fnr: fnr,
          fraDato: inntektSøk.fraDato,
          tilDato: inntektSøk.tilDato,
          tema: inntektSøk.tema
        })
      )
    }
  }

  return (
    <>
      <AlignedRow className={classNames({ feil: !isValid(validation) })}>
        <Column className='slideInFromLeft'>
          <AlignedInput
            id='inntekt-fradato'
            data-test-id='inntekt-fradato'
            label={t('label:fraDato')}
            feil={validation.fraDato ? validation.fraDato.feilmelding : undefined}
            value={inntektSøk.fraDato}
            placeholder='ÅÅÅÅ-MM'
            className={classNames({ feil: validation.fraDato })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateIncomeSearch('fraDato', e)
              resetValidation('fraDato')
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              updateDate('fraDato', e)}
          />
          <VerticalSeparatorDiv />
        </Column>
        <HorizontalSeparatorDiv />
        <Column className='slideInFromLeft' style={{ animationDelay: '0.25s' }}>
          <AlignedInput
            id='inntekt-tildato'
            data-test-id='inntekt-tildato'
            label={t('label:tilDato')}
            feil={validation.tilDato ? validation.tilDato.feilmelding : undefined}
            value={inntektSøk.tilDato}
            placeholder='ÅÅÅÅ-MM'
            className={classNames({ feil: validation.tilDato })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateIncomeSearch('tilDato', e)
              resetValidation('tilDato')
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              updateDate('tilDato', e)}
          />
          <VerticalSeparatorDiv />
        </Column>
        <HorizontalSeparatorDiv />
        <Column className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
          <AlignedSelect
            id='inntekt-tema'
            highContrast={highContrast}
            data-test-id='inntekt-tema'
            label={t('label:tema')}
            feil={validation.tema ? validation.tema.feilmelding : undefined}
            value={inntektSøk.tema}
            className={classNames({ feil: validation.tema })}
            onChange={(e: any) => {
              updateTema('tema', e.target.value)
              resetValidation('tema')
            }}
          >
            <option value=''>
              {t('label:choose')}
            </option>
            <option value='BARNETRYGD' key='BARNETRYGD'>
              Barnetrygd
            </option>
            <option value='KONTANTSTØTTE' key='KONTANTSTØTTE'>
              Kontantstøtte
            </option>
          </AlignedSelect>
          <VerticalSeparatorDiv />
        </Column>
        <HorizontalSeparatorDiv />
        <AlignCenterColumn
          className='slideInFromLeft'
          style={{ animationDelay: '0.6s' }}
        >
          <SokKnapp
            className={classNames({ feil: !isValid(validation) })}
            onClick={fetchInntekt}
          >
            Søk
          </SokKnapp>
          <VerticalSeparatorDiv />
        </AlignCenterColumn>
      </AlignedRow>
      {!_.isNil(inntekter) && (
        <div>
          <InntektsTabell
            inntekter={inntekter}
            onSelectedInntekt={onSelectedInntekt}
          />
        </div>
      )}
    </>
  )
}

export default Inntekt
