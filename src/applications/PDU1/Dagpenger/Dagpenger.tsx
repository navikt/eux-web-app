import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { PDPeriode } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateDagpengerPeriode,
  validateDagpengerPerioder,
  ValidationDagpengerPeriodeProps,
  ValidationDagpengerPerioderProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Dagpenger: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace: string = `${parentNamespace}-dagpenger`
  const target: string = 'perioderDagpengerMottatt'
  const perioderDagpengerMottatt: Array<PDPeriode> | undefined = _.get(replySed, target)
  const getId = (p: PDPeriode | null | undefined): string =>
    p ? (p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType) : 'new-periode'

  const [_newPeriode, _setNewPeriode] = useState<PDPeriode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<PDPeriode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationDagpengerPeriodeProps>(validateDagpengerPeriode, namespace)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationDagpengerPerioderProps>(
      validation, namespace, validateDagpengerPerioder, {
        dagpenger: perioderDagpengerMottatt
      }
    )
    dispatch(setValidation(newValidation))
  })

  const setPeriode = (periode: PDPeriode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace)
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setPeriodeInfo = (info: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        info
      } as PDPeriode)
      _resetValidation(namespace + '-info')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      info
    } as PDPeriode)
    dispatch(resetValidation(namespace + getIdx(index) + '-info'))
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

  const onStartEdit = (periode: PDPeriode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + _editIndex))
    }
    _setEditPeriode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationDagpengerPeriodeProps>(
      validation, namespace, validateDagpengerPeriode, {
        periode: _editPeriode,
        index: _editIndex
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removed: PDPeriode) => {
    const newPerioder: Array<PDPeriode> = _.reject(perioderDagpengerMottatt, (p: PDPeriode) => _.isEqual(removed, p))
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('pdu1.editor.dagpenger.periode.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode
    })

    if (!!_newPeriode && valid) {
      let newPerioder: Array<PDPeriode> | undefined = _.cloneDeep(perioderDagpengerMottatt)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('pdu1.editor.dagpenger.perioder.add')
      onCloseNew()
    }
  }

  const renderRow = (periode: PDPeriode | null, index: number) => {
    const idx = getIdx(index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)

    const addremovepanel = (
      <AddRemovePanel<PDPeriode>
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
    )

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
                setPeriode={(p: PDPeriode) => setPeriode(p, index)}
                value={_periode}
              />
              )
            : (
              <>
                <Column>
                  <FlexDiv>
                    <HorizontalSeparatorDiv />
                    <PeriodeText
                      error={{
                        startdato: _v[_namespace + '-startdato'],
                        sluttdato: _v[_namespace + '-sluttdato']
                      }}
                      periode={_periode}
                    />
                    <HorizontalSeparatorDiv />
                    <FormText error={_v[_namespace + '-info']}>
                      {_periode?.info}
                    </FormText>
                  </FlexDiv>
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>

              </>
              )}
        </AlignStartRow>
        {inEditMode && (
          <>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column>
                <Input
                  error={_v[_namespace + '-info']?.feilmelding}
                  namespace={_namespace}
                  id='info'
                  key={_namespace + '-info-' + _periode?.info}
                  label={t('label:comment')}
                  onChanged={(info: string) => setPeriodeInfo(info, index)}
                  value={_periode?.info}
                />
              </Column>
            </AlignStartRow>
            <AlignStartRow>
              <AlignEndColumn>
                {addremovepanel}
              </AlignEndColumn>
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }
  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {t('label:mottatte-dagpenger')}
        </Heading>
        <VerticalSeparatorDiv />
      </PaddedDiv>
      {_.isEmpty(perioderDagpengerMottatt)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : perioderDagpengerMottatt?.map(renderRow)}
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
    </>
  )
}

export default Dagpenger
