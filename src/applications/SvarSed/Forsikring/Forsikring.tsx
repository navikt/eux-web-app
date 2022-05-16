import {
  AddCircle,
  Bag,
  Hospital,
  Law,
  Office1,
  Office2,
  PensionBag,
  Receipt,
  SchoolBag,
  ShakeHandsFilled,
  Stroller,
  Vacation
} from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexEndDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import Tooltip from '@navikt/tooltip'
import { resetValidation, setValidation } from 'actions/validation'
import InntektOgTimerFC from 'applications/SvarSed/Forsikring/InntektOgTimer/InntektOgTimer'
import { validateForsikringPeriode, ValidationForsikringPeriodeProps } from 'applications/SvarSed/Forsikring/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Military from 'assets/icons/Military'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import ArbeidsperioderBox from 'components/Arbeidsperioder/ArbeidsperioderBox'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import {
  ForsikringPeriode,
  InntektOgTime,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring,
  PeriodeSort,
  PeriodeUtenForsikring,
  U002Sed
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getNSIdx, readNSIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Forsikring: React.FC<MainFormProps> = ({
  options,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-${personID}-forsikring`
  const getId = (p: ForsikringPeriode | null | undefined): string => p ? p.__type + '[' + p.__index + ']' : 'new-forsikring'

  const [_allPeriods, _setAllPeriods] = useState<Array<ForsikringPeriode>>([])
  const [_newPeriode, _setNewPeriode] = useState<ForsikringPeriode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<ForsikringPeriode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editTypeAndIndex, _setEditTypeAndIndex] = useState<string | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationForsikringPeriodeProps>(validateForsikringPeriode, namespace)

  const [_sort, _setSort] = useState<PeriodeSort>('time')

  const periodeOptions: Options = [
    { label: t('el:option-forsikring-ANSATTPERIODE_FORSIKRET'), value: 'perioderAnsattMedForsikring' },
    { label: t('el:option-forsikring-SELVSTENDIG_FORSIKRET'), value: 'perioderSelvstendigMedForsikring' },
    { label: t('el:option-forsikring-ANSATTPERIODE_UFORSIKRET'), value: 'perioderAnsattUtenForsikring' },
    { label: t('el:option-forsikring-SELVSTENDIG_UFORSIKRET'), value: 'perioderSelvstendigUtenForsikring' },
    { label: t('el:option-forsikring-SYKDOMSPERIODE'), value: 'perioderSyk' },
    { label: t('el:option-forsikring-SVANGERSKAP_OMSORGSPERIODE'), value: 'perioderSvangerskapBarn' },
    { label: t('el:option-forsikring-FRIHETSBEROEVETPERIODE'), value: 'perioderFrihetsberoevet' },
    { label: t('el:option-forsikring-UTDANNINGSPERIODE'), value: 'perioderUtdanning' },
    { label: t('el:option-forsikring-MILITAERTJENESTE'), value: 'perioderMilitaertjeneste' },
    { label: t('el:option-forsikring-ANNENPERIODE'), value: 'perioderAnnenForsikring' },
    { label: t('el:option-forsikring-FRIVILLIG'), value: 'perioderFrivilligForsikring' },
    { label: t('el:option-forsikring-FERIE'), value: 'perioderKompensertFerie' }
  ].filter(it => options && options.include ? options.include.indexOf(it.value) >= 0 : true)

  useEffect(() => {
    const periodes: Array<ForsikringPeriode> = [];
    (replySed as U002Sed)?.perioderAnsattMedForsikring?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattMedForsikring' }));
    (replySed as U002Sed)?.perioderAnsattUtenForsikring?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattUtenForsikring' }));
    (replySed as U002Sed)?.perioderSelvstendigMedForsikring?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigMedForsikring' }));
    (replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigUtenForsikring' }));
    (replySed as U002Sed)?.perioderFrihetsberoevet?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderFrihetsberoevet' }));
    (replySed as U002Sed)?.perioderSyk?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSyk' }));
    (replySed as U002Sed)?.perioderSvangerskapBarn?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSvangerskapBarn' }));
    (replySed as U002Sed)?.perioderUtdanning?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderUtdanning' }));
    (replySed as U002Sed)?.perioderMilitaertjeneste?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderMilitaertjeneste' }));
    (replySed as U002Sed)?.perioderAnnenForsikring?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnnenForsikring' }));
    (replySed as U002Sed)?.perioderFrivilligForsikring?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderFrivilligForsikring' }));
    (replySed as U002Sed)?.perioderKompensertFerie?.forEach(
      (p, i) => periodes.push({ ...p, __index: i, __type: 'perioderKompensertFerie' }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  // only for new periods
  const setType = (type: string) => {
    _setNewPeriode({
      ..._newPeriode,
      __type: type
    } as ForsikringPeriode)
    _resetValidation(namespace + '-type')
  }

  const setPeriode = (periode: ForsikringPeriode, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        ...periode
      })
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      ...periode
    })
    dispatch(resetValidation(namespace + getNSIdx(_editPeriode!.__type!, _editPeriode!.__index) + '-startdato'))
    dispatch(resetValidation(namespace + getNSIdx(_editPeriode!.__type!, _editPeriode!.__index) + '-sluttdato'))
  }

  const onArbeidsgiverEdit = (periodeMedForsikring: PeriodeMedForsikring) => {
    onSaveEdit(periodeMedForsikring)
  }

  const setInntektOgTimer = (inntektOgTimer: Array<InntektOgTime>, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        inntektOgTimer
      } as PeriodeUtenForsikring)
      _resetValidation(namespace + '-inntektOgTimer')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      inntektOgTimer
    } as PeriodeUtenForsikring)
    dispatch(resetValidation(namespace + getNSIdx(_editPeriode!.__type!, _editPeriode!.__index) + '-inntektOgTimer'))
  }

  const setInntektOgTimerInfo = (inntektOgTimerInfo: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        inntektOgTimerInfo
      } as PeriodeUtenForsikring)
      _resetValidation(namespace + '-inntektOgTimerInfo')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      inntektOgTimerInfo
    } as PeriodeUtenForsikring)
    dispatch(resetValidation(namespace + getNSIdx(_editPeriode!.__type!, _editPeriode!.__index) + '-inntektOgTimerInfo'))
  }

  const setAnnenTypeForsikringsperiode = (annenTypeForsikringsperiode: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        annenTypeForsikringsperiode
      } as PeriodeAnnenForsikring)
      _resetValidation(namespace + '-annenTypeForsikringsperiode')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      annenTypeForsikringsperiode
    } as PeriodeAnnenForsikring)
    dispatch(resetValidation(namespace + getNSIdx(_editPeriode!.__type!, _editPeriode!.__index) + '-annenTypeForsikringsperiode'))
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

  const onStartEdit = (periode: Periode) => {
    // reset any validation that exists from a cancelled edited item
    if (_editTypeAndIndex !== undefined) {
      dispatch(resetValidation(namespace + _editTypeAndIndex))
    }
    _setEditPeriode(periode)
    _setEditTypeAndIndex(getNSIdx(periode.__type!, periode.__index))
  }

  // when editPeriode is not undefined, it comes from ArbeidsgiverBox
  const onSaveEdit = (editPeriode ?: PeriodeMedForsikring) => {
    const __editPeriode = !_.isUndefined(editPeriode) ? editPeriode : _editPeriode
    const [type, index] = readNSIdx(_editTypeAndIndex!)
    const __type = !_.isUndefined(editPeriode) ? editPeriode.__type : type
    const __index = !_.isUndefined(editPeriode) ? editPeriode.__index : index
    const __editTypeAndIndex = getNSIdx(__type, __index)

    const [valid, newValidation] = performValidation<ValidationForsikringPeriodeProps>(
      validation, namespace, validateForsikringPeriode, {
        periode: __editPeriode,
        nsIndex: _editTypeAndIndex,
        personName
      })
    if (!!__editPeriode && valid) {
      // we do not switch types
      delete __editPeriode.__type
      delete __editPeriode.__index
      dispatch(updateReplySed(`${__type}[${__index}]`, __editPeriode))
      onCloseEdit(namespace + __editTypeAndIndex)
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (periode: Periode) => {
    const type: string = periode.__type! as string
    const index: number = periode.__index!
    const perioder : Array<ForsikringPeriode> = _.cloneDeep(_.get(replySed, type)) as Array<ForsikringPeriode>
    perioder.splice(index, 1)
    dispatch(updateReplySed(`${type}`, perioder))
    standardLogger('svarsed.editor.periode.remove', { type })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      personName
    })
    if (!!_newPeriode && valid) {
      const type: string = _newPeriode.__type as string
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(_.get(replySed, type))
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      delete _newPeriode.__type
      delete _newPeriode.__index
      newPerioder.concat(_newPeriode!)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(type, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type })
      onCloseNew()
    }
  }

  const getIcon = (type: string, size: string = '32') => (
    <Tooltip label={_.find(periodeOptions, o => o.value === type)?.label ?? ''}>
      {type === 'perioderAnsattMedForsikring' && (<Office1 width={size} height={size} />)}
      {type === 'perioderSelvstendigMedForsikring' && (<PensionBag width={size} height={size} />)}
      {type === 'perioderAnsattUtenForsikring' && (<Office2 width={size} height={size} />)}
      {type === 'perioderSelvstendigUtenForsikring' && (<Bag width={size} height={size} />)}
      {type === 'perioderSyk' && (<Hospital width={size} height={size} />)}
      {type === 'perioderSvangerskapBarn' && (<Stroller width={size} height={size} />)}
      {type === 'perioderUtdanning' && (<SchoolBag width={size} height={size} />)}
      {type === 'perioderMilitaertjeneste' && (<Military width={size} height={size} />)}
      {type === 'perioderFrihetsberoevet' && (<Law width={size} height={size} />)}
      {type === 'perioderFrivilligForsikring' && (<ShakeHandsFilled width={size} height={size} />)}
      {type === 'perioderKompensertFerie' && (<Vacation width={size} height={size} />)}
      {type === 'perioderAnnenForsikring' && (<Receipt width={size} height={size} />)}
    </Tooltip>
  )

  const renderRow = (periode: ForsikringPeriode | null, index: number) => {
    // replace index order from map (which is "ruined" by a sort) with real index from replySed
    // namespace for index < 0: svarsed-bruker-trygdeordning-dekkede-startdato
    // namespace for index >= 0: svarsed-bruker-trygdeordning-dekkede[perioderMedITrygdeordning][2]-startdato
    const idx = getNSIdx(periode?.__type, periode?.__index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editTypeAndIndex === idx
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)
    const existingPeriod: boolean = !_.isNil(_periode?.__index) && _periode?.__index! >= 0

    const addremovepanel = (
      <AddRemovePanel2<ForsikringPeriode>
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
        {inEditMode && !existingPeriod &&
          (
            <>
              <Select
                closeMenuOnSelect
                data-testid={_namespace + '-type'}
                error={_v[_namespace + '-type']?.feilmelding}
                id={_namespace + '-type'}
                key={_namespace + '-type-' + _periode?.__type}
                label={t('label:type')}
                menuPortalTarget={document.body}
                onChange={(type: any) => setType(type.value)}
                options={periodeOptions}
                value={_.find(periodeOptions, o => o.value === _periode?.__type)}
                defaultValue={_.find(periodeOptions, o => o.value === _periode?.__type)}
              />
              <VerticalSeparatorDiv />
            </>
          )}
        {!_.isUndefined(_periode?.__type) && (
          <AlignStartRow>
            {inEditMode
              ? (
                <>
                  <PeriodeInput
                    namespace={_namespace}
                    error={{
                      startdato: _v[_namespace + '-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                    }}
                    hideLabel={false}
                    setPeriode={(p: ForsikringPeriode) => setPeriode(p, index)}
                    value={_periode}
                  />
                </>
                )
              : (
                <>
                  {_sort === 'time' && (
                    <Column style={{ maxWidth: '40px' }}>
                      {getIcon(_periode!.__type!, '32')}
                    </Column>
                  )}
                  <PeriodeText
                    error={{
                      startdato: _v[_namespace + '-startdato'],
                      sluttdato: _v[_namespace + '-sluttdato']
                    }}
                    periode={_periode}
                  />

                </>
                )}
            <AlignEndColumn>
              {addremovepanel}
            </AlignEndColumn>
          </AlignStartRow>
        )}
        <VerticalSeparatorDiv />
        {!_.isUndefined(_periode?.__type) && [
          'perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring',
          'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'
        ].indexOf(_periode!.__type!) >= 0 && (
          <>
            <AlignStartRow>
              <Column>
                <ArbeidsperioderBox
                  periodeMedForsikring={(_periode as PeriodeMedForsikring)}
                  editable={inEditMode ? 'full' : 'no'}
                  editMode={inEditMode}
                  selectable={false}
                  showAddress
                  onPeriodeMedForsikringEdit={onArbeidsgiverEdit}
                  namespace={namespace}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {!_.isUndefined(_periode?.__type) && ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
          .indexOf(_periode!.__type!) >= 0 && (
            <>
              {inEditMode
                ? (
                  <InntektOgTimerFC
                    validation={validation}
                    personName={personName}
                    parentNamespace={_namespace}
                    inntektOgTimer={(_periode as PeriodeUtenForsikring).inntektOgTimer}
                    onInntektOgTimeChanged={(newInntektOgTimer: Array<InntektOgTime>) => setInntektOgTimer(newInntektOgTimer, index)}
                  />
                  )
                : (
                  <BodyLong>{JSON.stringify((_periode as PeriodeUtenForsikring).inntektOgTimer)}</BodyLong>
                  )}
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  {inEditMode
                    ? (
                      <Input
                        error={_v[_namespace + '-inntektOgTimerInfo']?.feilmelding}
                        namespace={_namespace}
                        id='inntektOgTimerInfo'
                        key={_namespace + '-inntektOgTimerInfo-' + (_periode as PeriodeUtenForsikring).inntektOgTimerInfo}
                        label={t('label:inntekt-og-time-info')}
                        onChanged={(newInntektOgTimerInfo: string) => setInntektOgTimerInfo(newInntektOgTimerInfo, index)}
                        value={(_periode as PeriodeUtenForsikring).inntektOgTimerInfo}
                      />
                      )
                    : (
                      <BodyLong>
                        {JSON.stringify((_periode as PeriodeUtenForsikring).inntektOgTimerInfo)}
                      </BodyLong>
                      )}
                </Column>
              </AlignStartRow>
            </>
        )}
        {!_.isUndefined(_periode?.__type) && _periode!.__type === 'perioderAnnenForsikring' && (
          <>
            <AlignStartRow>
              <Column>
                {inEditMode
                  ? (<Input
                      error={_v[_namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                      namespace={_namespace}
                      id='annenTypeForsikringsperiode'
                      key={_namespace + '-annenTypeForsikringsperiode-' + (_periode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                      label={t('label:annen-type')}
                      onChanged={(newAnnenTypeForsikringsperiode: string) => setAnnenTypeForsikringsperiode(newAnnenTypeForsikringsperiode, index)}
                      value={(_periode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                     />
                    )
                  : (
                    <BodyLong>{JSON.stringify((_periode as PeriodeAnnenForsikring).annenTypeForsikringsperiode)}</BodyLong>
                    )}
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {index < 0 && (
          <AlignStartRow>
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
      <VerticalSeparatorDiv />
      {!_.isEmpty(_allPeriods) && (
        <>
          <PaddedHorizontallyDiv>
            <Checkbox
              checked={_sort === 'group'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
            >
              {t('label:group-by-periodetype')}
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
        : _sort === 'time'
          ? _allPeriods.map(renderRow)
          : (
            <>
              {periodeOptions.map(o => {
                const periods: Array<ForsikringPeriode> | undefined = _.get(replySed, o.value) as Array<ForsikringPeriode> | undefined
                if (_.isEmpty(periods)) {
                  return null
                }
                return (
                  <div key={o.value}>
                    <PaddedDiv>
                      <FlexEndDiv>
                        {getIcon(o.value, '20')}
                        <HorizontalSeparatorDiv size='0.35' />
                        <Label>
                          {o.label}
                        </Label>
                      </FlexEndDiv>
                    </PaddedDiv>
                    {periods!.map((p, i) => ({ ...p, __type: o.value, __index: i })).sort(periodeSort).map(renderRow)}
                    <VerticalSeparatorDiv />
                  </div>
                )
              })}
            </>
            )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <HorizontalLineSeparator />
      </PaddedDiv>
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

export default Forsikring
