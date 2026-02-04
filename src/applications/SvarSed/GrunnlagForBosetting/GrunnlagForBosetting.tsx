import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Detail, Heading, Box, VStack, HGrid, HStack, Spacer } from '@navikt/ds-react'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateField from 'components/DateField/DateField'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import TextArea from 'components/Forms/TextArea'
import { RepeatableBox, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateGrunnlagForBosetting,
  validateGrunnlagForBosettingPeriode, ValidateGrunnlagForBosettingProps,
  ValidationGrunnlagForBosettingPeriodeProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const GrunnlagforBosetting: React.FC<MainFormProps & {standalone?: boolean}> = ({
  label,
  parentNamespace,
  personID,
  personName,
  standalone = true,
  replySed,
  updateReplySed
}:MainFormProps & {standalone?: boolean}): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = standalone ? `${parentNamespace}-${personID}-grunnlagforbosetting` : `${parentNamespace}-grunnlagforbosetting`
  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn | undefined = _.get(replySed, target)
  const getId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationGrunnlagForBosettingPeriodeProps>(validateGrunnlagForBosettingPeriode, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidateGrunnlagForBosettingProps>(
      clonedvalidation, namespace, validateGrunnlagForBosetting, {
        flyttegrunn, personName
      }, true)
    dispatch(setValidation(clonedvalidation))
    dispatch(resetAdresse())
  })

  const setAvsenderDato = (dato: string) => {
    dispatch(updateReplySed(`${target}.datoFlyttetTilAvsenderlandet`, dato.trim()))
    if (validation[namespace + '-datoFlyttetTilAvsenderlandet']) {
      dispatch(resetValidation(namespace + '-datoFlyttetTilAvsenderlandet'))
    }
  }

  const setMottakerDato = (dato: string) => {
    dispatch(updateReplySed(`${target}.datoFlyttetTilMottakerlandet`, dato.trim()))
    if (validation[namespace + '-datoFlyttetTilMottakerlandet']) {
      dispatch(resetValidation(namespace + '-datoFlyttetTilMottakerlandet'))
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace)
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setPersonligSituasjon = (personligSituasjon: string) => {
    dispatch(updateReplySed(`${target}.personligSituasjon`, personligSituasjon.trim()))
    if (validation[namespace + '-personligSituasjon']) {
      dispatch(resetValidation(namespace + '-personligSituasjon'))
    }
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
    const hasErrors = performValidation<ValidationGrunnlagForBosettingPeriodeProps>(
      clonedValidation, namespace, validateGrunnlagForBosettingPeriode, {
        periode: _editPeriode,
        perioder: flyttegrunn?.perioder,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.perioder[${_editIndex}]`, _editPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPeriode: Periode) => {
    const newPerioder: Array<Periode> = _.reject(flyttegrunn?.perioder, (p: Periode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(`${target}.perioder`, newPerioder))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      perioder: flyttegrunn?.perioder,
      personName
    })

    if (!!_newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(flyttegrunn?.perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.perioder`, newPerioder))
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
        id={'repeatablerow-' + _namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="2 4"
      >
        <HGrid columns={"2fr 1fr"} align="center" gap="4">
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                breakInTwo
                hideLabel={index >= 0}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_periode}
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
              )}
          <HStack>
            <Spacer/>
            <AddRemovePanel<Periode>
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
          </HStack>
        </HGrid>
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Detail>
          {t('label:oppholdets-varighet')}
        </Detail>
        {_.isEmpty(flyttegrunn?.perioder)
          ? (
            <>
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-periods')}
              </BodyLong>
              <SpacedHr />
            </>
            )
          : flyttegrunn?.perioder?.map(renderRow)}
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
            )}
        <HGrid columns={{ xs: 1, sm: 2 }} gap="4">
          <DateField
            error={validation[namespace + '-datoFlyttetTilAvsenderlandet']?.feilmelding}
            namespace={namespace}
            id='datoFlyttetTilAvsenderlandet'
            label={t('label:flyttedato-til-avsenderlandet')}
            onChanged={setAvsenderDato}
            dateValue={flyttegrunn?.datoFlyttetTilAvsenderlandet}
          />
          <DateField
            error={validation[namespace + '-datoFlyttetTilMottakerlandet']?.feilmelding}
            namespace={namespace}
            id='datoFlyttetTilMottakerlandet'
            label={t('label:flyttedato-til-mottakerslandet')}
            onChanged={setMottakerDato}
            dateValue={flyttegrunn?.datoFlyttetTilMottakerlandet}
          />
        </HGrid>
        <TextArea
          error={validation[namespace + '-personligSituasjon']?.feilmelding}
          namespace={namespace}
          id='personligSituasjon'
          maxLength={255}
          label={t('label:elementter-i-personlig-situasjon')}
          onChanged={setPersonligSituasjon}
          value={flyttegrunn?.personligSituasjon ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default GrunnlagforBosetting
