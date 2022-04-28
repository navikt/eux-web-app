import { Periode, PeriodeMedForsikring, PlanItemType } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { arbeidsperioderFraAAToPeriodeMedForsikring } from './arbeidsperioder'

export interface PlanItem<T> {
  type: PlanItemType
  item: T,
  index: number | undefined // for periode index, also tells when we macth arbeidsgiver with periode
  duplicate: boolean | undefined // so I can complain when addedArbeidsgiver conflict with existing ones

}
type Plan<T> = Array<PlanItem<T>>

export interface RenderPlanProps<T> {
  perioder: Array<T> | undefined
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  addedArbeidsperioder: Array<PeriodeMedForsikring>
}

/**
 The purpose of this function is to sort:
 1. arbeidsperioder that came from AA Registrert
 2. arbeidsperioder that were added on the web page
 3. perioder that are not matched by any of the arbeidsperioder

 and render all of them chronologically by startdato.

 This function outputs a render plan,  which is an array where I tell the parent component
 what is the correct order of items that should be rendered, and with what component.
*/

// T is either Periode (for Ansatt) or PeriodeMedForsikring (for ArbeidsforholdMedForsikring)
export default <T extends Periode | PeriodeMedForsikring>({
  perioder,
  arbeidsperioder,
  addedArbeidsperioder
}: RenderPlanProps<T>): Plan<T> => {
  const getStartDato = (periode: T): string => (
    Object.prototype.hasOwnProperty.call(periode, 'periode')
      ? (periode as unknown as PeriodeMedForsikring).startdato
      : (periode as unknown as Periode).startdato
  )

  const getSluttDato = (periode: T): string | undefined => (
    Object.prototype.hasOwnProperty.call(periode, 'periode')
      ? (periode as unknown as PeriodeMedForsikring).sluttdato
      : (periode as unknown as Periode).sluttdato
  )

  const unmatchedArbeidsgiver: Plan<T> = []
  const unmatchedAddedArbeidsgiver: Plan<T> = []

  // 1st step: add all existing periodes into plan

  let plan: Plan<T> = perioder?.map((periode: T, index: number) => ({
    item: periode,
    type: 'periode',
    selected: undefined,
    duplicate: undefined,
    index
  })) || []

  // 2nd step: go through all arbeidsperioder. If they match periods, pair then, otherwise just append them in the end

  arbeidsperioder?.arbeidsperioder?.forEach((arbeidsgiver: ArbeidsperiodeFraAA) => {
    const arbeidsgiverAsPeriodeMedForsikring: PeriodeMedForsikring = arbeidsperioderFraAAToPeriodeMedForsikring(arbeidsgiver)

    const foundIndex: number = _.findIndex(plan, p =>
      getStartDato(p.item as T) === arbeidsgiverAsPeriodeMedForsikring.startdato &&
      getSluttDato(p.item as T) === arbeidsgiverAsPeriodeMedForsikring.sluttdato
    )

    if (foundIndex >= 0) {
      const isPeriode = !_.isEmpty((plan[foundIndex].item as unknown as Periode)?.startdato)

      // if the original item is a Periode, then replace it with the found PeriodeMedForsikring
      // if the original item is a PeriodeMedForsikring, keep it
      // by having an index, it is marked as selected
      plan[foundIndex] = {
        item: isPeriode ? arbeidsgiverAsPeriodeMedForsikring as T : plan[foundIndex].item,
        type: 'arbeidsperiode',
        duplicate: false,
        index: foundIndex
      }
    } else {
      unmatchedArbeidsgiver.push({
        item: arbeidsgiverAsPeriodeMedForsikring as T,
        type: 'arbeidsperiode',
        duplicate: false,
        index: undefined
      })
    }
  })
  plan = plan.concat(unmatchedArbeidsgiver)

  // 3nd step: same as step 2, but with addedArbeidsperioder (which are PeriodeMedForsikring),
  // and match against existing periods and existing periodeMedForsikring.

  addedArbeidsperioder?.forEach((arbeidsgiver: PeriodeMedForsikring) => {
    const foundPeriodeIndex: number = _.findIndex(plan, (item: PlanItem<T>) => {
      return item.type === 'periode'
        ? getStartDato(item.item as T) === arbeidsgiver.startdato && getSluttDato(item.item as T) === arbeidsgiver.sluttdato
        : false // only match Periods
    })
    const foundArbeidsgiver: boolean = _.find(plan, (item: PlanItem<T>) => {
      return item.type === 'arbeidsperiode'
        ? (item.item as PeriodeMedForsikring).startdato === arbeidsgiver.startdato && (item.item as PeriodeMedForsikring).sluttdato === arbeidsgiver.sluttdato
        : false // only match PeriodeMedForsikring
    }) !== undefined

    if (foundPeriodeIndex >= 0) {
      plan[foundPeriodeIndex] = {
        item: arbeidsgiver as T,
        type: 'addedArbeidsperiode',
        duplicate: false,
        index: foundPeriodeIndex
      }
    } else {
      unmatchedAddedArbeidsgiver.push({
        item: arbeidsgiver as T,
        type: 'addedArbeidsperiode',
        duplicate: foundArbeidsgiver,
        index: undefined
      })
    }
  })

  plan = plan.concat(unmatchedAddedArbeidsgiver)

  // 4th step: sort all by startdato

  return plan?.sort((a: PlanItem<T>, b: PlanItem<T>) =>
    moment(getStartDato(a.item), 'YYYY-MM-DD').isSameOrBefore(moment(getStartDato(b.item), 'YYYY-MM-DD')) ? -1 : 1
  )
}
