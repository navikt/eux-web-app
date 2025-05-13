import { PlusCircleIcon } from '@navikt/aksel-icons';
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
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { PensjonPeriode, PensjonsType, Periode, PeriodeSort, PersonTypeF001 } from 'declarations/sed'
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
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateFamilieytelserPeriode, ValidationFamilieytelsePeriodeProps } from './validation'

interface FamilieYtelserProps extends MainFormProps {
  validation: Validation
};

{/*TODO: REMOVE THIS FILE WHEN AKTIVITETOGTRYGDEPERIODER IS DONE*/}
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
  const person: PersonTypeF001 = _.get(replySed, target)

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

  const getId = (p: Periode | PensjonPeriode | null | undefined): string => (p
    ? isPensjonPeriode(p)
        ? '[' + ((p as PensjonPeriode).periode.__type ?? '') + ']-' + (p as PensjonPeriode).periode.startdato + '-' + ((p as PensjonPeriode).periode.sluttdato ?? (p as PensjonPeriode).periode.aapenPeriodeType)
        : '[' + ((p as Periode).__type ?? '') + ']-' + (p as Periode).startdato + '-' + ((p as Periode).sluttdato ?? (p as Periode).aapenPeriodeType)
    : 'new-periode')

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
    person?.perioderMedPensjon?.forEach((p: PensjonPeriode, i: number) => periodes.push({ ...p, periode: { ...p.periode, __index: i, __type: 'perioderMedPensjon' } }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  const setType = (newType: string, index: number) => {
    let oldType: string | undefined
    let oldIndex: number

    //if(newType === 'perioderMedArbeid') return

    if (index < 0) {
      if (newType === 'perioderMedPensjon') {
        _setNewPeriode({
          periode: {
            ..._newPeriode,
            __type: newType
          }
        } as PensjonPeriode)
      } else {
        if (isPensjonPeriode(_newPeriode)) {
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
      // oldType is not perioderMedPensjon -- we can't trigger setType from perioderMedPensjon to perioderMedPensjon
      oldType = (_editPeriode as Periode)?.__type
      oldIndex = (_editPeriode as Periode)?.__index
      _setEditPeriode({
        periode: {
          ..._editPeriode,
          __type: newType
        }
      } as PensjonPeriode)
    } else {
      if (isPensjonPeriode(_editPeriode)) {
        oldType = (_editPeriode as PensjonPeriode)?.periode?.__type
        oldIndex = (_editPeriode as PensjonPeriode)?.periode?.__index
        _setEditPeriode({
          ...(_editPeriode as PensjonPeriode).periode,
          __type: newType
        } as Periode)
      } else {
        oldType = (_editPeriode as Periode)?.__type
        oldIndex = (_editPeriode as Periode)?.__index
        _setEditPeriode({
          ...(_editPeriode as Periode),
          __type: newType
        } as Periode)
      }
    }
    dispatch(resetValidation(namespace + getNSIdx(oldType, oldIndex) + '-type'))
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      if (periode.__type === 'perioderMedPensjon') {
        _setNewPeriode({
          ..._newPeriode,
          periode
        } as PensjonPeriode)
      } else {
        _setNewPeriode(periode)
      }
      _resetValidation([namespace + '-startdato', namespace + '-sluttdato'])
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
    dispatch(resetValidation([
      namespace + getNSIdx(periode.__type!, periode.__index) + '-startdato',
      namespace + getNSIdx(periode.__type!, periode.__index) + '-sluttdato'
    ]))
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
    dispatch(resetValidation(
      namespace +
      getNSIdx((_editPeriode as PensjonPeriode).periode?.__type, (_editPeriode as PensjonPeriode).periode?.__index) +
      '-pensjonstype'
    ))
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
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationFamilieytelsePeriodeProps>(
      clonedValidation, namespace, validateFamilieytelserPeriode, {
        periode: _editPeriode,
        perioder: _allPeriods,
        nsIndex: _editTypeAndIndex,
        personName
      })

    if (!!_editPeriode && !hasErrors) {
      // if we switched period types, then we have to remove it from the old array, and add it to the new one

      const __editPeriode: Periode | PensjonPeriode = _.cloneDeep(_editPeriode)

      if (isPensjonPeriode(__editPeriode)) {
        delete (__editPeriode as PensjonPeriode).periode.__type
        delete (__editPeriode as PensjonPeriode).periode.__index
      } else {
        delete (__editPeriode as Periode).__type
        delete (__editPeriode as Periode).__index
      }

      const _editType: string = (
        isPensjonPeriode(_editPeriode)
          ? (_editPeriode as PensjonPeriode).periode.__type
          : (_editPeriode as Periode).__type
      ) as string

      if(_editType === "perioderMedArbeid") {
        // Backend fails for perioderMedArbeid - property does not exist.
        onCloseEdit(namespace + _editTypeAndIndex)
        return
      }

      if (type !== _editType) {
        const oldPeriods: Array<Periode | PensjonPeriode> = _.cloneDeep(_.get(person, type))
        let newPeriods: Array<Periode | PensjonPeriode> | undefined = _.cloneDeep(_.get(person, _editType))

        oldPeriods.splice(index, 1)

        if (_.isUndefined(newPeriods)) {
          newPeriods = []
        }
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
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (periode: Periode | PensjonPeriode) => {
    const type: string = (isPensjonPeriode(periode)
      ? (periode as PensjonPeriode).periode.__type
      : (periode as Periode).__type) as string
    const index: number = (isPensjonPeriode(periode)
      ? (periode as PensjonPeriode).periode.__index
      : (periode as Periode).__index) as number
    const newPerioder : Array<Periode | PensjonPeriode> = _.cloneDeep(_.get(person, type)) as Array<Periode | PensjonPeriode>
    newPerioder.splice(index, 1)
    dispatch(updateReplySed(`${target}.${type}`, newPerioder))
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

      if(type === "perioderMedArbeid") {
        // Backend fails for perioderMedArbeid - property does not exist.
        onCloseNew()
        return
      }

      let newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(_.get(person, type))
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }

      const __newPeriode: Periode | PensjonPeriode = _.cloneDeep(_newPeriode) as Periode | PensjonPeriode

      if (isPensjonPeriode(__newPeriode)) {
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

    const addremovepanel = (
      <AddRemovePanel<Periode | PensjonPeriode>
        item={periode}
        marginTop={index < 0}
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
          error: hasNamespaceWithErrors(_v, _namespace)
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
                  setPeriode={(p: Periode) => setPeriode(p, index)}
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
                    defaultValue={_p?.__type}
                    data-no-border
                    data-testid={_namespace + '-type'}
                    error={_v[_namespace + '-type']?.feilmelding}
                    id={_namespace + '-type'}
                    legend=''
                    hideLabel
                    name={_namespace + '-type'}
                    onChange={(newType: string) => setType(newType, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='perioderMedArbeid' disabled>
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
              {_p?.__type === 'perioderMedPensjon' && (
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
              <Column>
                <PeriodeText
                  periode={_p}
                  namespace={_namespace}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                />
              </Column>
              <Column>
                <FlexStartDiv>
                  {!!_p?.__type && _sort === 'time' && getTag(_p?.__type)}
                  <HorizontalSeparatorDiv />
                  {_p?.__type === 'perioderMedPensjon' && (
                    <BodyLong>
                      {t('el:option-trygdeordning-' + (_periode as PensjonPeriode).pensjonstype)}
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
                      {t('el:option-trygdeordning-perioderMedArbeid')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedArbeid?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedArbeid', __index: i }))
                  .sort(periodeSort).map(renderRow)}
                {!_.isEmpty(person?.perioderMedTrygd) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordning-perioderMedTrygd')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedTrygd?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedTrygd', __index: i }))
                  .sort(periodeSort).map(renderRow)}

                {!_.isEmpty(person?.perioderMedYtelser) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordning-perioderMedYtelser')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedYtelser?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedYtelser', __index: i }))
                  .sort(periodeSort).map(renderRow)}
                {!_.isEmpty(person?.perioderMedPensjon) && (
                  <PaddedDiv>
                    <Label>
                      {t('el:option-trygdeordning-perioderMedPensjon')}
                    </Label>
                  </PaddedDiv>
                )}
                {person?.perioderMedPensjon?.map((p: PensjonPeriode, i: number) =>
                  ({ ...p, periode: { ...p.periode, __type: 'perioderMedPensjon', __index: i } }))
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
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default FamilieYtelser
