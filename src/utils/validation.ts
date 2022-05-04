import { ErrorElement } from 'declarations/app'
import _ from 'lodash'
import i18n from 'i18n'
import { Validation } from 'declarations/types'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const addError = (v: Validation, { id, personName, message, extra = {} }: any) => {
  v[id] = {
    feilmelding: i18n.t(message, extra) + (personName ? i18n.t('validation:til-person', { person: personName }) : ''),
    skjemaelementId: id
  } as ErrorElement
  return true
}

export const checkLength = (v: Validation, { needle, max = 500, id, personName, message, extra }: any): boolean => {
  if (!_.isEmpty(needle?.trim()) && needle?.trim().length > max) {
    const newExtra = { ...extra, x: max }
    return addError(v, { id, personName, message, extra: newExtra })
  }
  return false
}

export const checkIfNotEmpty = (v: Validation, { needle, id, personName, message, extra }: any): boolean => {
  if (_.isEmpty(_.isString(needle) ? needle.trim() : needle)) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfNotDate = (v: Validation, { needle, id, personName, message, extra }: any): boolean => {
  if (!needle.match(datePattern)) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}


export const checkIfNotTrue = (v: Validation, { needle, id, personName, message, extra }: any): boolean => {
  if (!needle) {
    return addError(v, { id, personName, message, extra })
  }
  return false
}

export const checkIfDuplicate = (v: Validation, { needle, haystack, index, matchFn, id, personName, message, extra }: any): boolean => {
  let duplicate: boolean

  if (!_.isEmpty(needle)) {
    if (_.isNil(index)) {
      duplicate = _.find(haystack, matchFn) !== undefined
    } else {
      const otherHaystack: Array<string> = _.filter(haystack, (p, i) => i !== index)
      duplicate = _.find(otherHaystack, matchFn) !== undefined
    }
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
  if (needle?.trim()?.length !== 2) {
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
  if (needle?.trim()?.toLowerCase() === 'gb') {
    return addError(v, { id, personName, message, extra })
  }
  return false
}
