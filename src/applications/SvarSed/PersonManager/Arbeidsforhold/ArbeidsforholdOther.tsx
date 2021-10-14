import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeAnnenForsikring, ReplySed } from 'declarations/sed'
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
import { validatePeriodeAnnen, ValidationPeriodeAnnenProps } from './validationPeriodeAnnen'

export interface ArbeidsforholdAnnenSelector extends PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface ArbeidsforholdAnnenProps {
  parentNamespace: string
  target: string
}

const mapState = (state: State): ArbeidsforholdAnnenSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdAnnen: React.FC<ArbeidsforholdAnnenProps> = ({
  parentNamespace,
  target
}: ArbeidsforholdAnnenProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdAnnenSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeAnnenForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newAnnenTypeForsikringsperiode, _setNewAnnenTypeForsikringsperiode] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeAnnenForsikring>(
    (p: PeriodeAnnenForsikring) => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeAnnenProps>({}, validatePeriodeAnnen)

  const setAnnenTypeForsikringsperiode = (newAnnenTypeForsikringsperiode: string, index: number) => {
    if (index < 0) {
      _setNewAnnenTypeForsikringsperiode(newAnnenTypeForsikringsperiode.trim())
      _resetValidation(namespace + '-annenTypeForsikringsperiode')
    } else {
      dispatch(updateReplySed(`${target}[${index}].annenTypeForsikringsperiode`, newAnnenTypeForsikringsperiode.trim()))
      if (validation[namespace + getIdx(index) + '-annenTypeForsikringsperiode']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-annenTypeForsikringsperiode'))
      }
    }
  }

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
    _setNewAnnenTypeForsikringsperiode('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeAnnenForsikring> = _.cloneDeep(perioder) as Array<PeriodeAnnenForsikring>
    const deletedPerioder: Array<PeriodeAnnenForsikring> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderAnnenForsikring' })
  }

  const onAdd = () => {
    const newPeriodeAnnen: PeriodeAnnenForsikring = {
      ..._newPeriode,
      annenTypeForsikringsperiode: _newAnnenTypeForsikringsperiode.trim()
    }

    const valid: boolean = performValidation({
      periodeAnnen: newPeriodeAnnen,
      perioderAnnen: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderAnnen: Array<PeriodeAnnenForsikring> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderAnnen)) {
        newPerioderAnnen = []
      }
      newPerioderAnnen = newPerioderAnnen.concat(newPeriodeAnnen)
      dispatch(updateReplySed(target, newPerioderAnnen))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderAnnenForsikring' })
      resetForm()
    }
  }

  const renderRow = (periodeAnnen: PeriodeAnnenForsikring | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeAnnen)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periodeAnnen

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
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'annenTypeForsikringsperiode')}
              namespace={namespace}
              id='annenTypeForsikringsperiode'
              key={'annenTypeForsikringsperiode-' + (index < 0 ? _newAnnenTypeForsikringsperiode : periodeAnnen?.annenTypeForsikringsperiode ?? '')}
              label={t('label:virksomhetens-art')}
              onChanged={(annenTypeForsikringsperiode: string) => setAnnenTypeForsikringsperiode(annenTypeForsikringsperiode, index)}
              value={(index < 0 ? _newAnnenTypeForsikringsperiode : periodeAnnen?.annenTypeForsikringsperiode ?? '')}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeAnnen)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeAnnen)}
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

export default ArbeidsforholdAnnen
