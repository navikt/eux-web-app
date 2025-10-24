import { validatePeriode } from 'components/Forms/validation'
import {PeriodeMedGrunn, PeriodePeriode} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import {checkIfDuplicate, checkIfNotEmpty} from 'utils/validation'

export interface ValidationPeriodeMedGrunnProps {
  periodeMedGrunn: PeriodeMedGrunn | undefined
  perioder: Array<PeriodeMedGrunn> | undefined
  index?: number
  personName?: string
}

export interface ValidationPeriodeMedGrunnPerioderProps {
  perioder: Array<PeriodePeriode> | undefined
  personName?: string
}

export const validatePeriodeMedGrunn = (
  v: Validation,
  namespace: string,
  {
    periodeMedGrunn,
    perioder,
    index,
    personName
  }: ValidationPeriodeMedGrunnProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode: periodeMedGrunn?.periode,
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periodeMedGrunn,
    haystack: perioder,
    matchFn: (p: PeriodeMedGrunn) => p.periode.startdato === periodeMedGrunn?.periode?.startdato && p.periode.sluttdato === periodeMedGrunn.periode?.sluttdato,
    message: 'validation:duplicateStartdato',
    id: namespace + idx + '-startdato',
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedGrunn?.typeGrunn,
    id: namespace + idx + '-type-grunn',
    message: 'validation:noGrunn',
    personName
  }))

  if(periodeMedGrunn?.typeGrunn === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: periodeMedGrunn?.annenGrunn,
      id: namespace + idx + '-annen-grunn',
      message: 'validation:noGrunn',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validatePeriodeMedGrunnPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidationPeriodeMedGrunnPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periodeMedGrunn: PeriodeMedGrunn, index: number) => {
    hasErrors.push(validatePeriodeMedGrunn(v, namespace, { periodeMedGrunn: periodeMedGrunn, perioder, index, personName }))
  })

  return hasErrors.find(value => value) !== undefined
}
