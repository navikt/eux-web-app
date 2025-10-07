import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, HStack, Spacer, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateThePeriode, ValidationAktivitetPeriodeProps } from './validation'
import AddRemove from "../../../../components/AddRemovePanel/AddRemove";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Perioder: React.FC<MainFormProps> = ({
  parentNamespace,
  parentTarget,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}`
  const target: string = `${personID}.${parentTarget}`
  const perioder: Array<Periode> | undefined = _.get(replySed, target)
  const getId = (p: Periode | null): string => p ? parentNamespace + '-' + p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAktivitetPeriodeProps>(validateThePeriode, namespace)

  const periodeType = options && options.periodeType ? options.periodeType : "withcheckbox"
  const requiredSluttDato = options && options.requiredSluttDato ? options.requiredSluttDato : false

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace)
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
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationAktivitetPeriodeProps>(
      clonedValidation, namespace, validateThePeriode, {
        periode: _editPeriode,
        perioder,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPeriode: Periode) => {
    const newPerioder: Array<Periode> = _.reject(perioder, (p: Periode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newPerioder))
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
      onCloseNew()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)
    return (
      <RepeatableBox
        padding="2"
        id={'repeatablerow-' + _namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <HStack gap="4" wrap={false} align={"center"}>
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
                value={_periode}
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
                periode={_periode}
              />
              )
          }
          <Spacer/>
          <div className="navds-button--small"/> {/* Prevent height flicker on hover */}
          <AddRemove<Periode>
            item={periode}
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

export default Perioder
