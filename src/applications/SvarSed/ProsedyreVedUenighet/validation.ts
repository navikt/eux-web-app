import { ProsedyreVedUenighet, Grunn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { addError, checkIfDuplicate, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationGrunnProps {
  grunn: Grunn | undefined
  grunns: Array<Grunn> | undefined
  index?: number
  formalName?: string
}

export interface ValidationProsedyreVedUenighetProps {
  prosedyreVedUenighet: ProsedyreVedUenighet | undefined
  formalName?: string
}
export const validateGrunn = (
  v: Validation,
  namespace: string,
  {
    grunn,
    grunns,
    index,
    formalName
  }: ValidationGrunnProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: grunn?.person,
    id: namespace + '-person',
    message: 'validation:noPersonGiven',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: grunn?.grunn,
    id: namespace + '-grunn',
    message: 'validation:noGrunn',
    personName: formalName
  }))

  if (grunn?.grunn) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: grunn,
      haystack: grunns,
      index,
      matchFn: (g: Grunn) => (g.grunn === grunn.grunn && g.person === grunn.person),
      id: namespace + '-grunn',
      message: 'validation:duplicateGrunn',
      personName: formalName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}

export const validateProsedyreVedUenighet = (
  v: Validation,
  namespace: string,
  {
    prosedyreVedUenighet = {},
    formalName
  }: ValidationProsedyreVedUenighetProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (!prosedyreVedUenighet.bosted && !prosedyreVedUenighet.medlemsperiode && !prosedyreVedUenighet.personligSituasjon &&
    !prosedyreVedUenighet.pensjon && !prosedyreVedUenighet.oppholdetsVarighet && !prosedyreVedUenighet.ansettelse
  ) {
    hasErrors.push(addError(v, {
      id: namespace + '-grunner',
      message: 'validation:noGrunn',
      personName: formalName
    }))
  }

  if (prosedyreVedUenighet && prosedyreVedUenighet?.ytterligereGrunner && prosedyreVedUenighet?.ytterligereGrunner?.trim()?.length > 500) {
    hasErrors.push(checkLength(v, {
      needle: prosedyreVedUenighet?.ytterligereGrunner,
      max: 500,
      id: namespace + '-ytterligereGrunner',
      message: 'validation:textOverX',
      personName: formalName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
