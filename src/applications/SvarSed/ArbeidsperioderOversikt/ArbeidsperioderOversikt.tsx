import { AddCircle, Office1 } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Ingress, Label } from '@navikt/ds-react'
import { FlexCenterSpacedDiv, PaddedDiv, PaddedHorizontallyDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { fetchInntekt } from 'actions/inntekt'
import { resetValidation, setValidation } from 'actions/validation'
import InntektSearch from 'applications/SvarSed/InntektSearch/InntektSearch'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import ForsikringPeriodeBox from 'components/ForsikringPeriodeBox/ForsikringPeriodeBox'
import Inntekt from 'components/Inntekt/Inntekt'
import { SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {ForsikringPeriode, Periode, PeriodeMedForsikring, PeriodeSort, PeriodeView} from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA, IInntekter, Validation } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, {useEffect, useRef, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import makeRenderPlan, { PlanItem, RenderPlanProps } from 'utils/renderPlan'
import { periodeSort } from 'utils/sort'
import {
  validateArbeidsperiodeOversikt,
  validateArbeidsperioderOversikt,
  ValidationArbeidsperiodeOversiktProps,
  ValidationArbeidsperioderOversiktProps
} from './validation'
import moment from "moment";

export interface ArbeidsforholdSelector extends MainFormSelector {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  gettingInntekter: boolean
  inntekter: IInntekter | null | undefined
}

const mapState = (state: State): ArbeidsforholdSelector => ({
  arbeidsperioder: state.arbeidsperioder,
  gettingInntekter: state.loading.gettingInntekter,
  inntekter: state.inntekt.inntekter,
  validation: state.validation.status
})

const ArbeidsperioderOversikt: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    arbeidsperioder,
    gettingInntekter,
    inntekter,
    validation
  } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-${personID}-arbeidsperioder`
  const target = 'perioderAnsattMedForsikring'
  const perioder: Array<PeriodeMedForsikring> | undefined = _.get(replySed, target)
  const anmodningsperiode: Periode = _.get(replySed, "anmodningsperiode")
  const fnr = getFnr(replySed, personID)
  const getId = (p: PlanItem<ForsikringPeriode> | null | undefined, index: number) => p
    ? p.type + '-' + ((p.item as PeriodeMedForsikring)?.arbeidsgiver?.navn ?? '') + '-' + p.item.startdato + '-' + (p.item.sluttdato ?? '') + "_" + index
    : 'new' + "_" + index

  const [_plan, _setPlan] = useState<Array<PlanItem<ForsikringPeriode>> | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_sort, _setSort] = useState<PeriodeSort>('time')
  const [_view, _setView] = useState<PeriodeView>('all')
  const [_copiedPeriod, _setCopiedPeriod] = useState<PlanItem<ForsikringPeriode> | null>(null)

  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if(_copiedPeriod){
      ref.current?.scrollIntoView({behavior: 'smooth'});
    }
  }, [_copiedPeriod])

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationArbeidsperioderOversiktProps>(
      clonedvalidation, namespace, validateArbeidsperioderOversikt, {
        perioderMedForsikring: perioder,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    const spikedPeriods: Array<ForsikringPeriode> | undefined = perioder?.map((p, index) => ({ ...p, __index: index }))
    const plan: Array<PlanItem<ForsikringPeriode>> = makeRenderPlan<ForsikringPeriode>({
      perioder: spikedPeriods,
      arbeidsperioder,
      sort: _sort
    } as RenderPlanProps<ForsikringPeriode>)
    _setPlan(plan)
  }, [replySed, _sort, arbeidsperioder])

  const onCloseEdit = (namespace: string) => {
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewForm(false)
  }

  const onSaveEdit = (editForsikringPeriode: PeriodeMedForsikring, editIndex: number) => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationArbeidsperiodeOversiktProps>(
      clonedvalidation, namespace, validateArbeidsperiodeOversikt, {
        forsikringPeriode: editForsikringPeriode,
        index: editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${editIndex}]`, editForsikringPeriode))
      onCloseEdit(namespace + getIdx(editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removed: ForsikringPeriode) => {
    const index: number | undefined = removed.__index
    if (index !== undefined && index >= 0) {
      const newPerioder = _.cloneDeep(perioder) as Array<ForsikringPeriode>
      newPerioder.splice(index, 1)
      dispatch(updateReplySed(target, newPerioder))
      standardLogger('svarsed.editor.periode.remove', { type: 'perioderAnsattMedForsikring' })
    }
  }

  const onAddNew = (newForsikringPeriode?: ForsikringPeriode) => {
    _setCopiedPeriod(null)
    let newPerioderMedforsikring: Array<ForsikringPeriode> | undefined = _.cloneDeep(perioder)
    if (_.isNil(newPerioderMedforsikring)) {
      newPerioderMedforsikring = []
    }
    if (newForsikringPeriode) {
      delete newForsikringPeriode.__index
      delete newForsikringPeriode.__type
      newPerioderMedforsikring.push(newForsikringPeriode)
      newPerioderMedforsikring = newPerioderMedforsikring.sort(periodeSort)
      dispatch(updateReplySed(target, newPerioderMedforsikring))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderAnsattMedForsikring' })
      onCloseNew()
    }
  }

  const onArbeidsgiverSelect = (periode: ForsikringPeriode, checked: boolean) => {
    if (checked) {
      onAddNew(periode as ForsikringPeriode)
    } else {
      onRemove(periode as ForsikringPeriode)
    }
  }

  const onArbeidsgiverEdit = (newArbeidsgiver: PeriodeMedForsikring) => {
    if (!_.isNil(newArbeidsgiver.__index) && (newArbeidsgiver.__index) >= 0) {
      onSaveEdit(newArbeidsgiver, newArbeidsgiver.__index)
    }
    // this is the index of this arbeidsgiver in the arbeidsperioder?.arbeidsperioder list
    // it is stored in __type, as the __index is already busy with the one above
    // if it is undefined, then this ArbeidsperiodeOversikt is not paired to a arbeidsperioder?.arbeidsperioder
    const changedArbeidsgiverIndex: number = parseInt(newArbeidsgiver.__type!)

    if (!_.isNil(changedArbeidsgiverIndex) && changedArbeidsgiverIndex >= 0) {
      const newArbeidsperioder: Array<ArbeidsperiodeFraAA> | undefined = _.cloneDeep(arbeidsperioder?.arbeidsperioder) as Array<ArbeidsperiodeFraAA>
      newArbeidsperioder[changedArbeidsgiverIndex].fraDato = newArbeidsgiver.startdato
      newArbeidsperioder[changedArbeidsgiverIndex].tilDato = newArbeidsgiver.sluttdato
      newArbeidsperioder[changedArbeidsgiverIndex].arbeidsgiversNavn = newArbeidsgiver.arbeidsgiver.navn
      dispatch(updateArbeidsperioder({
        ...arbeidsperioder,
        arbeidsperioder: newArbeidsperioder
      }))
    }
  }

  const doResetValidation = (namespace: string) => dispatch(resetValidation(namespace))
  const doSetValidation = (validation: Validation) => dispatch(setValidation(validation))

  const renderPlan = (item: PlanItem<ForsikringPeriode>, index: number, previousItem: PlanItem<ForsikringPeriode> | undefined) => {
    return (
      <div key={getId(item, index)}>
        {_sort === 'group' && (previousItem === undefined || previousItem.type !== item.type) && (
          <>
            <PaddedHorizontallyDiv>
              <Label>{t('label:' + item.type)}</Label>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv />
          </>
        )}
        {renderPlanItem(item, index)}
        <VerticalSeparatorDiv />
      </div>
    )
  }

  const renderPlanItem = (item: PlanItem<ForsikringPeriode> | null, index: number) => {
    const newMode = index < 0 && _.isNil(_copiedPeriod)
    const copyMode = index < 0 && !_.isNil(_copiedPeriod)

    const _item: PeriodeMedForsikring | PlanItem<ForsikringPeriode> | null = newMode ? null : item?.item ? item?.item as PeriodeMedForsikring : item
    
    const selectable = item?.type === 'forsikringPeriode'
    const selected = selectable && !_.isNil(index) && index >= 0
    const style = newMode
      ? 'new'
      : item?.type === 'periode' || selected
        ? 'original'
        : ''
    if (item?.type === 'periode') {
      (_item as PeriodeMedForsikring).extra = { fraSed: 'ja' }
    }
    if (item?.type === 'forsikringPeriode' && !selected && _view === 'periods') {
      return null
    }
    const allowEdit = item?.type === 'periode' || selected
    const allowDelete = item?.type === 'periode'
    const _validation = item?.type === 'forsikringPeriode' && _.isNil(index) ? {} : validation

    return (
      <>
        {copyMode && <div ref={ref}></div>}
        <ForsikringPeriodeBox
          key={_item ? (_item as PeriodeMedForsikring).__type + "" + index : "newPeriod" + "_" + index}
          forsikringPeriode={_item as PeriodeMedForsikring}
          editable='full'
          allowEdit={allowEdit}
          allowDelete={allowDelete}
          selectable={selectable}
          newMode={newMode || copyMode}
          style={style}
          showArbeidsgiver
          showAddress
          onForsikringPeriodeSelect={onArbeidsgiverSelect}
          onForsikringPeriodeEdit={onArbeidsgiverEdit}
          onForsikringPeriodeNew={onAddNew}
          onForsikringPeriodeNewClose={onCloseNew}
          onForsikringPeriodeDelete={onRemove}
          namespace={namespace}
          icon={<Office1 width='20' height='20' />}
          validation={_validation}
          resetValidation={doResetValidation}
          setValidation={doSetValidation}
          setCopiedPeriod={_setCopiedPeriod}
       />
      </>
    )
  }

  return (
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
        amplitude='svarsed.editor.arbeidsforholdmedforsikring.arbeidsgiver.search'
        fnr={fnr}
        namespace={namespace}
        defaultDates={{
          "startDato": anmodningsperiode.startdato ? moment(anmodningsperiode.startdato).format('YYYY-MM') : null,
          "sluttDato": anmodningsperiode.sluttdato ? moment(anmodningsperiode.sluttdato).format('YYYY-MM') : null,
        }}
      />
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(_plan)
        ? (
          <>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods-med-forsikring')}
            </BodyLong>
            <SpacedHr />
          </>
          )
        : (
          <>
            <FlexCenterSpacedDiv>
              <Checkbox
                checked={_sort === 'group'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
              >
                {t('label:group-by-type')}
              </Checkbox>
              <Checkbox
                checked={_view === 'periods'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setView(e.target.checked ? 'periods' : 'all')}
              >
                {t('label:se-kun-perioder')}
              </Checkbox>
            </FlexCenterSpacedDiv>

            <VerticalSeparatorDiv />
            {_plan?.map((item, index) => renderPlan(item, index, (index > 0 ? _plan![index - 1] : undefined)))}
          </>
          )}
      <VerticalSeparatorDiv />
      {_copiedPeriod && renderPlanItem(_copiedPeriod, -1)}
      {_newForm
        ? renderPlanItem(null, -1)
        : (
          <Button
            variant='tertiary'
            onClick={() => _setNewForm(true)}
          >
            <AddCircle />
            {t('el:button-add-new-x', { x: t('label:arbeidperioder').toLowerCase() })}
          </Button>
          )}
      <VerticalSeparatorDiv />
      <Ingress>
        {t('label:hent-inntekt-i-A-inntekt')}
      </Ingress>
      <VerticalSeparatorDiv />
      <InntektSearch
        amplitude='svarsed.editor.inntekt.search'
        fnr={fnr!}
        onInntektSearch={onInntektSearch}
        gettingInntekter={gettingInntekter}
        defaultDates={{
          "startDato": anmodningsperiode.startdato ? moment(anmodningsperiode.startdato).format('YYYY-MM') : null,
          "sluttDato": anmodningsperiode.sluttdato ? moment(anmodningsperiode.sluttdato).format('YYYY-MM') : null,
        }}
      />
      <VerticalSeparatorDiv />
      {inntekter && <Inntekt inntekter={inntekter} />}
    </PaddedDiv>

  )
}

export default ArbeidsperioderOversikt
