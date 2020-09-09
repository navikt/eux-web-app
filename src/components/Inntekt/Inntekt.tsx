import * as svarpasedActions from 'actions/svarpased'
import classNames from 'classnames'
import { Inntekter, Validation } from 'declarations/types'
import { Knapp } from 'nav-frontend-knapper'
import { Input, Select } from 'nav-frontend-skjema'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  Cell,
  Row,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import styled from 'styled-components'
import _ from 'lodash'
import InntektsTabell from 'components/Inntekt/InntektsTabell'
import { Item } from 'tabell'

interface InntektProps {
  fnr: string;
  inntekter: Inntekter | undefined;
  onSelectedInntekt: (items: Array<Item>) => void;
}

const AlignCenterCell = styled(Cell)`
  display: flex;
  align-items: center;
`

const SokKnapp = styled(Knapp)`
  &.feil {
    margin-bottom: 1rem;
  }
  margin-bottom: 3rem;
`
const AlignedRow = styled(Row)`
  align-items: flex-end;
  &.feil {
    align-items: center !important;
  }
`
const AlignedInput = styled(Input)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
const AlignedSelect = styled(Select)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
interface IncomeSearch {
  fraDato: string;
  tilDato: string;
  tema: string;
}

const emptyIncomeSearch = {
  fraDato: '',
  tilDato: '',
  tema: ''
}

const Inntekt: React.FC<InntektProps> = ({
  fnr,
  inntekter,
  onSelectedInntekt
}: InntektProps) => {
  const { t } = useTranslation()
  const [inntektSøk, setInntektSøk] = useState<IncomeSearch>(emptyIncomeSearch)
  const [validation, setValidation] = useState<{ [k: string]: any }>({})

  const dispatch = useDispatch()

  const fetchInntekt = () => {
    dispatch(
      svarpasedActions.fetchInntekt({
        fnr: fnr,
        fraDato: inntektSøk.fraDato,
        tilDato: inntektSøk.tilDato,
        tema: inntektSøk.tema
      })
    )
  }

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

  const validate = (): Validation => {
    const validation: Validation = {
      fraDato: inntektSøk.fraDato ? null : 'Velg en gyldig dato',
      tilDato: inntektSøk.tilDato ? null : 'Velg en gyldig dato',
      tema: inntektSøk.tema ? null : 'Du må velge et tema'
    }
    setValidation(validation)
    return validation
  }

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== null) === undefined
  }

  const addSearch = (): void => {
    console.log('addSearch inntektSøk', inntektSøk)
    if (isValid(validate())) {
      console.log('Every thing ready for sending' + validate())
      fetchInntekt()
    }
  }

  return (
    <>
      <AlignedRow className={classNames({ feil: !isValid(validation) })}>
        <Cell className='slideAnimate'>
          <AlignedInput
            label={t('ui:label-fraDato')}
            feil={validation.fraDato}
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
        </Cell>
        <HorizontalSeparatorDiv />
        <Cell className='slideAnimate' style={{ animationDelay: '0.4s' }}>
          <AlignedInput
            label={t('ui:label-tilDato')}
            feil={validation.tilDato}
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
        </Cell>
        <HorizontalSeparatorDiv />
        <Cell className='slideAnimate' style={{ animationDelay: '0.5s' }}>
          <AlignedSelect
            label={t('ui:label-tema')}
            feil={validation.tema}
            value={inntektSøk.tema}
            className={classNames({ feil: validation.tema })}
            onChange={(e: any) => {
              updateTema('tema', e.target.value)
              resetValidation('tema')
            }}
          >
            <option value=''>{t('ui:form-choose')}</option>
            <option value='BARNETRYGD' key='BARNETRYGD'>
              Barnetrygd
            </option>
            <option value='KONTANTSTØTTE' key='KONTANTSTØTTE'>
              Kontantstøtte
            </option>
          </AlignedSelect>
          <VerticalSeparatorDiv />
        </Cell>
        <HorizontalSeparatorDiv />
        <AlignCenterCell
          className='slideAnimate'
          style={{ animationDelay: '0.6s' }}
        >
          <SokKnapp
            className={classNames({ feil: !isValid(validation) })}
            onClick={() => addSearch()}
          >
            Søk
          </SokKnapp>
          <VerticalSeparatorDiv />
        </AlignCenterCell>
      </AlignedRow>
      {!_.isNil(inntekter) && (
        <div>
          <InntektsTabell
            inntekter={inntekter}
            onSelectedInntekt={onSelectedInntekt}
          />
        </div>
      )}

      {/* inntekter?.map((inntekt: IInntekt) => (
        <>{JSON.stringify(inntekt)}</>
      )) */}
    </>
  )
}

export default Inntekt
