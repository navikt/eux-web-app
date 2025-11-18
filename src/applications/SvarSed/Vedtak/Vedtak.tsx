import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Checkbox, Heading, Label, Tag } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  validateKompetansePeriode,
  validateVedtak,
  validateVedtakPeriode,
  ValidationKompetansePeriodeProps,
  ValidationVedtakPeriodeProps,
  ValidationVedtakProps
} from 'applications/SvarSed/Vedtak/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import DateField from "components/DateField/DateField";
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { F002Sed, JaNei, KompetansePeriode, Periode, PeriodeSort, Vedtak, VedtakBarn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx, getNSIdx, readNSIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodePeriodeSort, periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const VedtakFC: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  personName
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-vedtak`
  const target = 'vedtak'
  const vedtak: Vedtak | undefined = _.get(replySed, target)
  const getVedtakPeriodeId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new-peridoe'
  const getKompetansePeriodeId = (p: KompetansePeriode | null): string => p ? p.periode?.__type + '-' + p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType) : 'new-vedtakperiode'

  const [_newVedtakPeriode, _setNewVedtakPeriode] = useState<Periode | undefined>(undefined)
  const [_editVedtakPeriode, _setEditVedtakPeriode] = useState<Periode | undefined>(undefined)

  const [_allKompetansePeriods, _setAllKompetansePeriods] = useState<Array<KompetansePeriode>>([])
  const [_newKompetansePeriode, _setNewKompetansePeriode] = useState<KompetansePeriode | undefined>(undefined)
  const [_editKompetansePeriode, _setEditKompetansePeriode] = useState<KompetansePeriode | undefined>(undefined)

  const [_newVedtakPeriodeForm, _setNewVedtakPeriodeForm] = useState<boolean>(false)
  const [_editVedtakPeriodeIndex, _setEditVedtakPeriodeIndex] = useState<number | undefined>(undefined)
  const [_validationVedtakPeriode, _resetValidationVedtakPeriode, _performValidationVedtakPeriode] = useLocalValidation<ValidationVedtakPeriodeProps>(validateVedtakPeriode, namespace)

  const [_newKompetansePeriodeForm, _setNewKompetansePeriodeForm] = useState<boolean>(false)
  const [_editKompetansePeriodeTypeAndIndex, _setEditKompetansePeriodeTypeAndIndex] = useState<string | undefined>(undefined)
  const [_validationKompetansePeriode, _resetValidationKompetansePeriode, _performValidationKompetansePeriode] = useLocalValidation<ValidationKompetansePeriodeProps>(validateKompetansePeriode, namespace)

  const [_showSkalYtelseUtbetales, setShowSkalYtelseUtbetales]= useState<boolean>(false)

  const [_sort, _setSort] = useState<PeriodeSort>('time')

  const vedtaksTypeOptions: Options = [
    { label: t('el:option-vedtaktype-midlertidig-vedtak'), value: 'midlertidig_vedtak' },
    { label: t('el:option-vedtaktype-vedtak-om-kompetanse'), value: 'vedtak_om_kompetanse' },
  ]
  const kompetanseTypeOptions: Options = [
    { label: t('el:option-kompetansetype-primaerkompetanseArt68'), value: 'primaerkompetanseArt68' },
    { label: t('el:option-kompetansetype-sekundaerkompetanseArt68'), value: 'sekundaerkompetanseArt68' },
    { label: t('el:option-kompetansetype-primaerkompetanseArt58'), value: 'primaerkompetanseArt58' },
    { label: t('el:option-kompetansetype-sekundaerkompetanseArt58'), value: 'sekundaerkompetanseArt58' }
  ]

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationVedtakProps>(
      clonedValidation, namespace, validateVedtak, {
        vedtak: _.cloneDeep(vedtak),
        formalName: personName
      }
    )
    dispatch(setValidation(clonedValidation))
    dispatch(resetAdresse())
  })

  useEffect(() => {
    const allKompetansePeriods: Array<KompetansePeriode> = []
    vedtak?.primaerkompetanseArt58?.forEach((p: KompetansePeriode, i: number) => allKompetansePeriods.push({ ...p, periode: { ...p.periode, __index: i, __type: 'primaerkompetanseArt58' } }))
    vedtak?.sekundaerkompetanseArt58?.forEach((p: KompetansePeriode, i: number) => allKompetansePeriods.push({ ...p, periode: { ...p.periode, __index: i, __type: 'sekundaerkompetanseArt58' } }))
    vedtak?.primaerkompetanseArt68?.forEach((p: KompetansePeriode, i: number) => allKompetansePeriods.push({ ...p, periode: { ...p.periode, __index: i, __type: 'primaerkompetanseArt68' } }))
    vedtak?.sekundaerkompetanseArt68?.forEach((p: KompetansePeriode, i: number) => allKompetansePeriods.push({ ...p, periode: { ...p.periode, __index: i, __type: 'sekundaerkompetanseArt68' } }))
    _setAllKompetansePeriods(allKompetansePeriods.sort(periodePeriodeSort))
  }, [replySed])

  const setGjelderAlleBarn = (newGjelderAlleBarn: JaNei) => {
    let newVedtak: Vedtak | undefined = _.cloneDeep(vedtak)
    if (_.isUndefined(newVedtak) || _.isNull(newVedtak)) {
      newVedtak = {} as Vedtak
    }
    _.set(newVedtak, 'gjelderAlleBarn', newGjelderAlleBarn.trim())
    if (newGjelderAlleBarn.trim() === 'ja') {
      _.set(newVedtak, 'barnVedtaketOmfatter', [])
    }

    dispatch(updateReplySed(target, newVedtak))
    if (validation[namespace + '-gjelderAlleBarn']) {
      dispatch(resetValidation([namespace + '-gjelderAlleBarn', namespace + '-barnVedtaketOmfatter']))
    }
  }

  const setVedtakstype = (newType: string) => {
    dispatch(updateReplySed(`${target}.vedtakstype`, newType.trim()))
    if (validation[namespace + '-vedtakstype']) {
      dispatch(resetValidation(namespace + '-vedtakstype'))
    }
  }

  const setVedtaksdato = (newDato: string) => {
    dispatch(updateReplySed(`${target}.vedtaksdato`, newDato.trim()))
    if (validation[namespace + '-vedtaksdato']) {
      dispatch(resetValidation(namespace + '-vedtaksdato'))
    }
  }

  const setBegrunnelse = (newBegrunnelse: string) => {
    dispatch(updateReplySed(`${target}.begrunnelse`, newBegrunnelse.trim()))
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setYtterligeInfo = (newInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInfo`, newInfo.trim()))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  const onCheckBarn = (vedtakBarn: VedtakBarn, checked: boolean) => {
    let newBarnVedtaketOmfatter: Array<VedtakBarn> | undefined = _.cloneDeep(vedtak?.barnVedtaketOmfatter)
    if (_.isNil(newBarnVedtaketOmfatter)) {
      newBarnVedtaketOmfatter = []
    }
    if (checked) {
      newBarnVedtaketOmfatter.push(vedtakBarn)
      newBarnVedtaketOmfatter = newBarnVedtaketOmfatter.sort((a: VedtakBarn, b: VedtakBarn) =>
        moment(a.foedselsdato).isSameOrBefore(moment(b.foedselsdato)) ? -1 : 1
      )
    } else {
      newBarnVedtaketOmfatter = _.reject(newBarnVedtaketOmfatter, vb => _.isEqual(vb, vedtakBarn))
    }
    dispatch(updateReplySed(`${target}.barnVedtaketOmfatter`, newBarnVedtaketOmfatter))
    if (validation[namespace + '-barnVedtaketOmfatter']) {
      dispatch(resetValidation(namespace + '-barnVedtaketOmfatter'))
    }
  }

  const setVedtakPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewVedtakPeriode(periode)
      _resetValidationVedtakPeriode(namespace + '-vedtaksperioder')
      return
    }
    _setEditVedtakPeriode(periode)
    dispatch(resetValidation(namespace + getIdx(index) + '-vedtaksperioder'))
  }

  const setKompetansePeriodeType = (newType: string, index: number) => {
    let deleteSkalYtelseUtbetalesProp = false
    if(newType === "primaerkompetanseArt68" || newType === "sekundaerkompetanseArt68" ){
      setShowSkalYtelseUtbetales(true)
    } else {
      setShowSkalYtelseUtbetales(false)
      deleteSkalYtelseUtbetalesProp = true
    }

    if (index < 0) {
      if(deleteSkalYtelseUtbetalesProp){
        delete _newKompetansePeriode?.skalYtelseUtbetales
      }
      _setNewKompetansePeriode({
        ..._newKompetansePeriode,
        periode: {
          ..._newKompetansePeriode?.periode,
          __type: newType
        }
      } as KompetansePeriode)
      _resetValidationKompetansePeriode(namespace + '-type')
      return
    }
    const oldType: string | undefined = _editKompetansePeriode?.periode.__type

    if(deleteSkalYtelseUtbetalesProp){
      delete _editKompetansePeriode?.skalYtelseUtbetales
    }

    _setEditKompetansePeriode({
      ..._editKompetansePeriode,
      periode: {
        ..._editKompetansePeriode?.periode,
        __type: newType
      }
    } as KompetansePeriode)
    dispatch(resetValidation(namespace + getNSIdx(oldType, _newKompetansePeriode?.periode.__index) + '-type'))
  }

  const setKompetansePeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewKompetansePeriode({
        ..._newKompetansePeriode,
        periode
      } as KompetansePeriode)
      _resetValidationKompetansePeriode(namespace + '-perioder')
      return
    }
    _setEditKompetansePeriode({
      ..._editKompetansePeriode,
      periode
    } as KompetansePeriode)
    dispatch(resetValidation(namespace + getNSIdx(periode?.__type, periode?.__index) + '-perioder'))
  }

  const setKompetansePeriodeSkalYtelseUtbetales = (newSkalYtelseUtbetales: JaNei, index: number) => {
    if (index < 0) {
      _setNewKompetansePeriode({
        ..._newKompetansePeriode,
        skalYtelseUtbetales: newSkalYtelseUtbetales
      } as KompetansePeriode)
      _resetValidationKompetansePeriode(namespace + '-skalYtelseUtbetales')
      return
    }
    _setEditKompetansePeriode({
      ..._editKompetansePeriode,
      skalYtelseUtbetales: newSkalYtelseUtbetales
    } as KompetansePeriode)
    dispatch(resetValidation(namespace + getNSIdx(_newKompetansePeriode?.periode?.__type, _newKompetansePeriode?.periode?.__index) + '-skalYtelseUtbetales'))
  }

  const onCloseVedtakPeriodeEdit = (namespace: string) => {
    _setEditVedtakPeriode(undefined)
    _setEditVedtakPeriodeIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseKompetansePeriodeEdit = (namespace: string) => {
    _setEditKompetansePeriode(undefined)
    _setEditKompetansePeriodeTypeAndIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseVedtakPeriodeNew = () => {
    _setNewVedtakPeriode(undefined)
    _setNewVedtakPeriodeForm(false)
    _resetValidationVedtakPeriode()
  }

  const onCloseKompetansePeriodeNew = () => {
    _setNewKompetansePeriode(undefined)
    _setNewKompetansePeriodeForm(false)
    _resetValidationKompetansePeriode()
  }

  const onStartVedtakPeriodeEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editVedtakPeriodeIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editVedtakPeriodeIndex)))
    }
    _setEditVedtakPeriode(periode)
    _setEditVedtakPeriodeIndex(index)
  }

  const onStartKompetansePeriodeEdit = (periode: KompetansePeriode) => {
    // reset any validation that exists from a cancelled edited item
    if (_editKompetansePeriodeTypeAndIndex !== undefined) {
      dispatch(resetValidation(namespace + _editKompetansePeriodeTypeAndIndex))
    }
    _setEditKompetansePeriode(periode)
    _setEditKompetansePeriodeTypeAndIndex(getNSIdx(periode.periode?.__type, periode.periode?.__index))
  }

  const onSaveVedtakPeriodeEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationVedtakPeriodeProps>(
      clonedValidation, namespace, validateVedtakPeriode, {
        periode: _editVedtakPeriode,
        perioder: vedtak?.vedtaksperioder,
        index: _editVedtakPeriodeIndex,
        formalName: personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.vedtaksperioder[${_editVedtakPeriodeIndex}]`, _editVedtakPeriode))
      onCloseVedtakPeriodeEdit(namespace + getIdx(_editVedtakPeriodeIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onSaveKompetansePeriodeEdit = () => {
    const [type, index] = readNSIdx(_editKompetansePeriodeTypeAndIndex!)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationKompetansePeriodeProps>(
      clonedValidation, namespace, validateKompetansePeriode, {
        kompetanseperiode: _editKompetansePeriode,
        kompetanseperioder: _allKompetansePeriods,
        nsIndex: _editKompetansePeriodeTypeAndIndex,
        formalName: personName
      })

    if (!!_editKompetansePeriode && !hasErrors) {
      // if we switched period types, then we have to remove it from the old array, and add it to the new one

      const __editKompetansePeriode = _.cloneDeep(_editKompetansePeriode)
      delete __editKompetansePeriode.periode.__type
      delete __editKompetansePeriode.periode.__index

      if (type !== _editKompetansePeriode?.periode?.__type) {
        const oldPeriods: Array<KompetansePeriode> = _.cloneDeep(_.get(vedtak, type))
        let newPeriods: Array<KompetansePeriode> | undefined = _.cloneDeep(_.get(vedtak, _editKompetansePeriode?.periode?.__type!))

        oldPeriods.splice(index, 1)

        if (_.isUndefined(newPeriods)) {
          newPeriods = []
        }

        newPeriods.push(__editKompetansePeriode)
        newPeriods = newPeriods.sort(periodePeriodeSort)

        const newVedtak: Vedtak = _.cloneDeep(vedtak) as Vedtak
        _.set(newVedtak, type, oldPeriods)
        _.set(newVedtak, _editKompetansePeriode.periode.__type!, newPeriods)
        dispatch(updateReplySed(target, newVedtak))
      } else {
        dispatch(updateReplySed(`${target}[${type}][${index}]`, __editKompetansePeriode))
      }
      onCloseKompetansePeriodeEdit(namespace + _editKompetansePeriodeTypeAndIndex)
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }
  const onRemoveVedtakPeriode = (removed: Periode) => {
    const newPerioder: Array<Periode> = _.reject(vedtak?.vedtaksperioder, (p: Periode) => _.isEqual(removed, p))
    dispatch(updateReplySed(`${target}.vedtaksperioder`, newPerioder))
  }

  const onRemoveKompetansePeriode = (removed: KompetansePeriode) => {
    const type: string = removed.periode.__type!
    const index: number = removed.periode.__index! as number
    const newPerioder: Array<KompetansePeriode> = _.cloneDeep(_.get(vedtak, type)) as Array<KompetansePeriode>
    newPerioder.splice(index, 1)
    dispatch(updateReplySed(`${target}.${type}`, newPerioder))
  }

  const onAddVedtakPeriodeNew = () => {
    const valid: boolean = _performValidationVedtakPeriode({
      periode: _newVedtakPeriode,
      perioder: vedtak?.vedtaksperioder,
      formalName: personName
    })

    if (!!_newVedtakPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(vedtak?.vedtaksperioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newVedtakPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.vedtaksperioder`, newPerioder))
      onCloseVedtakPeriodeNew()
    }
  }

  const onAddKompetansePeriodeNew = () => {
    const valid: boolean = _performValidationKompetansePeriode({
      kompetanseperiode: _newKompetansePeriode,
      kompetanseperioder: _allKompetansePeriods,
      formalName: personName
    })
    if (!!_newKompetansePeriode && valid) {
      const type: string = _newKompetansePeriode.periode.__type as string
      let newPerioder: Array<KompetansePeriode> | undefined = _.cloneDeep(_.get(vedtak, type))
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      delete _newKompetansePeriode.periode.__type
      delete _newKompetansePeriode.periode.__index
      newPerioder.push(_newKompetansePeriode!)
      newPerioder = newPerioder.sort(periodePeriodeSort)
      dispatch(updateReplySed(`${target}[${type}]`, newPerioder))
      onCloseKompetansePeriodeNew()
    }
  }

  const renderVedtakPeriodeRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + '-vedtaksperioder' + getIdx(index)
    const _v: Validation = index < 0 ? _validationVedtakPeriode : validation
    const inEditMode = index < 0 || _editVedtakPeriodeIndex === index
    const _periode = index < 0 ? _newVedtakPeriode : (inEditMode ? _editVedtakPeriode : periode)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getVedtakPeriodeId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
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
                setPeriode={(p: Periode) => setVedtakPeriode(p, index)}
                value={_periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<Periode>
              item={periode}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveVedtakPeriode}
              onAddNew={onAddVedtakPeriodeNew}
              onCancelNew={onCloseVedtakPeriodeNew}
              onStartEdit={onStartVedtakPeriodeEdit}
              onConfirmEdit={onSaveVedtakPeriodeEdit}
              onCancelEdit={() => onCloseVedtakPeriodeEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  const getTag = (type: string) => {
    const label: string | undefined = _.find(kompetanseTypeOptions, v => v.value === type)?.label
    if (!label) return null
    return (<Tag size='small' variant='info'>{label}</Tag>)
  }

  const renderKompetansePeriodeRow = (periode: KompetansePeriode | null, index: number) => {
    // replace index order from map (which is "ruined" by a sort) with real index from replySed
    const idx = getNSIdx(periode?.periode?.__type, periode?.periode?.__index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validationKompetansePeriode : validation
    const inEditMode = index < 0 || _editKompetansePeriodeTypeAndIndex === idx
    const _periode = index < 0 ? _newKompetansePeriode : (inEditMode ? _editKompetansePeriode : periode)

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getKompetansePeriodeId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace + '-periode'}
                error={{
                  startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                }}
                hideLabel={index >= 0}
                setPeriode={(p: Periode) => setKompetansePeriode(p, index)}
                value={_periode?.periode}
              />
              )
            : (
              <>
                <Column>
                  <PeriodeText
                    error={{
                      startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                    }}
                    namespace={_namespace + '-periode'}
                    periode={_periode?.periode}
                  />
                </Column>
                <Column>
                  {_periode?.skalYtelseUtbetales &&
                    <FormText
                      error={_v[_namespace + '-skalYtelseUtbetales']?.feilmelding}
                      id={_namespace + '-skalYtelseUtbetales'}
                    >
                      <FlexDiv>
                        <Label>{t('label:skal-ytelse-utbetales') + ':'}</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {t('label:' + _periode?.skalYtelseUtbetales)}
                      </FlexDiv>
                    </FormText>
                  }
                </Column>
              </>
              )}
          <AlignEndColumn>
            <AddRemovePanel<KompetansePeriode>
              item={periode}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveKompetansePeriode}
              onAddNew={onAddKompetansePeriodeNew}
              onCancelNew={onCloseKompetansePeriodeNew}
              onStartEdit={onStartKompetansePeriodeEdit}
              onConfirmEdit={onSaveKompetansePeriodeEdit}
              onCancelEdit={() => onCloseKompetansePeriodeEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Select
                    closeMenuOnSelect
                    data-testid={_namespace + '-type'}
                    error={_v[_namespace + '-type']?.feilmelding}
                    id={_namespace + '-type'}
                    label={t('label:vedtak-type')}
                    menuPortalTarget={document.body}
                    onChange={(o: unknown) => setKompetansePeriodeType((o as Option).value, index)}
                    options={kompetanseTypeOptions}
                    defaultValue={_.find(kompetanseTypeOptions, v => v.value === _periode?.periode?.__type)}
                    value={_.find(kompetanseTypeOptions, v => v.value === _periode?.periode?.__type)}
                  />
                </Column>
                <Column>
                  {(_showSkalYtelseUtbetales || _periode?.skalYtelseUtbetales) &&
                    <RadioPanelGroup
                      value={_periode?.skalYtelseUtbetales}
                      data-testid={_namespace + '-skalYtelseUtbetales'}
                      data-no-border
                      error={_v[_namespace + '-skalYtelseUtbetales']?.feilmelding}
                      id={_namespace + '-skalYtelseUtbetales'}
                      legend={t('label:skal-ytelse-utbetales') + ' *'}
                      name={_namespace + '-borSammen'}
                      onChange={(e: string) => setKompetansePeriodeSkalYtelseUtbetales(e as JaNei, index)}
                    >
                      <FlexRadioPanels>
                        <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                        <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
                      </FlexRadioPanels>
                    </RadioPanelGroup>
                  }
                </Column>
              </>
              )
            : (
              <>
                <Column flex='2'>
                  {_sort === 'time' && getTag(_periode?.periode.__type!)}
                </Column>
              </>
              )}
        </AlignStartRow>
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
        <VerticalSeparatorDiv size='2' />
        <Row>
          <Column flex='2'>
            <RadioPanelGroup
              value={vedtak?.gjelderAlleBarn}
              data-no-border
              data-testid={namespace + '-gjelderAlleBarn'}
              error={validation[namespace + '-gjelderAlleBarn']?.feilmelding}
              id={namespace + '-gjelderAlleBarn'}
              legend={t('label:vedtak-angående-alle-barn') + ' *'}
              name={namespace + '-gjelderAlleBarn'}
              onChange={(e: string) => setGjelderAlleBarn(e as JaNei)}
            >
              <FlexRadioPanels>
                <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        {vedtak?.gjelderAlleBarn === 'nei' && (
          <div>
            <div dangerouslySetInnerHTML={{ __html: t('label:avhuk-de-barn-vedtaket') + ':' }} />
            <VerticalSeparatorDiv />
            {(replySed as F002Sed)?.barn?.map((b) => {
              const vedtakBarn: VedtakBarn = {
                fornavn: b.personInfo.fornavn,
                etternavn: b.personInfo.etternavn,
                foedselsdato: b.personInfo.foedselsdato
              }
              const checked: boolean = _.find(vedtak?.barnVedtaketOmfatter, vb => _.isEqual(vb, vedtakBarn)) !== undefined
              return (
                <div
                  key={`${vedtakBarn.fornavn}-${vedtakBarn.etternavn}-${vedtakBarn.foedselsdato}`}
                >
                  <Checkbox
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckBarn(vedtakBarn, e.target.checked)}
                  >
                    {vedtakBarn.fornavn + ' ' + (vedtakBarn.etternavn ?? '') + ' (' + vedtakBarn.foedselsdato + ')'}
                  </Checkbox>
                  <VerticalSeparatorDiv size='0.5' />
                </div>
              )
            })}
          </div>
        )}
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <Select
              data-testid={namespace + '-vedtakstype'}
              error={validation[namespace + '-vedtakstype']?.feilmelding}
              id={namespace + '-vedtakstype'}
              label={t('label:vedtak-type')}
              menuPortalTarget={document.body}
              onChange={(e: unknown) => setVedtakstype((e as Option).value)}
              options={vedtaksTypeOptions}
              required
              defaultValue={_.find(vedtaksTypeOptions, v => v.value === vedtak?.vedtakstype)}
              value={_.find(vedtaksTypeOptions, v => v.value === vedtak?.vedtakstype)}
            />
          </Column>
          <Column>
            <DateField
              error={validation[namespace + '-vedtaksdato']?.feilmelding}
              namespace={namespace}
              id='vedtaksdato'
              label={t('label:vedtaksdato')}
              onChanged={setVedtaksdato}
              required
              dateValue={vedtak?.vedtaksdato}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-begrunnelse']?.feilmelding}
                namespace={namespace}
                id='grunnen'
                label={t('label:begrunnelse')}
                onChanged={setBegrunnelse}
                value={vedtak?.begrunnelse}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-ytterligereInfo']?.feilmelding}
                namespace={namespace}
                id='ytterligereInfo'
                label={t('label:ytterligere-informasjon-til-sed')}
                onChanged={setYtterligeInfo}
                value={vedtak?.ytterligereInfo}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <Heading size='small'>
          {t('label:vedtaksperioder')}
        </Heading>
      </PaddedDiv>
      {_.isEmpty(vedtak?.vedtaksperioder)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : vedtak?.vedtaksperioder?.map(renderVedtakPeriodeRow)}
      <VerticalSeparatorDiv />
      {_newVedtakPeriodeForm
        ? renderVedtakPeriodeRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewVedtakPeriodeForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:vedtaksperiode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <Heading size='small'>
          {t('label:type-kompetanse')}
        </Heading>
      </PaddedDiv>
      {!_.isEmpty(_allKompetansePeriods) && (
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
      <VerticalSeparatorDiv />
      {_.isEmpty(_allKompetansePeriods)
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
            ? _allKompetansePeriods?.map(renderKompetansePeriodeRow)
            : (
              <>
                {['primaerkompetanseArt58', 'sekundaerkompetanseArt58', 'primaerkompetanseArt68', 'sekundaerkompetanseArt68'].map(kompetanseType => {
                  const perioder: Array<KompetansePeriode> | undefined | null = _.get(vedtak, kompetanseType)
                  return (
                    <div key={kompetanseType}>
                      {!_.isEmpty(perioder) && (
                        <PaddedDiv>
                          <Label>{_.find(kompetanseTypeOptions, v => v.value === kompetanseType)?.label}</Label>
                        </PaddedDiv>
                      )}
                      {perioder?.map((p: KompetansePeriode, i: number) =>
                        ({ ...p, periode: { ...p.periode, __type: kompetanseType, __index: i } })
                      ).sort(periodePeriodeSort)
                        .map(renderKompetansePeriodeRow)}
                    </div>
                  )
                })}
              </>
              ))}
      <VerticalSeparatorDiv />
      {_newKompetansePeriodeForm
        ? renderKompetansePeriodeRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => {_setNewKompetansePeriodeForm(true); setShowSkalYtelseUtbetales(false)}}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default VedtakFC
