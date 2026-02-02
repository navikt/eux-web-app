import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, HGrid, HStack, Label, Spacer, VStack} from '@navikt/ds-react'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { InntektOgTime, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateInntektOgTime, ValidationInntektOgTimeProps } from './validation'

export interface InntektOgTimerProps {
  inntektOgTimer: Array<InntektOgTime> | undefined
  onInntektOgTimeChanged: (inntektOgTimer: Array<InntektOgTime>) => void
  parentNamespace: string
  personName?: string
  validation: Validation
}

const InntektOgTimerFC: React.FC<InntektOgTimerProps> = ({
  inntektOgTimer,
  onInntektOgTimeChanged,
  parentNamespace,
  personName,
  validation
}: InntektOgTimerProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-inntektOgTimer`
  const getId = (i: InntektOgTime | null | undefined) => i ? i.inntektsperiode.startdato + '-' + i.bruttoinntekt : 'new-inntekt'

  const [_newInntektOgTime, _setNewInntektOgTime] = useState<InntektOgTime | undefined>(undefined)
  const [_editInntektOgTime, _setEditInntektOgTime] = useState<InntektOgTime | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationInntektOgTimeProps>(validateInntektOgTime, namespace)

  const setArbeidstimer = (arbeidstimer: string, index: number) => {
    const aTimer = arbeidstimer.trim().replace(",", ".")
    if (index < 0) {
      _setNewInntektOgTime({
        ..._newInntektOgTime,
        arbeidstimer: aTimer
      } as InntektOgTime)
      _resetValidation(namespace + '-arbeidstimer')
      return
    }
    _setEditInntektOgTime({
      ..._editInntektOgTime,
      arbeidstimer: aTimer
    } as InntektOgTime)
    dispatch(resetValidation(namespace + getIdx(index) + '-arbeidstimer'))
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewInntektOgTime({
        ..._newInntektOgTime,
        inntektsperiode: periode
      } as InntektOgTime)
      _resetValidation(namespace + '-inntektsperiode')
      return
    }
    _setEditInntektOgTime({
      ..._editInntektOgTime,
      inntektsperiode: periode
    } as InntektOgTime)
    dispatch(resetValidation(namespace + getIdx(index) + '-inntektsperiode'))
  }

  const setBruttoinntekt = (newBeløp: string, index: number) => {
    const bruttoinntekt = parseFloat(newBeløp.trim().replace(",", ".")).toFixed(2)
    if (index < 0) {
      _setNewInntektOgTime({
        ..._newInntektOgTime,
        bruttoinntekt: bruttoinntekt,
        valuta: _.isNil(_newInntektOgTime?.valuta) ? 'NOK' : _newInntektOgTime?.valuta
      } as InntektOgTime)
      _resetValidation([namespace + '-beloep', namespace + '-valuta'])
      return
    }
    _setEditInntektOgTime({
      ..._editInntektOgTime,
      bruttoinntekt: bruttoinntekt,
      valuta: _.isNil(_editInntektOgTime?.valuta) ? 'NOK' : _editInntektOgTime?.valuta
    } as InntektOgTime)
    dispatch(resetValidation([namespace + getIdx(index) + '-beloep', namespace + '-beloep', namespace + '-valuta']))
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewInntektOgTime({
        ..._newInntektOgTime,
        valuta: newValuta.value
      } as InntektOgTime)
      _resetValidation([namespace + '-valuta'])
      return
    }
    _setEditInntektOgTime({
      ..._editInntektOgTime,
      valuta: newValuta.value
    } as InntektOgTime)
    dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditInntektOgTime(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewInntektOgTime(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (i: InntektOgTime, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditInntektOgTime(i)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationInntektOgTimeProps>(
      clonedValidation, namespace, validateInntektOgTime, {
        inntektOgTime: _editInntektOgTime,
        index: _editIndex,
        personName
      })
    if (_editIndex !== undefined && !!_editInntektOgTime && !hasErrors) {
      const newInntektOgTime: Array<InntektOgTime> = _.cloneDeep(inntektOgTimer) as Array<InntektOgTime>
      newInntektOgTime[_editIndex] = _editInntektOgTime
      onInntektOgTimeChanged(newInntektOgTime)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: InntektOgTime) => {
    const newInntektOgTimer: Array<InntektOgTime> = _.reject(inntektOgTimer, (i: InntektOgTime) => _.isEqual(removed, i))
    onInntektOgTimeChanged(newInntektOgTimer)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      inntektOgTime: _newInntektOgTime,
      personName
    })
    if (!!_newInntektOgTime && valid) {
      let newInntektOgTimer: Array<InntektOgTime> | undefined = _.cloneDeep(inntektOgTimer)
      if (_.isNil(newInntektOgTimer)) {
        newInntektOgTimer = []
      }
      newInntektOgTimer.push(_newInntektOgTime)
      onInntektOgTimeChanged(newInntektOgTimer)
      onCloseNew()
    }
  }

  const renderRow = (inntektOgTime: InntektOgTime | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _inntektOgTime = index < 0 ? _newInntektOgTime : (inEditMode ? _editInntektOgTime : inntektOgTime)

    return (
      <RepeatableBox
        padding="4"
        id={'repeatablerow-' + _namespace}
        key={getId(inntektOgTime)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VStack gap="4">
        <HStack align="start" gap="4">
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace + '-inntektsperiode'}
                error={{
                  startdato: _v[_namespace + '-inntektsperiode-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-inntektsperiode-sluttdato']?.feilmelding
                }}
                hideLabel={false}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_inntektOgTime?.inntektsperiode}
              />
              )
            : (
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-inntektsperiode-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-inntektsperiode-sluttdato']?.feilmelding
                }}
                namespace={_namespace}
                periode={_inntektOgTime?.inntektsperiode}
              />

            )
          }
          <Spacer/>
          <AddRemovePanel<InntektOgTime>
            item={inntektOgTime}
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
        {inEditMode
          ? (
            <HStack gap="4">
              <Input
                error={_v[_namespace + '-bruttoinntekt']?.feilmelding}
                namespace={_namespace}
                id='bruttoinntekt'
                label={t('label:brutto-inntekt')}
                onChanged={(bruttoinntekt: string) => setBruttoinntekt(bruttoinntekt, index)}
                required
                value={_inntektOgTime?.bruttoinntekt ? _inntektOgTime?.bruttoinntekt.replace('.', ',') : undefined}
              />
              <CountrySelect
                closeMenuOnSelect
                ariaLabel={t('label:valuta')}
                data-testid={_namespace + '-valuta'}
                error={_v[_namespace + '-valuta']?.feilmelding}
                id={_namespace + '-valuta'}
                label={t('label:valuta') + ' *'}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={(valuta: Currency) => setValuta(valuta, index)}
                type='currency'
                values={_inntektOgTime?.valuta}
              />
              <Input
                error={_v[_namespace + '-arbeidstimer']?.feilmelding}
                namespace={_namespace}
                id='arbeidstimer'
                label={t('label:arbeidstimer')}
                onChanged={(arbeidstimer: string) => setArbeidstimer(arbeidstimer, index)}
                value={_inntektOgTime?.arbeidstimer ? _inntektOgTime?.arbeidstimer.replace('.', ',') : undefined}
              />
            </HStack>
            )
          : (
            <HGrid columns={2}>
              <HStack gap="2">
                <Label>{t('label:beløp') + ':'}</Label>
                <FormText
                  error={_v[_namespace + '-bruttoinntekt']?.feilmelding}
                  id={_namespace + '-bruttoinntekt'}
                >
                  {_inntektOgTime?.bruttoinntekt ? _inntektOgTime?.bruttoinntekt.replace('.', ',') : '-'}
                </FormText>
                <FormText
                  error={_v[_namespace + '-valuta']?.feilmelding}
                  id={_namespace + '-valuta'}
                >
                  {_inntektOgTime?.valuta}
                </FormText>
              </HStack>
              <FormText
                error={_v[_namespace + '-arbeidstimer']?.feilmelding}
                id={_namespace + '-arbeidstimer'}
              >
                <HStack gap="2">
                  {t('label:arbeidstimer')}:
                  {_inntektOgTime?.arbeidstimer ? _inntektOgTime?.arbeidstimer.replace('.', ',') : '-'}
                </HStack>
              </FormText>
            </HGrid>
            )}
        </VStack>
      </RepeatableBox>
    )
  }

  return (
    <>
      {_.isEmpty(inntektOgTimer)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-inntekt')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : inntektOgTimer?.map(renderRow)}
      {_newForm
        ? renderRow(null, -1)
        : (
          <Box>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:inntekt').toLowerCase() })}
            </Button>
          </Box>
          )}
    </>
  )
}

export default InntektOgTimerFC
