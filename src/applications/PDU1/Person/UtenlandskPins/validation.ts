import { ErrorElement } from 'declarations/app'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationUtenlandskPinProps {
  land: string,
  identifikator: string
  utenlandskePins: Array<string> | undefined
  index ?: number
  namespace: string
}

export const validateUtenlandskPin = (
  v: Validation,
  t: TFunction,
  {
    land,
    identifikator,
    utenlandskePins,
    index,
    namespace
  }: ValidationUtenlandskPinProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(identifikator?.trim())) {
    v[namespace + idx + '-identifikator'] = {
      feilmelding: t('validation:noId'),
      skjemaelementId: namespace + idx + '-identifikator'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('validation:noLand'),
      skjemaelementId: namespace + idx + '-land'
    } as ErrorElement
    hasErrors = true
  }

  let duplicate: boolean

  if (!_.isEmpty(land)) {
    if (_.isNil(index)) {
      duplicate = _.find(utenlandskePins, (pin: string) => pin.split(' ')[0] === land) !== undefined
    } else {
      const otherPins: Array<string> = _.filter(utenlandskePins, (p, i) => i !== index)
      duplicate = _.find(otherPins, (pin: string) => pin.split(' ')[0] === land) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-land'] = {
        feilmelding: t('validation:duplicateLand'),
        skjemaelementId: namespace + idx + '-land'
      } as ErrorElement
      hasErrors = true
    }
  }
  return hasErrors
}
