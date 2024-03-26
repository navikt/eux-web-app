import { PlusCircleIcon, PersonSuitIcon, GavelSoundBlockIcon, WalletIcon, Buldings3Icon,SackPensionIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Checkbox, Heading, Ingress, Tooltip } from '@navikt/ds-react'
import {
  AlignStartRow,
  AlignEndColumn,
  Column,
  FlexDiv,
  FlexBaseDiv,
  FlexEndDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { PDPeriode, PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Periode, PeriodeSort } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getNSIdx, readNSIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateAllePDPerioder,
  ValidateAllePDPerioderProps,
  validatePDPeriode,
  ValidationPDPeriodeProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Perioder: React.FC<MainFormProps> = ({
  label,
  options,
  parentNamespace,
  replySed,
  setReplySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-perioder`
  const getId = (p: PDPeriode | null | undefined): string =>
    p ? (p.__type + '-' + p?.startdato ?? '') + '-' + (p?.sluttdato ?? p.aapenPeriodeType) : 'new-periode'

  const [_allPeriods, _setAllPeriods] = useState<Array<PDPeriode>>([])
  const [_newPeriode, _setNewPeriode] = useState<PDPeriode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<PDPeriode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editTypeAndIndex, _setEditTypeAndIndex] = useState<string | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPDPeriodeProps>(validatePDPeriode, namespace)

  const [_sort, _setSort] = useState<PeriodeSort>('group')

  const periodeOptions: Options = [
    { label: t('el:option-perioder-perioderAnsattMedForsikring'), value: 'perioderAnsattMedForsikring' },
    { label: t('el:option-perioder-perioderSelvstendigMedForsikring'), value: 'perioderSelvstendigMedForsikring' },
    { label: t('el:option-perioder-perioderAndreForsikringer'), value: 'perioderAndreForsikringer' },
    { label: t('el:option-perioder-perioderAnsettSomForsikret'), value: 'perioderAnsettSomForsikret' },
    { label: t('el:option-perioder-perioderAnsattUtenForsikring'), value: 'perioderAnsattUtenForsikring' },
    { label: t('el:option-perioder-perioderSelvstendigUtenForsikring'), value: 'perioderSelvstendigUtenForsikring' },
    { label: t('el:option-perioder-perioderLoennSomAnsatt'), value: 'perioderLoennSomAnsatt' },
    { label: t('el:option-perioder-perioderInntektSomSelvstendig'), value: 'perioderInntektSomSelvstendig' }
  ].filter(it => options && options.include ? options.include.indexOf(it.value) >= 0 : true)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidateAllePDPerioderProps>(
      clonedvalidation, namespace, validateAllePDPerioder, {
        pdu1: _.cloneDeep(replySed as PDU1)
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    const periodes: Array<PDPeriode> = [];
    (replySed as PDU1)?.perioderAnsattMedForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattMedForsikring' }));
    (replySed as PDU1)?.perioderSelvstendigMedForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigMedForsikring' }));
    (replySed as PDU1)?.perioderAndreForsikringer?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAndreForsikringer' }));
    (replySed as PDU1)?.perioderAnsettSomForsikret?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsettSomForsikret' }));
    (replySed as PDU1)?.perioderAnsattUtenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattUtenForsikring' }));
    (replySed as PDU1)?.perioderSelvstendigUtenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigUtenForsikring' }));
    (replySed as PDU1)?.perioderLoennSomAnsatt?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderLoennSomAnsatt' }));
    (replySed as PDU1)?.perioderInntektSomSelvstendig?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderInntektSomSelvstendig' }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  // oldType is undefined when we have a new entry
  const setType = (newType: string, oldType: string | undefined, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        __type: newType.trim()
      } as PDPeriode)
      _resetValidation(namespace + '-type')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      __type: newType.trim()
    } as PDPeriode)
    dispatch(resetValidation(namespace + getNSIdx(oldType, _editPeriode?.__index) + '-type'))
  }

  const setPeriode = (periode: PDPeriode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace)
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation(namespace + getNSIdx(periode.__type!, periode.__index)))
  }

  const setPeriodeInfo = (info: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        info: info.trim()
      } as PDPeriode)
      _resetValidation(namespace + '-info')
      return
    }
    _setEditPeriode({
      ..._editPeriode,
      info: info.trim()
    } as PDPeriode)
    dispatch(resetValidation(namespace + getNSIdx(_editPeriode?.__type!, _editPeriode?.__index) + '-info'))
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

  const onStartEdit = (periode: PDPeriode) => {
    // reset any validation that exists from a cancelled edited item
    if (_editTypeAndIndex !== undefined) {
      dispatch(resetValidation(namespace + _editTypeAndIndex))
    }
    _setEditPeriode(periode)
    _setEditTypeAndIndex(getNSIdx(periode.__type!, periode.__index))
  }

  const onSaveEdit = () => {
    const [type, index] = readNSIdx(_editTypeAndIndex!)
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPDPeriodeProps>(
      clonedvalidation, namespace, validatePDPeriode, {
        periode: _editPeriode,
        nsIndex: _editTypeAndIndex
      })
    if (!!_editPeriode && !hasErrors) {
      const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1

      // if we switched period types, then we have to remove it from the old array, and add it to the new one
      if (type !== _editPeriode?.__type) {
        const oldPeriods: Array<Periode> = _.cloneDeep(_.get(replySed, type))
        let newPeriods: Array<Periode> | undefined = _.cloneDeep(_.get(replySed, _editPeriode.__type!)) as Array<Periode> | undefined
        if (_.isUndefined(newPeriods)) {
          newPeriods = []
        }
        const switchingPeriod: Array<Periode> = oldPeriods.splice(index, 1)
        delete switchingPeriod[0].__type
        delete switchingPeriod[0].__index
        newPeriods.push(switchingPeriod[0])
        newPeriods = newPeriods.sort(periodeSort)

        _.set(newReplySed, type, oldPeriods)
        _.set(newReplySed, _editPeriode.__type!, newPeriods)
      } else {
        delete _editPeriode.__type
        delete _editPeriode.__index
        _.set(newReplySed, `${type}[${index}]`, _editPeriode)
      }
      dispatch(setReplySed(newReplySed))
      onCloseEdit(namespace + _editTypeAndIndex)
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removed: PDPeriode) => {
    const type: string = removed.__type!
    const index: number = removed.__index! as number
    const newPerioder: Array<PDPeriode> = _.cloneDeep(_.get(replySed, type)) as Array<PDPeriode>
    newPerioder.splice(index, 1)
    dispatch(updateReplySed(type, newPerioder))
    standardLogger('pdu1.editor.periode.remove', { type })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode as PDPeriode
    })
    if (!!_newPeriode && valid) {
      const type: string = _newPeriode.__type as string
      let newPerioder: Array<PDPeriode> | undefined = _.cloneDeep(_.get(replySed, type))
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      delete _newPeriode.__type
      delete _newPeriode.__index
      newPerioder.push(_newPeriode!)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(type, newPerioder))
      standardLogger('pdu1.editor.periode.add', { type })
      onCloseNew()
    }
  }

  const getIcon = (type: string, size: string = '32') => {
    let icon;
    switch (type) {
      case 'perioderAnsattMedForsikring':
        icon = <FlexDiv><SackPensionIcon width={size} height={size}/><Buldings3Icon width={size} height={size}/></FlexDiv>
        break;
      case 'perioderSelvstendigMedForsikring':
        icon = <FlexDiv><SackPensionIcon width={size} height={size}/><PersonSuitIcon width={size} height={size}/></FlexDiv>
        break;
      case 'perioderAndreForsikringer':
        icon = <SackPensionIcon width={size} height={size}/>
        break;
      case 'perioderAnsettSomForsikret':
        icon = <FlexDiv><SackPensionIcon width={size} height={size}/><GavelSoundBlockIcon width={size} height={size}/></FlexDiv>
        break;
      case 'perioderAnsattUtenForsikring':
        icon = <Buldings3Icon width={size} height={size}/>
        break;
      case 'perioderSelvstendigUtenForsikring':
        icon = <PersonSuitIcon width={size} height={size}/>
        break;
      case 'perioderLoennSomAnsatt':
        icon = <FlexDiv><WalletIcon width={size} height={size}/><Buldings3Icon width={size} height={size}/></FlexDiv>
        break;
      case 'perioderInntektSomSelvstendig':
        icon = <FlexDiv><WalletIcon width={size} height={size}/><PersonSuitIcon width={size} height={size}/></FlexDiv>
        break;
      default:
        icon = <></>
    }
    return (
      <Tooltip placement='top' content={_.find(periodeOptions, o => o.value === type)?.label ?? ''}>
        {icon}
      </Tooltip>
    )
  }

  const renderRow = (periode: PDPeriode | null, index: number) => {
    // replace index order from map (which is "ruined" by a sort) with real index from replySed
    const idx = getNSIdx(periode?.__type, periode?.__index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editTypeAndIndex === idx
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)

    const addremovepanel = (
      <AddRemovePanel<PDPeriode>
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
                  setPeriode={(p: PDPeriode) => setPeriode(p, index)}
                  value={_periode}
                  finalFormat = 'DD.MM.YYYY'
                  uiFormat = 'DD.MM.YYYY'
                />
              </>
              )
            : (
              <>
                <Column flex='2'>
                  <FlexBaseDiv>
                    {_sort === 'time' && _periode?.__type && getIcon(_periode.__type!, '32')}
                    <HorizontalSeparatorDiv />
                    <PeriodeText
                      error={{
                        startdato: _v[_namespace + '-startdato']?.feilmelding,
                        sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                      }}
                      namespace={_namespace}
                      periode={_periode}
                      uiFormat = 'DD.MM.YYYY'
                    />
                    <HorizontalSeparatorDiv />
                    <FormText
                      error={_v[_namespace + '-info']?.feilmelding}
                      id={_namespace + '-info'}
                    >
                      {_periode?.info}
                    </FormText>
                  </FlexBaseDiv>
                </Column>
              </>
              )}
          <AlignEndColumn>
            {addremovepanel}
          </AlignEndColumn>
        </AlignStartRow>
        {inEditMode && (
          <>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column>
                <Select
                  closeMenuOnSelect
                  data-testid={_namespace + '-type'}
                  error={_v[namespace + '-type']?.feilmelding}
                  id={_namespace + '-type'}
                  key={_namespace + '-type-' + _periode?.__type}
                  label={t('label:type')}
                  menuPortalTarget={document.body}
                  onChange={(type: any) => setType(type.value, _periode?.__type, index)}
                  options={periodeOptions}
                  value={_.find(periodeOptions, o => o.value === _periode?.__type)}
                  defaultValue={_.find(periodeOptions, o => o.value === _periode?.__type)}
                />
              </Column>
              <Column>
                <Input
                  error={_v[_namespace + '-info']?.feilmelding}
                  namespace={_namespace}
                  id='info'
                  key={_namespace + '-info-' + _periode?.info}
                  label={_periode?.__type === 'perioderAndreForsikringer'
                    ? t('label:type')
                    : _periode?.__type === 'perioderAnsettSomForsikret'
                      ? t('label:begrunnelse')
                      : ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_periode?.__type ?? '') >= 0
                          ? t('label:aktivitetstype')
                          : _periode?.__type === 'perioderLoennSomAnsatt'
                            ? t('label:loenn')
                            : _periode?.__type === 'perioderInntektSomSelvstendig'
                              ? t('label:inntekt')
                              : t('label:comment')}
                  onChanged={(info: string) => setPeriodeInfo(info, index)}
                  value={_periode?.info}
                />
              </Column>
            </AlignStartRow>
          </>
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
                const periods: Array<PDPeriode> | undefined = _.get(replySed, o.value) as Array<PDPeriode> | undefined
                if (_.isEmpty(periods)) {
                  return null
                }
                return (
                  <div key={o.value}>
                    <PaddedHorizontallyDiv>
                      <FlexEndDiv>
                        {getIcon(o.value, '24')}
                        <HorizontalSeparatorDiv size='0.35' />
                        <Ingress>
                          {o.label}
                        </Ingress>
                      </FlexEndDiv>
                    </PaddedHorizontallyDiv>
                    <VerticalSeparatorDiv />
                    {periods!.map((p, i) => ({ ...p, __type: o.value, __index: i })).sort(periodeSort).map(renderRow)}
                    <VerticalSeparatorDiv size='2' />
                  </div>
                )
              })}
            </>
            )}
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

export default Perioder
