import { ErrorElement } from 'declarations/app'
import _ from 'lodash'
import i18n from 'i18n'
import { Validation } from 'declarations/types'

export const addError = (v: Validation, {
  id,
  personName,
  message,
  extra = {}
}: any) => {
  v[id] = {
    feilmelding: i18n.t(message, extra) + (personName ? i18n.t('validation:til-person', { person: personName }) : ''),
    skjemaelementId: id
  } as ErrorElement
}

export const checkIfNotEmpty = (v: Validation, {
  needle,
  id,
  personName,
  message,
  extra
}: any): boolean => {
  if (_.isEmpty(needle?.trim())) {
    addError(v, { id, personName, message, extra })
    return true
  }
  return false
}

export const checkIfDuplicate = (v: Validation, {
  needle,
  haystack,
  index,
  matchFn,
  id,
  personName,
  message, extra
}: any): boolean => {
  let duplicate: boolean

  if (!_.isEmpty(needle)) {
    if (_.isNil(index)) {
      duplicate = _.find(haystack, matchFn) !== undefined
    } else {
      const otherHaystack: Array<string> = _.filter(haystack, (p, i) => i !== index)
      duplicate = _.find(otherHaystack, matchFn) !== undefined
    }
    if (duplicate) {
      addError(v, { id, personName, message, extra })
      return true
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
    addError(v, { id, personName, message, extra })
    return true
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
    addError(v, { id, personName, message, extra })
    return true
  }
  return false
}

export const propagateError = (v: Validation, namespace: string) => {
  const namespaceBits = namespace.split('-')
  const mainNamespace = namespaceBits[0]
  const personNamespace = mainNamespace + '-' + namespaceBits[1]
  let categoryNamespace = personNamespace + '-' + namespaceBits[2]
  // clean up category names, like forsikring[periodeSyk][1] to forsikring
  if (categoryNamespace.indexOf('[') >= 0) {
    categoryNamespace = categoryNamespace.substring(0, categoryNamespace.indexOf('['))
  }
  v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
}
