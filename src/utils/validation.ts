import { ErrorElement } from 'declarations/app'
import _ from 'lodash'
import i18n from 'i18n'
import { Validation } from 'declarations/types'

export const checkIfNotEmpty = (v: Validation, {
  needle,
  id,
  personName,
  message
}: any): boolean => {
  if (_.isEmpty(needle?.trim())) {
    v[id] = {
      feilmelding: i18n.t(message) + personName ? i18n.t('validation:til-person', { person: personName }) : '',
      skjemaelementId: id
    } as ErrorElement
    return true
  }
  return false
}
