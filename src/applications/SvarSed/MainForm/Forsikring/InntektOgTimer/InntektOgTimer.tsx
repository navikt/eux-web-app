import { AddCircle } from '@navikt/ds-icons'
import { Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
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
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import { validateInntektOgTime, ValidationInntektOgTimeProps } from './validation'

const MyPaddedDiv = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 2rem;
`

export interface InntektOgTimerProps {
  inntektOgTimer: Array<InntektOgTime> | undefined
  onInntektOgTimeChanged: (inntektOgTimer: Array<InntektOgTime>, whatChanged: string) => void
  parentNamespace: string
  personName?: string
  validation: Validation
}

const InntektOgTimerFC: React.FC<InntektOgTimerProps> = ({
  inntektOgTimer,
  onInntektOgTimeChanged,
  parentNamespace,
  personName,
  validation
}: InntektOgTimerProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-inntektOgTimer`

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
      const newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
      newInntektOgTimer[index].arbeidstimer = arbeidstimer.trim()
      onInntektOgTimeChanged(newInntektOgTimer, 'arbeidstimer')
      if (validation[namespace + getIdx(index) + '-arbeidstimer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-arbeidstimer'))
      }
    }
  }

  const setPeriode = (newPeriode: Periode, whatChanged: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(newPeriode)
      _resetValidation(namespace + '-inntektsperiode-' + whatChanged)
    } else {
      const newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
      newInntektOgTimer[index].inntektsperiode = newPeriode
      onInntektOgTimeChanged(newInntektOgTimer, whatChanged)
      if (validation[namespace + getIdx(index) + '-inntektsperiode-' + whatChanged]) {
        dispatch(resetValidation(namespace + getIdx(index) + '-inntektsperiode-' + whatChanged))
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
      const newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
      newInntektOgTimer[index].bruttoinntekt = newBeløp
      if (_.isNil(newInntektOgTimer[index].valuta)) {
        newInntektOgTimer[index].valuta = 'NOK'
      }

      onInntektOgTimeChanged(newInntektOgTimer, 'bruttoinntekt')
      if (validation[namespace + getIdx(index) + '-beloep']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-beloep'))
        dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
      }
    }
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewValuta(newValuta.value)
      resetValidation(namespace + '-valuta')
    } else {
      const newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
      newInntektOgTimer[index].bruttoinntekt = newValuta?.value
      onInntektOgTimeChanged(newInntektOgTimer, 'valuta')
      if (validation[namespace + getIdx(index) + '-valuta']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
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
    const newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
    const deletedInntektOgTime: Array<InntektOgTime> = newInntektOgTimer.splice(index, 1)
    if (deletedInntektOgTime && deletedInntektOgTime.length > 0) {
      removeFromDeletion(deletedInntektOgTime[0])
    }
    onInntektOgTimeChanged(newInntektOgTimer, 'removed')
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
      namespace,
      personName
    })

    if (valid) {
      let newInntektOgTimer: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
      if (_.isNil(newInntektOgTimer)) {
        newInntektOgTimer = []
      }
      newInntektOgTimer.push(newInntektOgTime)
      onInntektOgTimeChanged(newInntektOgTimer, 'add')
      onCancel()
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
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + idx + '-inntektsperiode'}
            error={{
              startdato: getErrorFor('inntektsperiode-startdato'),
              sluttdato: getErrorFor('inntektsperiode-sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
          />
          <Column>
            <Input
              error={getErrorFor('arbeidstimer')}
              namespace={namespace + idx}
              key={namespace + idx + '-arbeidstimer-' + (index < 0 ? _newArbeidstimer : inntektOgTime?.arbeidstimer ?? '')}
              id='arbeidstimer'
              label={t('label:arbeidstimer')}
              onChanged={(arbeidstimer: string) => setArbeidstimer(arbeidstimer, index)}
              required
              value={(index < 0 ? _newArbeidstimer : inntektOgTime?.arbeidstimer ?? '')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={getErrorFor('bruttoinntekt')}
              namespace={namespace + idx}
              key={namespace + idx + '-bruttoinntekt-' + (index < 0 ? _newBruttoinntekt : inntektOgTime?.bruttoinntekt ?? '')}
              id='bruttoinntekt'
              label={t('label:brutto-inntekt')}
              onChanged={(bruttoinntekt: string) => setBruttoinntekt(bruttoinntekt, index)}
              required
              value={(index < 0 ? _newBruttoinntekt : inntektOgTime?.bruttoinntekt ?? '')}
            />
          </Column>
          <Column>
            <CountrySelect
              key={namespace + idx + '-valuta-' + (index < 0 ? _newValuta : inntektOgTime?.valuta ?? '')}
              closeMenuOnSelect
              ariaLabel={t('label:valuta')}
              data-testid={namespace + idx + '-valuta'}
              error={getErrorFor('valuta')}
              id={namespace + idx + '-valuta'}
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
      <Heading size='small'>
        {t('label:inntekt-og-time')}
      </Heading>
      <VerticalSeparatorDiv />
      {inntektOgTimer?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:inntekt').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </MyPaddedDiv>
  )
}

export default InntektOgTimerFC
