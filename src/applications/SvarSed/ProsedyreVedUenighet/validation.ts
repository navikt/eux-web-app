import { ProsedyreVedUenighet as IProsedyreVedUenighet, Grunn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationProsedyreVedUenighetGrunnProps {
  grunn: Grunn
  prosedyreVedUenighet: IProsedyreVedUenighet | undefined
  index?: number
  formalName?: string
}

export const validateProsedyreVedUenighetGrunn = (
  v: Validation,
  namespace: string,
  {
    grunn,
    prosedyreVedUenighet = {} as any,
    formalName
  }: ValidationProsedyreVedUenighetGrunnProps
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

  const duplicate: boolean = Object.prototype.hasOwnProperty.call(prosedyreVedUenighet, grunn.grunn)
  if (duplicate) {
    hasErrors.push(addError(v, {
      id: namespace + '-grunn',
      message: 'validation:duplicateGrunn',
      personName: formalName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}

interface ValidateProsedyreVedUenighetProps {
  prosedyreVedUenighet: IProsedyreVedUenighet
  formalName: string
}

export const validateProsedyreVedUenighet = (
  v: Validation,
  namespace: string,
  {
    prosedyreVedUenighet = {},
    formalName
  }: ValidateProsedyreVedUenighetProps
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
