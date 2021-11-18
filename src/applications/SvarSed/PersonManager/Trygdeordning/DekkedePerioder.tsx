import { Add } from '@navikt/ds-icons'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
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
import { Ingress, Normaltekst } from 'nav-frontend-typografi'
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
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateDekkedePeriode, ValidationDekkedePeriodeProps } from './validation'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const DekkedePerioder: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.perioderMedITrygdeordning`
  const perioderMedITrygdeordning: Array<Periode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-trygdeordninger`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationDekkedePeriodeProps>({}, validateDekkedePeriode)

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-dekkede-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-dekkede-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, periode))
      if (id === 'startdato' && validation[namespace + '-perioderMedITrygdeordning' + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + '-perioderMedITrygdeordning' + getIdx(index) + '-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + '-perioderMedITrygdeordning' + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + '-perioderMedITrygdeordning' + getIdx(index) + '-sluttdato'))
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
    const newPerioder: Array<Periode> = _.cloneDeep(perioderMedITrygdeordning)
    const deletedPerioder: Array<Periode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderMedITrygdeordning' })
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      periode: _newPeriode,
      perioder: perioderMedITrygdeordning,
      namespace,
      personName
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(perioderMedITrygdeordning)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(_newPeriode)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderMedITrygdeordning' })
      resetForm()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = (index >= 0 ? '-perioderMedITrygdeordning[' + index + ']' : '-dekkede')
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periode
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
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
      <Ingress>
        {t('label:trygdeordningen-dekkede')}
      </Ingress>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(perioderMedITrygdeordning)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : (
          <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:startdato') + ' *'}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:sluttdato')}
              </label>
            </Column>
            <Column />
          </Row>
          )}
      <VerticalSeparatorDiv />
      {perioderMedITrygdeordning?.map(renderRow)}
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
                {t('el:button-add-new-x', { x: t('label:dekkede-periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </>
  )
}

export default DekkedePerioder
