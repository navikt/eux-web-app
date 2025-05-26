import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, HStack, Radio, RadioGroup, Spacer, Tag, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { PensjonPeriode, PensjonsType, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodePeriodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validatePerioderMedPensjonPeriode, ValidationPerioderMedPensjonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PerioderMedPensjon: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-periodermedpensjon`
  const target: string = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(replySed, target)
  const getId = (p: PensjonPeriode | null): string => p ? p.pensjonstype + '-' + p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType) : 'new'

  const [_newPensjonPeriode, _setNewPensjonPeriode] = useState<PensjonPeriode | undefined>(undefined)
  const [_editPensjonPeriode, _setEditPensjonPeriode] = useState<PensjonPeriode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPerioderMedPensjonProps>(validatePerioderMedPensjonPeriode, namespace)

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPensjonPeriode({
        ..._newPensjonPeriode,
        periode
      } as PensjonPeriode)
      _resetValidation(namespace)
      return
    }
    _setEditPensjonPeriode({
      ..._editPensjonPeriode,
      periode
    } as PensjonPeriode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setPensjonsType = (pensjonstype: string | undefined, index: number) => {
    if (pensjonstype) {
      if (index < 0) {
        _setNewPensjonPeriode({
          ..._newPensjonPeriode,
          pensjonstype: pensjonstype.trim()
        } as PensjonPeriode)
        _resetValidation(namespace + '-pensjontype')
        return
      }
      _setEditPensjonPeriode({
        ..._editPensjonPeriode,
        pensjonstype: pensjonstype.trim()
      } as PensjonPeriode)
      dispatch(resetValidation(namespace + getIdx(index) + '-pensjontype'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPensjonPeriode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPensjonPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: PensjonPeriode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPensjonPeriode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPerioderMedPensjonProps>(
      clonedValidation, namespace, validatePerioderMedPensjonPeriode, {
        pensjonPeriode: _editPensjonPeriode,
        perioder: perioderMedPensjon,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPensjonPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPeriode: PensjonPeriode) => {
    const newPerioder: Array<PensjonPeriode> = _.reject(perioderMedPensjon, (p: PensjonPeriode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderMedPensjon' })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      pensjonPeriode: _newPensjonPeriode,
      perioder: perioderMedPensjon,
      personName
    })

    if (!!_newPensjonPeriode && valid) {
      let newPensjonPerioder: Array<PensjonPeriode> | undefined = _.cloneDeep(perioderMedPensjon)
      if (_.isNil(newPensjonPerioder)) {
        newPensjonPerioder = []
      }
      newPensjonPerioder.push(_newPensjonPeriode)
      newPensjonPerioder.sort(periodePeriodeSort)
      dispatch(updateReplySed(target, newPensjonPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderMedPensjon' })
      onCloseNew()
    }
  }

  const renderRow = (pensjonPeriode: PensjonPeriode | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _pensjonPeriode = index < 0 ? _newPensjonPeriode : (inEditMode ? _editPensjonPeriode : pensjonPeriode)

    return (
      <RepeatableBox
        padding="2"
        id={'repeatablerow-' + _namespace}
        key={getId(pensjonPeriode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <HStack gap="4" wrap={false} align="start">
        {inEditMode
          ? (
            <VStack gap="4">
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                breakInTwo
                hideLabel={false}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_pensjonPeriode?.periode}
              />
              <RadioGroup
                value={_pensjonPeriode?.pensjonstype}
                data-no-border
                data-testid={_namespace + '-pensjonstype'}
                error={_v[_namespace + '-pensjonstype']?.feilmelding}
                id={_namespace + '-pensjonstype'}
                legend=''
                hideLegend={true}
                name={_namespace + '-pensjonstype'}
                onChange={(newPensjonsType: PensjonsType) => setPensjonsType(newPensjonsType, index)}
              >
                <HStack gap="4" paddingInline="1">
                  <Radio value='alderspensjon'>
                    {t('el:option-trygdeordning-alderspensjon')}
                  </Radio>
                  <Radio value='uførhet'>
                    {t('el:option-trygdeordning-uførhet')}
                  </Radio>
                </HStack>
              </RadioGroup>
            </VStack>
            )
          : (
              <HStack gap="4" align="center">
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_pensjonPeriode?.periode}
                />
                <Spacer/>
                <Tag variant="info">{t('el:option-trygdeordning-' + pensjonPeriode?.pensjonstype)}</Tag>
              </HStack>
          )
        }
          <Spacer/>
          <div className="navds-button--small"/> {/* Prevent height flicker on hover */}
          <AddRemovePanel<PensjonPeriode>
            item={pensjonPeriode}
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
      {_.isEmpty(perioderMedPensjon)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : perioderMedPensjon?.map(renderRow)}
      {_newForm
        ? renderRow(null, -1)
        : (
          <Box>
            <Button
              variant='tertiary'
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

export default PerioderMedPensjon
