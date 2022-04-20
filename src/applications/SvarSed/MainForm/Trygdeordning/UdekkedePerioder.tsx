import { AddCircle } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import {
  validateUdekkedePeriode,
  ValidationUdekkedePeriodeProps
} from 'applications/SvarSed/MainForm/Trygdeordning/validation'
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
import { Button, Ingress, BodyLong } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const UdekkedePerioder: React.FC<TwoLevelFormProps> = ({
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
  const target = `${personID}.perioderUtenforTrygdeordning`
  const perioderUtenforTrygdeordning: Array<Periode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-trygdeordninger`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType)
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationUdekkedePeriodeProps>({}, validateUdekkedePeriode)

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-udekkede-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-udekkede-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, periode))
      if (id === 'startdato' && validation[namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-sluttdato'))
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

  const onRemove = (i: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
    const deletedPerioder: Array<Periode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderUtenforTrygdeordning' })
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      periode: _newPeriode,
      perioder: perioderUtenforTrygdeordning,
      namespace,
      personName
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(_newPeriode)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderUtenforTrygdeordning' })
      onCancel()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = (index >= 0 ? '-perioderUtenforTrygdeordning[' + index + ']' : '-udekkede')
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )

    const _periode = index < 0 ? _newPeriode : periode
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + idx}
            showLabel={false}
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
              marginTop={false}
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={() => onAdd()}
              onCancelNew={() => onCancel()}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <>
      <Ingress>
        {t('label:trygdeordningen-udekkede')}
      </Ingress>
      <VerticalSeparatorDiv size={2} />
      {_.isEmpty(perioderUtenforTrygdeordning)
        ? (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
          )
        : (
          <Row>
            <Column>
              <label className='navds-text-field__label navds-label'>
                {t('label:startdato') + ' *'}
              </label>
            </Column>
            <Column>
              <label className='navds-text-field__label navds-label'>
                {t('label:sluttdato')}
              </label>
            </Column>
            <Column />
          </Row>
          )}
      <VerticalSeparatorDiv />
      {perioderUtenforTrygdeordning?.map(renderRow)}
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
                {t('el:button-add-new-x', { x: t('label:udekkede-periode').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </>
  )
}

export default UdekkedePerioder
