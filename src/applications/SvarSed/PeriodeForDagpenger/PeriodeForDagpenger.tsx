import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, Heading, HGrid, HStack, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { State } from 'declarations/reducers'
import { Institusjon, Periode, PeriodeDagpenger, ReplySed } from 'declarations/sed'
import { CountryCodes, Institusjon as IRInstitusjon, Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getLandkodeFromInstitusjonsId } from 'utils/institusjon'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validatePeriodeDagpenger,
  validatePerioderDagpenger,
  ValidatePerioderDagpengerProps,
  ValidationPeriodeDagpengerProps
} from './validation'
import commonStyles from 'assets/css/common.module.css'

interface PeriodeForDagpengerSelector extends MainFormSelector {
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): PeriodeForDagpengerSelector => ({
  validation: state.validation.status,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
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
  const { validation, countryCodes, cdmVersjonApp } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const sak = (replySed as ReplySed | undefined)?.sak
  const cdmVersjon: string | undefined = sak?.cdmVersjon ?? cdmVersjonApp

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

  // NAV is an editable default, set once when a new/edit row is opened
  const getDefaultInstitusjon = (): Institusjon | undefined =>
    sak?.navinstitusjon?.id
      ? { id: sak.navinstitusjon.id, navn: sak.navinstitusjon.navn }
      : undefined

  const getInstitusjonLandkode = (institusjon: Institusjon | undefined): string | undefined =>
    institusjon?.__landkode ?? getLandkodeFromInstitusjonsId(institusjon?.id, countryCodes, cdmVersjon)

  // Selector changes only update the local draft; Add/Confirm commits it
  const setDraftInstitusjon = (institusjon: Institusjon, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon'))
  }

  const setInstitusjonLandkode = (landkode: string, index: number) => {
    setDraftInstitusjon({ id: '', navn: '', __landkode: landkode }, index)
  }

  const setInstitusjon = (institusjon: IRInstitusjon | undefined, landkode: string | undefined, index: number) => {
    setDraftInstitusjon({
      id: institusjon?.institusjonsID ?? '',
      navn: institusjon?.navn ?? '',
      __landkode: landkode
    }, index)
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
    _setEditPeriodeDagpenger(p.institusjon?.id
      ? p
      : { ...p, institusjon: getDefaultInstitusjon() ?? p.institusjon })
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
      onCloseNew()
    }
  }

  const renderRow = (periodeDagpenger: PeriodeDagpenger | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periodeDagpenger = index < 0 ? _newPeriodeDagpenger : (inEditMode ? _editPeriodeDagpenger : periodeDagpenger)

    const _institusjonLandkode = getInstitusjonLandkode(_periodeDagpenger?.institusjon)

    return (
      <Box
        id={'repeatablerow-' + _namespace}
        key={getId(periodeDagpenger)}
        className={classNames(commonStyles.repeatableBox, {
          [commonStyles.new]: index < 0,
          [commonStyles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
        paddingBlock="space-8"
        paddingInline="space-16"
      >
        <VStack gap="space-16">
          <HGrid columns={"2fr 1fr"} align="start" gap="space-16">
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
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periodeDagpenger?.periode}
                />
                )}
            <HStack>
              <Spacer/>
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
            </HStack>
          </HGrid>
          {inEditMode && (
            <InstitutionSelector
              namespace={_namespace}
              id='institusjon'
              bucType={sak?.sakType}
              landkode={_institusjonLandkode}
              value={_periodeDagpenger?.institusjon?.id || undefined}
              valueNavn={_periodeDagpenger?.institusjon?.navn}
              error={
                _v[_namespace + '-institusjon-id']?.feilmelding ??
                _v[_namespace + '-institusjon-navn']?.feilmelding
              }
              required
              onLandkodeChanged={(landkode: string) => setInstitusjonLandkode(landkode, index)}
              onInstitutionSelected={(institusjon: IRInstitusjon | undefined) =>
                setInstitusjon(institusjon, _institusjonLandkode, index)}
            />
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        {_.isEmpty(perioder)
          ? (
            <Box borderWidth={"1 0"} paddingBlock="space-8">
              <BodyLong>
                {t('message:warning-no-periods')}
              </BodyLong>
            </Box>
            )
          : perioder?.map(renderRow)}
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => {
                  _setNewPeriodeDagpenger({ institusjon: getDefaultInstitusjon() } as PeriodeDagpenger)
                  _setNewForm(true)
                }}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            </Box>
            )}
      </VStack>
    </Box>
  )
}

export default PeriodeForDagpenger
