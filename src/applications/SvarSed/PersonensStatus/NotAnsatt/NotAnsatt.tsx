import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  PaddedDiv,
  Column,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateNotAnsattPeriode, ValidationNotAnsattPeriodeProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const type: any = {
  'arbeidsforhold-2': 'perioderSomSelvstendig',
  'arbeidsforhold-3': 'perioderSomSykMedLoenn',
  'arbeidsforhold-4': 'perioderSomPermittertMedLoenn',
  'arbeidsforhold-5': 'perioderSomPermittertUtenLoenn'
}

const NotAnsatt: React.FC<MainFormProps & {arbeidsforhold: string}> = ({
  arbeidsforhold,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps & {arbeidsforhold: string}): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const periodeType: string = type[arbeidsforhold]
  const namespace = `${parentNamespace}-notansatt-${periodeType}`
  const target: string = `${personID}.${periodeType}`
  const perioder: Array<Periode> | undefined = _.get(replySed, target)
  const getId = (p: Periode | null): string => p ? periodeType + '-' + p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationNotAnsattPeriodeProps>(validateNotAnsattPeriode, namespace)

  const setPeriode = (periode: Periode, whatChanged: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-' + whatChanged)
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationNotAnsattPeriodeProps>(
      validation, namespace, validateNotAnsattPeriode, {
        periode: _editPeriode,
        perioder,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedPeriode: Periode) => {
    const newPerioder: Array<Periode> = _.reject(perioder, (p: Periode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: periodeType })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      perioder,
      personName
    })

    if (!!_newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: periodeType })
      onCloseNew()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                breakInTwo
                hideLabel={false}
                setPeriode={(p: Periode, whatChanged: string) => setPeriode(p, whatChanged, index)}
                value={_periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato'],
                    sluttdato: _v[_namespace + '-sluttdato']
                  }}
                  periode={_periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel2<Periode>
              item={periode}
              marginTop={inEditMode}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={() => onCloseEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:ansettelsesperioder')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(perioder)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : perioder?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default NotAnsatt
