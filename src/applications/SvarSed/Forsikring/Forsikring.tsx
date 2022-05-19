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
import { validateForsikringPeriode, ValidationForsikringPeriodeProps } from 'applications/SvarSed/Forsikring/validation'
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
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getNSIdx } from 'utils/namespace'
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
  const [_newType, _setNewType] = useState<string | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
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
    _setNewType(type)
    _resetValidation(namespace + '-type')
  }

  const onCloseNew = () => {}

  // when editPeriode is not undefined, it comes from ArbeidsgiverBox
  const onSaveEdit = (editPeriode: ForsikringPeriode) => {

    const type = editPeriode.__type
    const index = editPeriode.__index
    const _editTypeAndIndex = getNSIdx(editPeriode.__type, editPeriode.__index)

    const [valid, newValidation] = performValidation<ValidationForsikringPeriodeProps>(
      validation, namespace, validateForsikringPeriode, {
        periode: editPeriode,
        nsIndex: _editTypeAndIndex,
        personName
      })
    if (!!editPeriode && valid) {
      // we do not switch types
      delete editPeriode.__type
      delete editPeriode.__index
      dispatch(updateReplySed(`${type}[${index}]`, editPeriode))
      dispatch(resetValidation(namespace + _editTypeAndIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
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
    const type: string = newPeriode.__type as string
    const valid: boolean = _performValidation({
      periode: newPeriode,
      personName
    })
    if (!!newPeriode && valid) {
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

  //const doResetValidation = (namespace: string) => dispatch(resetValidation(namespace))

  const renderRow = (periode: ForsikringPeriode | null, index: number) => {
    // replace index order from map (which is "ruined" by a sort) with real index from replySed
    // namespace for index < 0: svarsed-bruker-trygdeordning-dekkede-startdato
    // namespace for index >= 0: svarsed-bruker-trygdeordning-dekkede[perioderMedITrygdeordning][2]-startdato
    const idx = index < 0 ? '' : getNSIdx(periode?.__type, periode?.__index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    //const resetValidation = index < 0 ? (namespace: string) => _resetValidation(namespace) : doResetValidation
    const _type: string | undefined = index < 0 ? _newType : periode?.__type

    const showArbeidsgiver: boolean = _.isUndefined(_type) ? false : ['perioderAnsattMedForsikring' , 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
    const showAddress: boolean = _.isUndefined(_type) ? false : ['perioderAnsattMedForsikring' , 'perioderSelvstendigMedForsikring' , 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
    const showInntekt: boolean = _.isUndefined(_type) ? false : ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
    const showAnnen: boolean = _.isUndefined(_type) ? false : ['perioderAnnenForsikring'].indexOf(_type) >= 0

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
        {index < 0 ?
          (
            <>
              <Select
                closeMenuOnSelect
                data-testid={_namespace + '-type'}
                error={_v[_namespace + '-type']?.feilmelding}
                id={_namespace + '-type'}
                key={_namespace + '-type-' + _type}
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
                  editable='full'
                  selectable={false}
                  showAddress={showAddress}
                  showArbeidsgiver={showArbeidsgiver}
                  showInntekt={showInntekt}
                  showAnnen={showAnnen}
                  icon={getIcon(periode!.__type!, '32')}
                  onForsikringPeriodeEdit={onSaveEdit}
                  onForsikringPeriodeDelete={onRemove}
                  namespace={namespace}
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
