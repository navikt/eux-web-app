import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Ingress, Label } from '@navikt/ds-react'
import {
  Column,
  FlexCenterSpacedDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { updateArbeidsperioder } from 'actions/arbeidsperioder'
import { fetchInntekt } from 'actions/inntekt'
import { resetValidation, setValidation } from 'actions/validation'
import InntektSearch from 'applications/SvarSed/InntektSearch/InntektSearch'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import ForsikringPeriodeBox from 'components/ForsikringPeriodeBox/ForsikringPeriodeBox'
import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import Inntekt from 'components/Inntekt/Inntekt'
import { SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ForsikringPeriode, PeriodeSort, PeriodeView, PeriodeMedForsikring } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA, IInntekter } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
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
import {
  validateArbeidsperioderOversikt,
  validateArbeidsperiodeOversikt,
  ValidationArbeidsperioderOversiktProps,
  ValidationArbeidsperiodeOversiktProps
} from './validation'

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
  const showAddress = true
  const fnr = getFnr(replySed, personID)
  const getId = (p: PlanItem<ForsikringPeriode> | null | undefined) => p
    ? p.type + '-' + ((p.item as PeriodeMedForsikring)?.arbeidsgiver?.navn ?? '') + '-' + p.item.startdato + '-' + (p.item.sluttdato ?? '')
    : 'new'

  const [_plan, _setPlan] = useState<Array<PlanItem<ForsikringPeriode>> | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_sort, _setSort] = useState<PeriodeSort>('time')
  const [_view, _setView] = useState<PeriodeView>('all')

  const onInntektSearch = (fnr: string, fom: string, tom: string, inntektsliste: string) => {
    dispatch(fetchInntekt(fnr, fom, tom, inntektsliste))
  }

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationArbeidsperioderOversiktProps>(
      validation, namespace, validateArbeidsperioderOversikt, {
        perioderMedForsikring: perioder,
        personName
      }
    )
    dispatch(setValidation(newValidation))
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
    const [valid, newValidation] = performValidation<ValidationArbeidsperiodeOversiktProps>(
      validation, namespace, validateArbeidsperiodeOversikt, {
        forsikringPeriode: editForsikringPeriode,
        index: editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${editIndex}]`, editForsikringPeriode))
      onCloseEdit(namespace + getIdx(editIndex))
    } else {
      dispatch(setValidation(newValidation))
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

  const renderPlan = (item: PlanItem<ForsikringPeriode>, index: number, previousItem: PlanItem<ForsikringPeriode> | undefined) => {
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

  const renderPlanItem = (item: PlanItem<ForsikringPeriode> | null) => {
    if (item === null) {
      return (
        <Column>
          <ForsikringPeriodeBox
            forsikringPeriode={null}
            editable='full'
            selectable={false}
            newMode
            style='new'
            showAddress={showAddress}
            onForsikringPeriodeSelect={onArbeidsgiverSelect}
            onForsikringPeriodeNew={onAddNew}
            onForsikringPeriodeNewClose={onCloseNew}
            namespace={namespace}
          />
        </Column>
      )
    }
    if (item.type === 'periode') {
      (item.item as PeriodeMedForsikring).extra = { fraSed: 'ja' }
      return (
        <Column>
          <ForsikringPeriodeBox<PeriodeMedForsikring>
            forsikringPeriode={item.item as PeriodeMedForsikring}
            editable='full'
            selectable={false}
            style='original'
            showAddress={showAddress}
            onForsikringPeriodeSelect={onArbeidsgiverSelect}
            onForsikringPeriodeEdit={onArbeidsgiverEdit}
            namespace={namespace}
          />
        </Column>
      )
    }
    if (item.type === 'forsikringPeriode') {
      const index: number = item.item ? item.item.__index! : -1
      if (_view === 'all') {
        return (
          <Column>
            <ForsikringPeriodeBox<PeriodeMedForsikring>
              forsikringPeriode={item.item as PeriodeMedForsikring}
              editable='full'
              showAddress={showAddress}
              onForsikringPeriodeSelect={onArbeidsgiverSelect}
              onForsikringPeriodeEdit={onArbeidsgiverEdit}
              namespace={namespace}
            />
          </Column>
        )
      }
      if (!_.isNil(index) && index >= 0) {
        return (
          <Column>
            <ForsikringPeriodeBox
              forsikringPeriode={item.item as PeriodeMedForsikring}
              editable='full'
              selectable={false}
              style='original'
              showAddress={showAddress}
              onForsikringPeriodeSelect={onArbeidsgiverSelect}
              onForsikringPeriodeEdit={onArbeidsgiverEdit}
              namespace={namespace}
            />
          </Column>
        )
      }
      return null
    }
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
          amplitude='svarsed.editor.arbeidsforholdmedforsikring.arbeidsgiver.search'
          fnr={fnr}
          namespace={namespace}
        />
      </PaddedDiv>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(_plan)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods-med-forsikring')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
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
              {t('el:button-add-new-x', { x: t('label:arbeidperioder').toLowerCase() })}
            </Button>
          </PaddedDiv>
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
      />
      <VerticalSeparatorDiv />
      {inntekter && <Inntekt inntekter={inntekter} />}
    </>
  )
}

export default ArbeidsperioderOversikt
