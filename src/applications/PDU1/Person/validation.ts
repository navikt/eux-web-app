import { validateUtenlandskPin } from 'applications/PDU1/Person/UtenlandskPins/validation'
import { ErrorElement } from 'declarations/app'
import { Pdu1Person } from 'declarations/pd'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'

export interface ValidationPersonProps {
  person: Pdu1Person,
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePerson = (
  v: Validation,
  t: TFunction,
  {
    person,
    namespace
  }: ValidationPersonProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(person?.fornavn?.trim())) {
    v[namespace + '-fornavn'] = {
      feilmelding: t('validation:noFornavn'),
      skjemaelementId: namespace + '-fornavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(person?.etternavn?.trim())) {
    v[namespace + '-etternavn'] = {
      feilmelding: t('validation:noEtternavn'),
      skjemaelementId: namespace + '-etternavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(person?.foedselsdato?.trim())) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('validation:noFoedselsdato'),
      skjemaelementId: namespace + '-foedselsdato'
    } as ErrorElement
    hasErrors = true
  }

  if (!person?.foedselsdato?.trim().match(datePattern)) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('validation:invalidFoedselsdato'),
      skjemaelementId: namespace + '-foedselsdato'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(person?.kjoenn?.trim())) {
    v[namespace + '-kjoenn'] = {
      feilmelding: t('validation:noKjoenn'),
      skjemaelementId: namespace + '-kjoenn'
    } as ErrorElement
    hasErrors = true
  }

  person.utenlandskePin.forEach((pin: string, index: number) => {
    const els = pin.split(/\s+/)
    const _errors = validateUtenlandskPin(v, t, {
      index,
      land: els[0],
      identifikator: els[1],
      utenlandskePins: person.utenlandskePin ?? [],
      namespace: namespace + '-utenlandskePin'
    })
    hasErrors = hasErrors || _errors
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
