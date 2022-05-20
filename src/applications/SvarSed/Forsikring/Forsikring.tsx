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
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Military from 'assets/icons/Military'
import classNames from 'classnames'
import Select from 'components/Forms/Select'
import ForsikringPeriodeBox from 'components/ForsikringPeriodeBox/ForsikringPeriodeBox'
import { HorizontalLineSeparator, RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { ForsikringPeriode, Periode, PeriodeSort, U002Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getNSIdx } from 'utils/namespace'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Forsikring: React.FC<MainFormProps> = ({
  options,
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-${personID}-forsikring`
  const getId = (p: ForsikringPeriode | null | undefined): string => p ? p.__type + '[' + p.__index + ']' : 'new-forsikring'

  const [_allPeriods, _setAllPeriods] = useState<Array<ForsikringPeriode>>([])
  const [_newType, _setNewType] = useState<string | undefined>(undefined)
  const [_newTypeError, _setNewTypeError] = useState<string | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)

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
    _setNewType(type)
    _setNewTypeError(undefined)
  }

  const onCloseNew = () => {
    _setNewType(undefined)
    _setNewTypeError(undefined)
    _setNewForm(false)
  }

  const onSaveEdit = (editPeriode: ForsikringPeriode) => {
    const type = editPeriode.__type
    const index = editPeriode.__index
    const _editTypeAndIndex = getNSIdx(editPeriode.__type, editPeriode.__index)
    // we do not switch types
    delete editPeriode.__type
    delete editPeriode.__index
    dispatch(updateReplySed(`${type}[${index}]`, editPeriode))
    dispatch(resetValidation(namespace + _editTypeAndIndex))
  }

  const onRemove = (periode: Periode) => {
    const type: string = periode.__type!
    const index: number = periode.__index!
    const perioder : Array<ForsikringPeriode> = _.cloneDeep(_.get(replySed, type)) as Array<ForsikringPeriode>
    perioder.splice(index, 1)
    dispatch(updateReplySed(`${type}`, perioder))
    standardLogger('svarsed.editor.periode.remove', { type })
  }

  const onAddNew = (newPeriode: ForsikringPeriode) => {
    if (!newPeriode.__type) {
      _setNewTypeError(t('validation:noType'))
      return
    }
    const type: string = newPeriode.__type as string
    let newPerioder: Array<Periode> | undefined = _.cloneDeep(_.get(replySed, type))
    if (_.isNil(newPerioder)) {
      newPerioder = []
    }
    delete newPeriode.__type
    delete newPeriode.__index
    newPerioder.concat(newPeriode!)
    newPerioder = newPerioder.sort(periodeSort)
    dispatch(updateReplySed(type, newPerioder))
    standardLogger('svarsed.editor.periode.add', { type })
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

  const doResetValidation = (namespace: string) => dispatch(resetValidation(namespace))
  const doSetValidation = (validation: Validation) => dispatch(setValidation(validation))

  const renderRow = (periode: ForsikringPeriode | null, index: number) => {
    const _type: string | undefined = index < 0 ? _newType : periode?.__type

    const showArbeidsgiver: boolean = _.isUndefined(_type) ? false : ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
    const showAddress: boolean = _.isUndefined(_type) ? false : ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
    const showInntekt: boolean = _.isUndefined(_type) ? false : ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
    const showAnnen: boolean = _.isUndefined(_type) ? false : ['perioderAnnenForsikring'].indexOf(_type) >= 0

    return (
      <RepeatableRow
        id={'repeatablerow-' + namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(validation, namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {index < 0
          ? (
            <>
              <Select
                closeMenuOnSelect
                data-testid={namespace + '-type'}
                error={_newTypeError}
                id={namespace + '-type'}
                key={namespace + '-type-' + _type}
                label={t('label:type')}
                menuPortalTarget={document.body}
                onChange={(type: any) => setType(type.value)}
                options={periodeOptions}
                value={_.find(periodeOptions, o => o.value === _type)}
                defaultValue={_.find(periodeOptions, o => o.value === _type)}
              />
              <VerticalSeparatorDiv />
              {_type && (
                <AlignStartRow>
                  <Column>
                    <ForsikringPeriodeBox
                      forsikringPeriode={({
                        ...periode,
                        __type: _type
                      } as ForsikringPeriode)}
                      newMode
                      editable='full'
                      selectable={false}
                      showAddress={showAddress}
                      showArbeidsgiver={showArbeidsgiver}
                      showInntekt={showInntekt}
                      showAnnen={showAnnen}
                      icon={getIcon(_type, '32')}
                      onForsikringPeriodeNew={onAddNew}
                      onForsikringPeriodeNewClose={onCloseNew}
                      namespace={namespace}
                    />
                  </Column>
                </AlignStartRow>
              )}
            </>
            )
          : (
            <>
              <AlignStartRow>
                <Column>
                  <ForsikringPeriodeBox
                    forsikringPeriode={periode}
                    allowDelete
                    allowEdit
                    selectable={false}
                    showAddress={showAddress}
                    showArbeidsgiver={showArbeidsgiver}
                    showInntekt={showInntekt}
                    showAnnen={showAnnen}
                    icon={_sort === 'time' ? getIcon(periode!.__type!, '24') : null}
                    onForsikringPeriodeEdit={onSaveEdit}
                    onForsikringPeriodeDelete={onRemove}
                    namespace={namespace}
                    validation={validation}
                    resetValidation={doResetValidation}
                    setValidation={doSetValidation}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
            </>
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
