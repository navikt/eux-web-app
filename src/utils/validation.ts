import { ErrorElement } from 'declarations/app'
import _ from 'lodash'
import i18n from 'i18n'
import { Validation } from 'declarations/types'

export const datePattern = /^\d{4}-\d{2}-\d{2}$/

export interface ValidateParams {
  id: string
  personName ?: string
  message: string
  extra ?: any
}

export interface ValidateValueParams extends ValidateParams {
  needle: any
}

export interface ValidatePatternParams extends ValidateValueParams {
  pattern ?: any | string
}

export interface ValidateLengthParams extends ValidateValueParams {
  max: number
}

export interface ValidateDuplicateParams extends ValidateValueParams {
  matchFn: () => boolean
  haystack: Array<any> | undefined
}

export const addError = (v: Validation, { id, personName, message, extra = {} }: ValidateParams
) => {
  v[id] = {
    feilmelding: i18n.t(message, extra) + (personName ? i18n.t('validation:til-person', { person: personName }) : ''),
    skjemaelementId: id
  } as ErrorElement
  return true
}

export const checkLength = (v: Validation, {
  needle, max = 500, id, personName, message, extra
}: ValidateLengthParams): boolean => {
  if (!_.isEmpty(needle?.trim()) && needle?.trim().length > max) {
    const newExtra = { ...extra, x: max }
    return addError(v, { id, personName, message, extra: newExtra })
  }
  return false
}

export const checkIfNotEmpty = (v: Validation, { needle, id, personName, message, extra }: ValidateValueParams): boolean => {
  if (_.isEmpty(_.isString(needle) ? needle.trim() : needle)) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkPattern = (v: Validation, { needle, id, pattern, personName, message, extra }: ValidatePatternParams): boolean => {
  if (!_.isEmpty(needle) && !(needle!.match(pattern!))) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfNotDate = (v: Validation, { needle, id, pattern = datePattern, personName, message, extra }: ValidatePatternParams): boolean => {
  if (!_.isEmpty(needle) && !(needle!.match(pattern!))) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfNotEmail = (v: Validation, { needle, id, personName, message, extra }: ValidateValueParams
): boolean => {
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!_.isEmpty(needle) && !(needle!.match(emailPattern))) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfNotNumber = (v: Validation, {
  needle, id, personName, message, extra
}: ValidateValueParams): boolean => {
  if (!_.isEmpty(needle) && !(needle!.match(/^[\d.,]+$/))) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfNotTrue = (v: Validation, {
  needle, id, personName, message, extra
}: ValidateValueParams): boolean => {
  if (!needle) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfValidFnr = (v: Validation, {
  needle, id, personName, message, extra
}: ValidateValueParams): boolean => {
  if (!_.isEmpty(needle) && !(needle!.match(/^\d{11}$/))) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfDuplicate = (v: Validation, {
  needle, haystack, index, matchFn, id, personName, message, extra
}: any): boolean => {
  let duplicate: boolean
  let _h
  if (!_.isEmpty(needle)) {
    if (_.isNil(index)) {
      _h = haystack
    } else {
      _h = _.filter(haystack, (p, i) => i !== index)
    }
    duplicate = _.find(_h, matchFn) !== undefined
    if (duplicate) {
      return addError(v, { id, personName, message, extra })
    }
  }
  return false
}

export const checkIfValidLand = (v: Validation, {
  needle,
  id,
  personName,
  message,
  extra
}: any): boolean => {
  if (!_.isEmpty(needle) && needle?.trim()?.length !== 2) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfNotGB = (v: Validation, {
  needle,
  id,
  personName,
  message,
  extra
}: any): boolean => {
  if (!_.isEmpty(needle) && needle?.trim()?.toLowerCase() === 'gb') {
    return addError(v, { id, personName, message, extra })
  }
  return false
}
export const hasNamespaceWithErrors = (v: Validation, namespace: string): boolean =>
  _.some(v, (value, key) => (key.startsWith(namespace) && v[key]?.feilmelding !== 'ok'))

// note that this function not only returns validation, but CHANGES original object, because we want
// that to chain-validate
export const filterAllWithNamespace = (v: Validation, namespace: string | Array<string>): Validation => {
  const namespaceArray: Array<string> = _.isString(namespace) ? [namespace] : namespace
  const clonedV = { ...v }
  for (const path of namespaceArray) {
    _.unset(clonedV, path)
  }
  return clonedV
}
