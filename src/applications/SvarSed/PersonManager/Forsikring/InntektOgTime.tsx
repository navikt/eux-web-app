import { Add } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { InntektOgTime, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import { validateInntektOgTime, ValidationInntektOgTimeProps } from './validationInntektOgTime'

const MyPaddedDiv = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 2rem;
`

export interface InntektOgTimeProps {
  highContrast: boolean
  inntektOgTime: Array<InntektOgTime> | undefined
  onInntektOgTimeChanged: (a: Array<InntektOgTime>) => void
  parentNamespace: string
  personName: string
  validation: Validation
}

const InntektOgTimeFC: React.FC<InntektOgTimeProps> = ({
  highContrast,
  inntektOgTime,
  onInntektOgTimeChanged,
  parentNamespace,
  personName,
  validation
}: InntektOgTimeProps): JSX.Element => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const namespace = `${parentNamespace}-inntektogtime`

  const [_newArbeidstimer, _setNewArbeidstimer] = useState<string | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_newBruttoinntekt, _setNewBruttoinntekt] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<InntektOgTime>((it: InntektOgTime): string => it.inntektsperiode.startdato + '-' + it.bruttoinntekt)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationInntektOgTimeProps>({}, validateInntektOgTime)

  const setArbeidstimer = (arbeidstimer: string, index: number) => {
    if (index < 0) {
      _setNewArbeidstimer(arbeidstimer.trim())
      _resetValidation(namespace + '-arbeidstimer')
    } else {
      const newInntektOgTime: Array<InntektOgTime> = _.cloneDeep(inntektOgTime) as Array<InntektOgTime>
      newInntektOgTime[index].arbeidstimer = arbeidstimer.trim()
      onInntektOgTimeChanged(newInntektOgTime)
      if (validation[namespace + getIdx(index) + '-arbeidstimer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-arbeidstimer'))
      }
    }
  }

  const setPeriode = (newPeriode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(newPeriode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-sluttdato')
      }
    } else {
      const newInntektOgTime: Array<InntektOgTime> = _.cloneDeep(inntektOgTime) as Array<InntektOgTime>
      newInntektOgTime[index].inntektsperiode = newPeriode
      onInntektOgTimeChanged(newInntektOgTime)
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }

    }
  }

  const setBruttoinntekt = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewBruttoinntekt(newBeløp.trim())
      resetValidation(namespace + '-beloep')
      if (_.isNil(_newValuta)) {
        setValuta({ value: 'NOK' } as Currency, index)
      }
    } else {
      const newInntektOgTime: Array<InntektOgTime> = _.cloneDeep(inntektOgTime) as Array<InntektOgTime>
      newInntektOgTime[index].bruttoinntekt = newBeløp
      if (_.isNil(newInntektOgTime[index].valuta)) {
        newInntektOgTime[index].valuta = 'NOK'
      }

      onInntektOgTimeChanged(newInntektOgTime)
      if (validation[namespace + '-beloep']) {
        dispatch(resetValidation(namespace + '-beloep'))
        dispatch(resetValidation(namespace + '-valuta'))
      }
    }
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewValuta(newValuta.value)
      resetValidation(namespace + '-valuta')
    } else {
      const newInntektOgTime: Array<InntektOgTime> = _.cloneDeep(inntektOgTime) as Array<InntektOgTime>
      newInntektOgTime[index].bruttoinntekt = newValuta?.value
      onInntektOgTimeChanged(newInntektOgTime)
      if (validation[namespace + '-valuta']) {
        dispatch(resetValidation(namespace + '-valuta'))
      }
    }
  }

  const resetForm = () => {
    _setNewBruttoinntekt(undefined)
    _setNewArbeidstimer(undefined)
    _setNewPeriode(undefined)
    _setNewValuta('NOK')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemoved = (index: number) => {
    const newInntektOgTime: Array<InntektOgTime> = _.cloneDeep(inntektOgTime) as Array<InntektOgTime>
    const deletedInntektOgTime: Array<InntektOgTime> = newInntektOgTime.splice(index, 1)
    if (deletedInntektOgTime && deletedInntektOgTime.length > 0) {
      removeFromDeletion(deletedInntektOgTime[0])
    }
    onInntektOgTimeChanged(newInntektOgTime)
  }

  const onAdd = () => {
    const newInntektOgTime: InntektOgTime = {
      bruttoinntekt: _newBruttoinntekt?.trim(),
      inntektsperiode: _newPeriode,
      arbeidstimer: _newArbeidstimer?.trim(),
      valuta: _newValuta
    } as InntektOgTime

    const valid: boolean = _performValidation({
      inntektOgTime: newInntektOgTime,
      namespace: namespace,
      personName: personName
    })

    if (valid) {
      let newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTime) as Array<InntektOgTime>
      if (_.isNil(newInntektOgTime)) {
        newInntektOgTimer = []
      }
      newInntektOgTimer.push(newInntektOgTime)
      onInntektOgTimeChanged(newInntektOgTimer)
      resetForm()
    }
  }

  const renderRow = (inntektOgTime: InntektOgTime | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(inntektOgTime)
    const idx = getIdx(index)
    const getErrorFor = (el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }

    const _periode = index < 0 ? _newPeriode : inntektOgTime?.inntektsperiode
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace + idx}
            showLabel={false}
            error={{
              startdato: getErrorFor('startdato'),
              sluttdato: getErrorFor('sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
          />
          <Column>
            <Input
              feil={getErrorFor('arbeidstimer')}
              namespace={namespace}
              key={namespace + idx + '-arbeidstimer-' + (index < 0 ? _newArbeidstimer : inntektOgTime?.arbeidstimer ?? '')}
              id='arbeidstimer'
              label={t('label:arbeidstimer') + ' *'}
              onChanged={(arbeidstimer: string) => setArbeidstimer(arbeidstimer, index)}
              value={(index < 0 ? _newArbeidstimer : inntektOgTime?.arbeidstimer ?? '')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              feil={getErrorFor('bruttoinntekt')}
              namespace={namespace}
              key={namespace + idx + '-bruttoinntekt-' + (index < 0 ? _newBruttoinntekt : inntektOgTime?.bruttoinntekt ?? '')}
              id='bruttoinntekt'
              label={t('label:brutto-inntekt') + ' *'}
              onChanged={(bruttoinntekt: string) => setBruttoinntekt(bruttoinntekt, index)}
              value={(index < 0 ? _newBruttoinntekt : inntektOgTime?.bruttoinntekt ?? '')}
            />
          </Column>
          <Column>
            <CountrySelect
              key={namespace + '-valuta-' + (index < 0 ? _newValuta : inntektOgTime?.valuta ?? '')}
              closeMenuOnSelect
              ariaLabel={t('label:valuta')}
              data-test-id={namespace + '-valuta'}
              error={getErrorFor('valuta')}
              highContrast={highContrast}
              id={namespace + '-valuta'}
              label={t('label:valuta') + ' *'}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(valuta: Currency) => setValuta(valuta, index)}
              type='currency'
              values={index < 0 ? _newValuta : inntektOgTime?.valuta ?? ''}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(inntektOgTime)}
              onConfirmRemove={() => onRemoved(index)}
              onCancelRemove={() => removeFromDeletion(inntektOgTime)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <MyPaddedDiv>
      <Undertittel>
        {t('label:inntekt-og-time')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {inntektOgTime?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:inntekt').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
        )}
    </MyPaddedDiv>
  )
}

export default InntektOgTimeFC

