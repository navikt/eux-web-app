import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Label, Tag } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexRadioPanels,
  FlexStartDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { PensjonPeriode, PensjonsType, Periode, PeriodeSort, Person } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getNSIdx, readNSIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { validateFamilieytelserPeriode, ValidationFamilieytelsePeriodeProps } from './validation'

interface FamilieYtelserProps extends MainFormProps {
  validation: Validation
}

const FamilieYtelser: React.FC<FamilieYtelserProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  validation
}: FamilieYtelserProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const target = `${personID}`
  const namespace = `${parentNamespace}-familieytelser`
  const person: Person = _.get(replySed, target)

  const [_allPeriods, _setAllPeriods] = useState<Array<Periode | PensjonPeriode>>([])
  const [_newPeriode, _setNewPeriode] = useState<Periode | PensjonPeriode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | PensjonPeriode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editTypeAndIndex, _setEditTypeAndIndex] = useState<string | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] =
    useLocalValidation<ValidationFamilieytelsePeriodeProps>(validateFamilieytelserPeriode, namespace)

  const isPensjonPeriode = (p: Periode | PensjonPeriode | null | undefined): boolean => (
    p
      ? Object.prototype.hasOwnProperty.call(p, 'periode') || Object.prototype.hasOwnProperty.call(p, 'pensjonstype')
      : false
  )

  const getId = (p: Periode | PensjonPeriode | null | undefined): string => p
    ? isPensjonPeriode(p)
        ? '[' + ((p as PensjonPeriode).periode.__type ?? '') + ']-' + (p as PensjonPeriode).periode.startdato + '-' + ((p as PensjonPeriode).periode.sluttdato ?? (p as PensjonPeriode).periode.aapenPeriodeType)
        : '[' + ((p as Periode).__type ?? '') + ']-' + (p as Periode).startdato + '-' + ((p as Periode).sluttdato ?? (p as Periode).aapenPeriodeType)
    : 'new'

  const [_sort, _setSort] = useState<PeriodeSort>('time')

  const periodeSort = (a: Periode | PensjonPeriode, b: Periode | PensjonPeriode) => (
    moment(isPensjonPeriode(a) ? (a as PensjonPeriode).periode!.startdato : (a as Periode)?.startdato)
      .isSameOrBefore(moment(isPensjonPeriode(b) ? (b as PensjonPeriode).periode!.startdato : (b as Periode)?.startdato))
      ? -1
      : 1
  )

  useEffect(() => {
    const periodes: Array<Periode | PensjonPeriode> = []
    person?.perioderMedArbeid?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'perioderMedArbeid' }))
    person?.perioderMedTrygd?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'perioderMedTrygd' }))
    person?.perioderMedYtelser?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'perioderMedYtelser' }))
    person?.perioderMedPensjon?.forEach((p: PensjonPeriode, i: number) => periodes.push({
      ...p,
      periode: {
        ...p.periode,
        __index: i,
        __type: 'perioderMedPensjon'
      }
    }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  // oldType is undefined when we have a new entry
  const setType = (newType: string, oldType: string | undefined, index: number) => {
    if (index < 0) {
      if (newType === 'perioderMedPensjon') {
        // oldType is not perioderMedPensjon
        _setNewPeriode({
          periode: {
            ..._newPeriode,
            __type: newType
          }
        } as PensjonPeriode)
      } else {
        if (oldType === 'perioderMedPensjon') {
          _setNewPeriode({
            ...(_newPeriode as PensjonPeriode).periode,
            __type: newType
          } as Periode)
        } else {
          _setNewPeriode({
            ...(_newPeriode as Periode),
            __type: newType
          } as Periode)
        }
      }
      _resetValidation(namespace + '-type')
      return
    }

    if (newType === 'perioderMedPensjon') {
      // oldType is not perioderMedPensjon
      _setEditPeriode({
        periode: {
          ..._editPeriode,
          __type: newType
        }
      } as PensjonPeriode)
    } else {
      if (oldType === 'perioderMedPensjon') {
        _setEditPeriode({
          ...(_editPeriode as PensjonPeriode).periode,
          __type: newType
        } as Periode)
      } else {
        _setEditPeriode({
          ...(_editPeriode as Periode),
          __type: newType
        } as Periode)
      }
    }
    dispatch(resetValidation(namespace + getNSIdx(oldType, index) + '-type'))
  }

  const setPeriode = (periode: Periode, whatChanged: string | undefined, index: number) => {
    if (index < 0) {
      // this is correct even if we are dealing with PensjonPeriode, as we are handling only periods
      if (periode.__type === 'perioderMedPensjon') {
        _setNewPeriode({
          ..._newPeriode,
          periode
        } as PensjonPeriode)
      } else {
        _setNewPeriode(periode)
      }
      if (whatChanged) {
        _resetValidation(namespace + '-' + whatChanged)
      }
      return
    }

    if (periode.__type === 'perioderMedPensjon') {
      _setEditPeriode({
        ..._editPeriode,
        periode
      } as PensjonPeriode)
    } else {
      _setEditPeriode(periode)
    }
    // keep errors in pensjonstype, if used
    dispatch(resetValidation(namespace + getNSIdx(periode.__type!, periode.__index) + '-startdato'))
    dispatch(resetValidation(namespace + getNSIdx(periode.__type!, periode.__index) + '-sluttdato'))
  }

  const setPensjonsType = (type: PensjonsType, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        pensjonstype: type
      } as PensjonPeriode)
      _resetValidation(namespace + '-pensjonstype')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      pensjonstype: type
    } as PensjonPeriode)
    dispatch(resetValidation(namespace + getNSIdx((_editPeriode as Periode).__type!, (_editPeriode as Periode).__index)))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditTypeAndIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: Periode | PensjonPeriode) => {
    // reset any validation that exists from a cancelled edited item
    if (_editTypeAndIndex !== undefined) {
      dispatch(resetValidation(namespace + _editTypeAndIndex))
    }
    _setEditPeriode(periode)
    const _p = isPensjonPeriode(periode) ? (periode as PensjonPeriode).periode : periode
    _setEditTypeAndIndex(getNSIdx((_p as Periode)!.__type!, (_p as Periode)!.__index))
  }

  const onSaveEdit = () => {
    const [type, index] = readNSIdx(_editTypeAndIndex!)
    const [valid, newValidation] = performValidation<ValidationFamilieytelsePeriodeProps>(
      validation, namespace, validateFamilieytelserPeriode, {
        periode: _editPeriode,
        perioder: _allPeriods,
        personName,
        nsIndex: _editTypeAndIndex
      })

    if (!!_editPeriode && valid) {
      // get the new edited periode type
      const _editType: string = (isPensjonPeriode(_editPeriode)
        ? (_editPeriode as PensjonPeriode).periode.__type
        : (_editPeriode as Periode).__type) as string

      // clone it, so we can work it with
      const __editPeriode: Periode | PensjonPeriode = _.cloneDeep(_editPeriode) as Periode | PensjonPeriode

      // clean up from aux vars
      if (_editType === 'perioderMedPensjon') {
        delete (__editPeriode as PensjonPeriode).periode.__type
        delete (__editPeriode as PensjonPeriode).periode.__index
      } else {
        delete (__editPeriode as Periode).__type
        delete (__editPeriode as Periode).__index
      }

      // if we switched period types, then we have to remove it from the old array, and add it to the new one
      // type is the "old type" (comes from the asigned index), _editType is the new type (from current _editPeriode)
      if (type !== _editType) {
        const oldPeriods: Array<Periode | PensjonPeriode> = _.cloneDeep(_.get(person, type))
        let newPeriods: Array<Periode | PensjonPeriode> | undefined = _.cloneDeep(_.get(person, _editType)) as Array<Periode | PensjonPeriode> | undefined
        if (_.isUndefined(newPeriods)) {
          newPeriods = []
        }
        oldPeriods.splice(index, 1)
        newPeriods.push(__editPeriode)
        newPeriods = newPeriods.sort(periodeSort)

        const newPerson = _.cloneDeep(person)
        _.set(newPerson, type, oldPeriods)
        _.set(newPerson, _editType, newPeriods)
        dispatch(updateReplySed(target, newPerson))
      } else {
        dispatch(updateReplySed(`${target}[${type}][${index}]`, __editPeriode))
      }
      onCloseEdit(namespace + _editTypeAndIndex)
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (periode: Periode | PensjonPeriode) => {
    const type: string = (isPensjonPeriode(periode)
      ? (periode as PensjonPeriode).periode.__type
      : (periode as Periode).__type) as string

    const index: number = (isPensjonPeriode(periode)
      ? (periode as PensjonPeriode).periode.__index
      : (periode as Periode).__index) as number

    const perioder : Array<Periode | PensjonPeriode> = _.cloneDeep(_.get(person, type)) as Array<Periode | PensjonPeriode>
    perioder.splice(index, 1)
    dispatch(updateReplySed(`${target}.${type}`, perioder))
    standardLogger('svarsed.editor.periode.remove', { type })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      perioder: _allPeriods,
      personName
    })

    if (!!_newPeriode && valid) {
      const type: string = (isPensjonPeriode(_newPeriode)
        ? (_newPeriode as PensjonPeriode).periode.__type
        : (_newPeriode as Periode).__type) as string

      let newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(_.get(person, type))
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }

      const __newPeriode: Periode | PensjonPeriode = _.cloneDeep(_newPeriode) as Periode | PensjonPeriode

      if (type === 'perioderMedPensjon') {
        delete (__newPeriode as PensjonPeriode).periode.__type
        delete (__newPeriode as PensjonPeriode).periode.__index
      } else {
        delete (__newPeriode as Periode).__type
        delete (__newPeriode as Periode).__index
      }

      newPerioder.push(__newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}[${type}]`, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type })
      onCloseNew()
    }
  }

  const getTag = (type: string) => (
    <Tag size='small' variant='info'>
      {t('el:option-trygdeordning-' + type)}
    </Tag>
  )

  const renderRow = (periode: Periode | PensjonPeriode | null, index: number) => {
    const _originalType: string | undefined = isPensjonPeriode(periode) ? (periode as PensjonPeriode)?.periode.__type : (periode as Periode)?.__type
    const _originalIndex: number | undefined = isPensjonPeriode(periode) ? (periode as PensjonPeriode)?.periode.__index : (periode as Periode)?.__index

    const idx = getNSIdx(_originalType, _originalIndex)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editTypeAndIndex === idx

    const _periode: Periode | PensjonPeriode | null | undefined = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)
    const _p: Periode | null | undefined = isPensjonPeriode(_periode) ? (_periode as PensjonPeriode)?.periode : (_periode as Periode)
    const _currentType = _p?.__type

    const addremovepanel = (
      <AddRemovePanel2<Periode | PensjonPeriode>
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
        key={getId(_periode)}
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-startdato'] || _v[_namespace + '-sluttdato']
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <PeriodeInput
                  namespace={_namespace}
                  hideLabel={false}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  setPeriode={(p: Periode, whatChanged: string) => setPeriode(p, whatChanged, index)}
                  value={_p}
                />
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignStartRow>
              <VerticalSeparatorDiv size='0.5' />
              <AlignStartRow>
                <Column>
                  <RadioPanelGroup
                    value={_currentType}
                    data-no-border
                    data-testid={_namespace + '-type'}
                    error={_v[_namespace + '-type']?.feilmelding}
                    id={_namespace + '-type'}
                    legend=''
                    hideLabel
                    name={_namespace + '-type'}
                    onChange={(newType: string) => setType(newType, _originalType, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='perioderMedArbeid'>
                        {t('el:option-trygdeordning-perioderMedArbeid')}
                      </RadioPanel>
                      <RadioPanel value='perioderMedTrygd'>
                        {t('el:option-trygdeordning-perioderMedTrygd')}
                      </RadioPanel>
                      <RadioPanel value='perioderMedYtelser'>
                        {t('el:option-trygdeordning-perioderMedYtelser')}
                      </RadioPanel>
                      <RadioPanel value='perioderMedPensjon'>
                        {t('el:option-trygdeordning-perioderMedPensjon')}
                      </RadioPanel>
                    </FlexRadioPanels>
                  </RadioPanelGroup>
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv size='0.5' />
              {_currentType === 'perioderMedPensjon' && (
                <AlignStartRow>
                  <Column>
                    <RadioPanelGroup
                      value={(_periode as PensjonPeriode)?.pensjonstype}
                      data-no-border
                      data-testid={_namespace + '-pensjonstype'}
                      error={_v[_namespace + '-pensjonstype']?.feilmelding}
                      id={_namespace + '-pensjonstype'}
                      legend=''
                      hideLabel
                      name={_namespace + '-pensjonstype'}
                      onChange={(newPensjonsType: PensjonsType) => setPensjonsType(newPensjonsType, index)}
                    >
                      <FlexRadioPanels>
                        <RadioPanel value='alderspensjon'>
                          {t('el:option-trygdeordning-alderspensjon')}
                        </RadioPanel>
                        <RadioPanel value='uførhet'>
                          {t('el:option-trygdeordning-uførhet')}
                        </RadioPanel>
                      </FlexRadioPanels>
                    </RadioPanelGroup>
                  </Column>
                  <Column />
                </AlignStartRow>
              )}
            </>
            )
          : (
            <AlignStartRow>
              <PeriodeText
                periode={_p}
                error={{
                  startdato: _v[_namespace + '-startdato'],
                  sluttdato: _v[_namespace + '-sluttdato']
                }}
              />
              <Column>
                <FlexStartDiv>
                  {!!_originalType && _sort === 'time' && getTag(_originalType)}
                  <HorizontalSeparatorDiv />
                  {_originalType === 'perioderMedPensjon' && (
                    <BodyLong>
                      {t('el:option-trygdeordning-' + (periode as PensjonPeriode).pensjonstype)}
                    </BodyLong>
                  )}
                </FlexStartDiv>
              </Column>
              <AlignEndColumn>
                {addremovepanel}
              </AlignEndColumn>
            </AlignStartRow>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      {!_.isEmpty(_allPeriods) && (
        <>
          <PaddedHorizontallyDiv>
            <Checkbox
              checked={_sort === 'group'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
            >
              {t('label:group-by-familieytelse')}
            </Checkbox>
          </PaddedHorizontallyDiv>
          <VerticalSeparatorDiv />
        </>
      )}
      {_.isEmpty(_allPeriods)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (_sort === 'time'
            ? _allPeriods?.map(renderRow)
            : (
              <>
                {!_.isEmpty(person?.perioderMedArbeid) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordninger-perioderMedArbeid')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedArbeid?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedArbeid', __index: i }))
                  .sort(periodeSort).map(renderRow)}
                {!_.isEmpty(person?.perioderMedTrygd) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordninger-perioderMedTrygd')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedTrygd?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedTrygd', __index: i }))
                  .sort(periodeSort).map(renderRow)}

                {!_.isEmpty(person?.perioderMedYtelser) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordninger-perioderMedYtelser')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedYtelser?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedYtelser', __index: i }))
                  .sort(periodeSort).map(renderRow)}
                {!_.isEmpty(person?.perioderMedPensjon) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordninger-perioderMedPensjon')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedPensjon?.map((p: PensjonPeriode, i: number) =>
                  ({
                    ...p,
                    periode: {
                      ...p.periode,
                      __type: 'perioderMedPensjon',
                      __index: i
                    }
                  }))
                  .sort(periodeSort).map(renderRow)}
              </>
              ))}
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

export default FamilieYtelser
