import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Detail, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateAvsenderlandetPeriode, ValidationAvsenderlandetProps } from './avsenderlandetValidation'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Avsenderlandet: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.perioderMedTrygd`
  const perioderMedTrygd: Array<Periode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-avsenderlandet`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType)
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAvsenderlandetProps>({}, validateAvsenderlandetPeriode)

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, periode))
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-sluttdato']) {
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
    const newPerioder: Array<Periode> = _.cloneDeep(perioderMedTrygd)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderMedTrygd' })
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      periode: _newPeriode,
      perioder: perioderMedTrygd,
      namespace,
      personName
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(perioderMedTrygd)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(_newPeriode)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderMedTrygd' })
      onCancel()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | null | undefined => {
      return index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }
    const _periode = index < 0 ? _newPeriode : periode
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + idx}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
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
    <>
      <Heading size='small'>
        {t('label:periods-in-sender-country')}
      </Heading>
      <VerticalSeparatorDiv size={2} />
      <Detail>
        {t('label:medlemsperiode')}
      </Detail>
      <VerticalSeparatorDiv />
      {_.isEmpty(perioderMedTrygd)
        ? (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
          )
        : perioderMedTrygd.sort((a, b) =>
          moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD'))
            ? -1
            : 1
        )
          ?.map(renderRow)}
      <VerticalSeparatorDiv size={2} />
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
                {t('el:button-add-new-x', { x: t('label:trygdeperiode-i-avsenderlandet').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default Avsenderlandet
