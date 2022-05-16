import { Periode, PeriodeMedForsikring, PlanItemType } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { arbeidsperioderFraAAToPeriodeMedForsikring } from './arbeidsperioder'

export interface PlanItem<T> {
  type: PlanItemType
  item: T,
  duplicate: boolean | undefined // so I can complain when addedArbeidsgiver conflict with existing ones
}

export interface RenderPlanProps<T> {
  perioder: Array<T> | undefined
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  sort?: 'time' | 'group'
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
const renderPlan = <T extends Periode | PeriodeMedForsikring>({
  perioder,
  arbeidsperioder,
  sort = 'time'
}: RenderPlanProps<T>): Array<PlanItem<T>> => {
  const unmatchedArbeidsgiver: Array<PlanItem<T>> = []

  // 1st step: add all existing periodes into plan

  let plan: Array<PlanItem<T>> = perioder?.map((periode: T) => ({
    item: periode as T,
    type: 'periode',
    duplicate: undefined
  } as PlanItem<T>)) || []

  // 2nd step: go through all arbeidsperioder. If they match periods, pair then, otherwise just append them in the end

  arbeidsperioder?.arbeidsperioder?.forEach((arbeidsgiver: ArbeidsperiodeFraAA, arbeidsperioderIndex: number) => {
    const arbeidsgiverAsPeriodeMedForsikring: PeriodeMedForsikring = arbeidsperioderFraAAToPeriodeMedForsikring(arbeidsgiver)

    const foundPlanIndex: number = _.findIndex(plan, p =>
      p.item.startdato === arbeidsgiverAsPeriodeMedForsikring.startdato &&
      p.item.sluttdato === arbeidsgiverAsPeriodeMedForsikring.sluttdato
    )

    if (foundPlanIndex >= 0) {
      // backup the periode's index in replySed, use it to keep track of what is the real index of period in replySed
      const periodeIndex = (plan[foundPlanIndex].item as Periode).__index

      // by having an index in the period, it is marked as selected
      // set also _type as the index for this  arbeidsgiverAsPeriodeMedForsikring in the arbeidsperioder?.arbeidsperioder list
      plan[foundPlanIndex] = {
        item: {
          ...(arbeidsgiverAsPeriodeMedForsikring as T),
          __index: periodeIndex,
          __type: '' + arbeidsperioderIndex
        },
        type: 'arbeidsperiode',
        duplicate: false
      } as PlanItem<T>
    } else {
      unmatchedArbeidsgiver.push({
        item: {
          ...arbeidsgiverAsPeriodeMedForsikring as T,
          __type: '' + arbeidsperioderIndex
        },
        type: 'arbeidsperiode',
        duplicate: false
      })
    }
  })

  plan = plan.concat(unmatchedArbeidsgiver)

  // 3rd step: sort all by startdato
  if (sort === 'time') {
    plan = plan.sort((a: PlanItem<T>, b: PlanItem<T>) =>
      moment((a.item as T)!.startdato, 'YYYY-MM-DD').isSameOrBefore(moment((b.item as T)!.startdato, 'YYYY-MM-DD')) ? -1 : 1
    )
  }
  if (sort === 'group') {
    plan = plan.sort((a: PlanItem<T>, b: PlanItem<T>) => {
      const typeOrder = ['periode', 'arbeidsperiode', 'addedArbeidsperiode']
      if (typeOrder.indexOf(a.type) !== typeOrder.indexOf(b.type)) {
        return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
      }
      return moment((a.item as T)!.startdato, 'YYYY-MM-DD').isSameOrBefore(moment((b.item as T)!.startdato, 'YYYY-MM-DD')) ? -1 : 1
    })
  }

  return plan
}

export default renderPlan
