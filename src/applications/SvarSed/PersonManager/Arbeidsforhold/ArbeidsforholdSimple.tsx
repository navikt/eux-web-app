import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Normaltekst } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validatePeriodeSimple, ValidationPeriodeSimpleProps } from './validationPeriodeSimple'

export interface ArbeidsforholdSimpleSelector extends PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface ArbeidsforholdSimpleProps {
  parentNamespace: string
  target: string
}

const mapState = (state: State): ArbeidsforholdSimpleSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdSimple: React.FC<ArbeidsforholdSimpleProps> = ({
  parentNamespace,
  target
}: ArbeidsforholdSimpleProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdSimpleSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<Periode> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>(
    (p: Periode) => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeSimpleProps>({}, validatePeriodeSimple)

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const resetForm = () => {
    _setNewPeriode({ startdato: '' })
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioder) as Array<Periode>
    const deletedPerioder: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: target })
  }

  const onAdd = () => {
    const newPeriodeSimple: Periode = _newPeriode

    const valid: boolean = performValidation({
      periode: newPeriodeSimple,
      perioder: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderSimple: Array<Periode> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderSimple)) {
        newPerioderSimple = []
      }
      newPerioderSimple = newPerioderSimple.concat(newPeriodeSimple)
      dispatch(updateReplySed(target, newPerioderSimple))
      standardLogger('svarsed.editor.periode.add', { type: target })
      resetForm()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode) => setPeriode(p, index)}
            value={_periode}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      {_.isEmpty(perioder)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : perioder?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default ArbeidsforholdSimple
