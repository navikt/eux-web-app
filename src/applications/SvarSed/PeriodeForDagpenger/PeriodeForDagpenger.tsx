import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignEndRow,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeDagpenger } from 'declarations/sed'
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
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validatePeriodeDagpenger,
  validatePerioderDagpenger,
  ValidatePerioderDagpengerProps,
  ValidationPeriodeDagpengerProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PeriodeForDagpenger: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-${personID}-periodefordagpenger`
  const target = 'dagpengeperioder'
  const perioder: Array<PeriodeDagpenger> | undefined = _.get(replySed, target)
  const getId = (p: PeriodeDagpenger | null | undefined) => p ? p.periode?.startdato + '-' + p.institusjon?.id : 'new'

  const [_newPeriodeDagpenger, _setNewPeriodeDagpenger] = useState<PeriodeDagpenger | undefined>(undefined)
  const [_editPeriodeDagpenger, _setEditPeriodeDagpenger] = useState<PeriodeDagpenger | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodeDagpengerProps>(validatePeriodeDagpenger, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidatePerioderDagpengerProps>(
      clonedValidation, namespace, validatePerioderDagpenger, {
        perioderDagpenger: perioder,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        periode
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      periode
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }

  const setInstitutionId = (id: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon: {
          ..._newPeriodeDagpenger?.institusjon,
          id: id.trim()
        }
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-id')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon: {
        ..._editPeriodeDagpenger?.institusjon,
        id: id.trim()
      }
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-id'))
  }

  const setInstitutionNavn = (navn: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon: {
          ..._newPeriodeDagpenger?.institusjon,
          navn: navn.trim()
        }
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-navn')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon: {
        ..._editPeriodeDagpenger?.institusjon,
        navn: navn.trim()
      }
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-navn'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriodeDagpenger(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriodeDagpenger(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (p: PeriodeDagpenger, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriodeDagpenger(p)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPeriodeDagpengerProps>(
      clonedValidation, namespace, validatePeriodeDagpenger, {
        periodeDagpenger: _editPeriodeDagpenger,
        perioderDagpenger: perioder,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriodeDagpenger))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: PeriodeDagpenger) => {
    const newPerioder: Array<PeriodeDagpenger> = _.reject(perioder,
      (p: PeriodeDagpenger) => _.isEqual(removed, p))
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderDagpenger' })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periodeDagpenger: _newPeriodeDagpenger,
      perioderDagpenger: perioder,
      personName
    })
    if (!!_newPeriodeDagpenger && valid) {
      let newPerioderDagpenger: Array<PeriodeDagpenger> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderDagpenger)) {
        newPerioderDagpenger = []
      }
      newPerioderDagpenger.push(_newPeriodeDagpenger)
      dispatch(updateReplySed(target, newPerioderDagpenger))
      standardLogger('svarsed.editor.newPerioderDagpenger.add', { type: 'perioderDagpenger' })
      onCloseNew()
    }
  }

  const renderRow = (periodeDagpenger: PeriodeDagpenger | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periodeDagpenger = index < 0 ? _newPeriodeDagpenger : (inEditMode ? _editPeriodeDagpenger : periodeDagpenger)

    let defaultInstitusjonNavn: string | undefined = ""
    let defaultInstitusjonId: string | undefined = ""

    if(replySed && ("sak" in replySed)) {
      defaultInstitusjonNavn = replySed?.sak?.navinstitusjon.navn
      defaultInstitusjonId = replySed?.sak?.navinstitusjon.id

      if(!_periodeDagpenger?.institusjon?.navn  && defaultInstitusjonNavn) setInstitutionNavn(defaultInstitusjonNavn, index)
      if(!_periodeDagpenger?.institusjon?.id && defaultInstitusjonId) setInstitutionId(defaultInstitusjonId, index)
    }

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(periodeDagpenger)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignEndRow style={{ minHeight: '2.2rem' }}>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace + '-periode'}
                hideLabel={false}
                error={{
                  startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                }}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_periodeDagpenger?.periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periodeDagpenger?.periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<PeriodeDagpenger>
              item={periodeDagpenger}
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
        </AlignEndRow>
        <VerticalSeparatorDiv />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-institusjon-id']?.feilmelding}
                    namespace={_namespace}
                    id='institusjon-id'
                    label={t('label:institusjonens-id')}
                    onChanged={(institusjonsid: string) => setInstitutionId(institusjonsid, index)}
                    value={_periodeDagpenger?.institusjon?.id ? _periodeDagpenger?.institusjon?.id : defaultInstitusjonId}
                  />
                </Column>
                <Column>
                  <Input
                    error={_v[_namespace + '-institusjon-navn']?.feilmelding}
                    namespace={_namespace}
                    id='institusjon-navn'
                    label={t('label:institusjonens-navn')}
                    onChanged={(institusjonsnavn: string) => setInstitutionNavn(institusjonsnavn, index)}
                    value={_periodeDagpenger?.institusjon?.navn ? _periodeDagpenger?.institusjon?.navn : defaultInstitusjonNavn}
                  />
                </Column>
                <Column />
              </AlignStartRow>
              <VerticalSeparatorDiv />
            </>
            )
          : (
            <></>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
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
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default PeriodeForDagpenger
