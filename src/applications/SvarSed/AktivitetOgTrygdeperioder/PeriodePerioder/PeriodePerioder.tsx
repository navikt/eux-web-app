import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, HStack, Spacer, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {Periode, PeriodePeriode} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodePeriodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validatePeriodePeriode, ValidationPeriodePeriodeProps } from './validation'
import {PerioderProps} from "../Perioder/Perioder";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PeriodePerioder: React.FC<PerioderProps> = ({
  parentNamespace,
  parentTarget,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}:PerioderProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}`
  const target: string = `${personID}.${parentTarget}`
  const perioder: Array<PeriodePeriode> | undefined = _.get(replySed, target)
  const getId = (p: PeriodePeriode | null): string => p ? parentNamespace + '-' + p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType) : 'new'

  const [_newPeriodePeriode, _setNewPeriodePeriode] = useState<PeriodePeriode | undefined>(undefined)
  const [_editPeriodePeriode, _setEditPeriodePeriode] = useState<PeriodePeriode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodePeriodeProps>(validatePeriodePeriode, namespace)

  const periodeType = options && options.periodeType ? options.periodeType : "withcheckbox"
  const requiredSluttDato = options && options.requiredSluttDato ? options.requiredSluttDato : false

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriodePeriode({
        ..._newPeriodePeriode,
        periode
      } as PeriodePeriode)
      _resetValidation(namespace)
      return
    }
    _setEditPeriodePeriode({
      ..._editPeriodePeriode,
      periode
    } as PeriodePeriode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriodePeriode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriodePeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: PeriodePeriode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriodePeriode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPeriodePeriodeProps>(
      clonedValidation, namespace, validatePeriodePeriode, {
        periodePeriode: _editPeriodePeriode,
        perioder: perioder,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriodePeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPeriode: PeriodePeriode) => {
    const newPerioder: Array<PeriodePeriode> = _.reject(perioder, (p: PeriodePeriode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newPerioder))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periodePeriode: _newPeriodePeriode,
      perioder: perioder,
      personName
    })

    if (!!_newPeriodePeriode && valid) {
      let newPeriodePerioder: Array<PeriodePeriode> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPeriodePerioder)) {
        newPeriodePerioder = []
      }
      newPeriodePerioder.push(_newPeriodePeriode)
      newPeriodePerioder.sort(periodePeriodeSort)
      dispatch(updateReplySed(target, newPeriodePerioder))
      onCloseNew()
    }
  }

  const renderRow = (periodePeriode: PeriodePeriode | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periodePeriode = index < 0 ? _newPeriodePeriode : (inEditMode ? _editPeriodePeriode : periodePeriode)

    return (
      <RepeatableBox
        padding="4"
        id={'repeatablerow-' + _namespace}
        key={getId(periodePeriode)}
        className={classNames({
          new: index < 0,
          errorBorder: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <HStack gap="4" align="start">
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
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_periodePeriode?.periode}
                requiredSluttDato={requiredSluttDato}
                periodeType={periodeType}
              />
            )
          : (
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                namespace={_namespace}
                periode={_periodePeriode?.periode}
              />
          )
        }
          <Spacer/>
          <AddRemovePanel<PeriodePeriode>
            item={periodePeriode}
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
        </HStack>
      </RepeatableBox>
    )
  }

  return (
    <VStack gap="4">
      {_.isEmpty(perioder)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : perioder?.map(renderRow)}
      {_newForm
        ? renderRow(null, -1)
        : (
          <Box>
            <Button
              variant='tertiary'
              size={"small"}
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </Box>
          )
      }
    </VStack>
  )
}

export default PeriodePerioder
