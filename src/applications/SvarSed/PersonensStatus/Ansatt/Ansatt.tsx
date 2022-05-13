import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Ingress, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import ArbeidsperioderBox from 'components/Arbeidsperioder/ArbeidsperioderBox'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { ErrorElement } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { Periode, PeriodeMedForsikring, PeriodeSort } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA, Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import makeRenderPlan, { PlanItem, RenderPlanProps } from 'utils/renderPlan'
import { periodeSort } from 'utils/sort'
import { hasNamespace } from 'utils/validation'
import { validateAnsattPeriode, ValidationAnsattPeriodeProps } from './validation'

interface AnsattSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined,
}

const mapState = (state: State): AnsattSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  validation: state.validation.status
})

const Ansatt: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { arbeidsperioder, validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ansatt`
  const target = `${personID}.perioderSomAnsatt`
  const perioderSomAnsatt: Array<Periode> | undefined = _.get(replySed, target)
  const includeAddress = false
  const fnr = getFnr(replySed, personID)
  const getId = (item: PlanItem<Periode | PeriodeMedForsikring> | null): string => (item
    ? item.type + '-' + (item.item as Periode | PeriodeMedForsikring)?.startdato + '-' + (item.item as Periode | PeriodeMedForsikring).sluttdato
    : 'new')

  const [_plan, _setPlan] = useState<Array<PlanItem<Periode>> | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAnsattPeriodeProps>(validateAnsattPeriode, namespace)

  const [_sort, _setSort] = useState<PeriodeSort>('time')

  useEffect(() => {
    const spikedPeriods: Array<Periode> | undefined = perioderSomAnsatt?.map((p, index) => ({ ...p, __index: index }))
    const plan: Array<PlanItem<Periode>> = makeRenderPlan<Periode>({
      perioder: spikedPeriods,
      arbeidsperioder,
      addedArbeidsperioder: [],
      sort: _sort
    } as RenderPlanProps<Periode>)
    _setPlan(plan)
  }, [replySed, _sort, arbeidsperioder])

  const onPeriodeChanged = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
      return
    }
    _setEditPeriode(periode)
    if (hasNamespace(validation, namespace + getIdx(index))) {
      dispatch(resetValidation(namespace + getIdx(index)))
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

  const onStartEdit = (p: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriode(p)
    _setEditIndex(index)
  }

  const onSaveEdit = (editPeriode ?: Periode, editIndex ?: number) => {
    // if editPeriode is not null, it comes from arbeidsgiver; if not, from existing typed periode
    const __editPeriode = !_.isUndefined(editPeriode) ? editPeriode : _editPeriode
    const __editIndex = !_.isUndefined(editIndex) ? editIndex : _editIndex

    const [valid, newValidation] = performValidation<ValidationAnsattPeriodeProps>(
      validation, namespace, validateAnsattPeriode, {
        periode: __editPeriode,
        perioder: perioderSomAnsatt,
        index: __editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${__editIndex}]`, __editPeriode))
      onCloseEdit(namespace + getIdx(__editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (deletedPeriode: Periode) => {
    const index: number | undefined = deletedPeriode.__index
    if (index !== undefined && index >= 0) {
      const newPerioder = _.cloneDeep(perioderSomAnsatt) as Array<Periode>
      newPerioder.splice(index, 1)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.remove', { type: 'perioderSomAnsatt' })
    }
  }

  const onAddNew = (newPeriode?: Periode) => {
    // if newPeriode is not null, it comes from arbeidsgiver; if not, from newly typed periode

    const __newPeriode = !_.isUndefined(newPeriode) ? newPeriode : _newPeriode
    const valid: boolean = _performValidation({
      periode: __newPeriode,
      perioder: perioderSomAnsatt,
      personName
    })

    if (!!__newPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderSomAnsatt)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      delete __newPeriode.__index
      delete __newPeriode.__type
      newPerioder.push(__newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderSomAnsatt' })
      onCloseNew()
    }
  }

  const onRemoveFromArbeidsgiver = (deletedArbeidsgiver: PeriodeMedForsikring) => {
    onRemove(deletedArbeidsgiver)
  }

  const onAddNewFromArbeidsgiver = (selectedArbeidsgiver: PeriodeMedForsikring) => {
    const newPeriode = selectedArbeidsgiver.sluttdato
      ? {
          startdato: selectedArbeidsgiver.startdato,
          sluttdato: selectedArbeidsgiver.sluttdato
        }
      : {
          startdato: selectedArbeidsgiver.startdato,
          aapenPeriodeType: selectedArbeidsgiver.aapenPeriodeType
        }
    onAddNew(newPeriode)
  }

  const onArbeidsgiverSelect = (arbeidsgiver: PeriodeMedForsikring, checked: boolean) => {
    if (checked) {
      onAddNewFromArbeidsgiver(arbeidsgiver)
    } else {
      onRemoveFromArbeidsgiver(arbeidsgiver)
    }
  }

  const onArbeidsgiverEdit = (newArbeidsgiver: PeriodeMedForsikring, oldArbeidsgiver: PeriodeMedForsikring, selected: boolean) => {
    // if selected, let's find the same period.
    let selectedIndex: number | undefined
    if (selected) {
      selectedIndex = _.findIndex(perioderSomAnsatt, p => p.startdato === oldArbeidsgiver.startdato && p.sluttdato === oldArbeidsgiver.sluttdato)
    }

    if (selected && selectedIndex !== undefined && selectedIndex >= 0) {
      onSaveEdit({
        startdato: newArbeidsgiver.startdato,
        sluttdato: newArbeidsgiver.sluttdato,
        aapenPeriodeType: newArbeidsgiver.aapenPeriodeType
      }, selectedIndex)
    }

    // this is the index of this arbeidsgiver in the arbeidsperioder?.arbeidsperioder list
    // it is stored in __type, as the __index is already busy with the one above
    const changedArbeidsgiverIndex: number = newArbeidsgiver.__type!

    const newArbeidsperioder: Array<ArbeidsperiodeFraAA> | undefined = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<ArbeidsperiodeFraAA>
    newArbeidsperioder[changedArbeidsgiverIndex].fraDato = newArbeidsgiver.startdato
    newArbeidsperioder[changedArbeidsgiverIndex].tilDato = newArbeidsgiver.sluttdato
    dispatch(updateArbeidsperioder({
      ...arbeidsperioder,
      arbeidsperioder: newArbeidsperioder
    }))
  }

  const renderPlan = (item: PlanItem<Periode | PeriodeMedForsikring>, index: number, previousItem: PlanItem<Periode | PeriodeMedForsikring> | undefined) => {
    return (
      <div key={getId(item)}>
        {_sort === 'group' && (previousItem === undefined || previousItem.type !== item.type) && (
          <PaddedHorizontallyDiv>
            <Label>{t('label:' + item.type)}</Label>
          </PaddedHorizontallyDiv>
        )}
        {renderPlanItem(item)}
        <VerticalSeparatorDiv />
      </div>
    )
  }

  const renderPlanItem = (item: PlanItem<Periode | PeriodeMedForsikring> | null) => {
    if (item === null) {
      return renderRowPeriode(null)
    }
    if (item.type === 'periode') {
      return renderRowPeriode(item.item as Periode)
    }
    if (item.type === 'arbeidsperiode') {
      return renderRowArbeidsperiode(item.item as PeriodeMedForsikring)
    }
  }

  const renderRowArbeidsperiode = (a: PeriodeMedForsikring) => {
    const index: number = a ? a.__index! : -1
    return (
      <Column>
        <ArbeidsperioderBox
          periodeMedForsikring={a}
          editable='only_period'
          includeAddress={includeAddress}
          selected={!_.isNil(index) && index >= 0}
          onPeriodeMedForsikringSelect={onArbeidsgiverSelect}
          onPeriodeMedForsikringEdit={onArbeidsgiverEdit}
          namespace={namespace}
        />
      </Column>
    )
  }

  const renderRowPeriode = (p: Periode | null) => {
    const index: number = p ? p.__index! : -1
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : p)

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        className={classNames({
          new: index < 0,
          error: hasNamespace(_v, _namespace)
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
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding,
                  aapenPeriodeType: _v[_namespace + '-aapenPeriodeType']?.feilmelding
                }}
                hideLabel={false}
                setPeriode={(p: Periode) => onPeriodeChanged(p, index!)}
                value={_periode}
              />
              )
            : (
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-startdato'],
                  sluttdato: _v[_namespace + '-sluttdato']
                }}
                periode={_periode}
              />
              )}
          <AlignEndColumn>
            <AddRemovePanel2<Periode>
              item={p}
              marginTop={inEditMode}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={() => onAddNew()}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={() => onCloseEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:oversikt-brukers-arbeidsperioder')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <Ingress>
          {t('label:hent-perioder-fra-aa-registeret-og-a-inntekt')}
        </Ingress>
        <VerticalSeparatorDiv />
        <ArbeidsperioderSøk
          amplitude='svarsed.editor.personensstatus.ansatt.arbeidsgiver.search'
          fnr={fnr}
          fillOutFnr={() => {
            document.dispatchEvent(new CustomEvent('feillenke', {
              detail: {
                skjemaelementId: `MainForm-${personID}-personopplysninger-norskpin-nummer`,
                feilmelding: ''
              } as ErrorElement
            }))
          }}
          namespace={namespace}
        />
      </PaddedDiv>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(_plan)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <Checkbox
                checked={_sort === 'group'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
              >
                {t('label:group-by-type')}
              </Checkbox>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv />
            {_plan?.map((item, index) => renderPlan(item, index, (index > 0 ? _plan![index - 1] : undefined)))}
          </>
          )}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderPlanItem(null)
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

export default Ansatt
