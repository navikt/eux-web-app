import { PersonInfo, Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPersonOpplysningProps {
  personInfo: PersonInfo,
  namespace: string,
  personName: string
}

export interface ValidationPinProps {
  pin: Pin,
  pins: Array<Pin>,
  index ?: number
  namespace: string
  personName: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePin = (
  v: Validation,
  t: TFunction,
  {
    pin,
    pins,
    index,
    namespace,
    personName
  }: ValidationPinProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(pin.identifikator?.trim())) {
    v[namespace + idx + '-identifikator'] = {
      feilmelding: t('message:validation-noIdForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-identifikator'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(pin.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noLandForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-land'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let duplicate: boolean

  if (!_.isEmpty(pin.land)) {
    if (_.isNil(index)) {
      duplicate = _.find(pins, { land: pin.land }) !== undefined
    } else {
      const otherPins: Array<Pin> = _.filter(pins, (p, i) => i !== index)
      duplicate = _.find(otherPins, { land: pin.land }) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-land'] = {
        feilmelding: t('message:validation-duplicateLandForPerson', { person: personName }),
        skjemaelementId: namespace + idx + '-land'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }
  return hasErrors
}
export const validatePersonOpplysninger = (
  v: Validation,
  t: TFunction,
  {
    personInfo,
    namespace,
    personName
  }: ValidationPersonOpplysningProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(personInfo?.fornavn?.trim())) {
    v[namespace + '-fornavn'] = {
      feilmelding: t('message:validation-noFornavnForPerson', { person: personName }),
      skjemaelementId: namespace + '-fornavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.etternavn?.trim())) {
    v[namespace + '-etternavn'] = {
      feilmelding: t('message:validation-noEtternavnForPerson', { person: personName }),
      skjemaelementId: namespace + '-etternavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.foedselsdato?.trim())) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('message:validation-noFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: namespace + '-foedselsdato'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!personInfo?.foedselsdato?.trim().match(datePattern)) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('message:validation-invalidFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: namespace + '-foedselsdato'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.kjoenn?.trim())) {
    v[namespace + '-kjoenn'] = {
      feilmelding: t('message:validation-noKjoennForPerson', { person: personName }),
      skjemaelementId: namespace + '-kjoenn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  personInfo.pin?.forEach((pin: Pin, index: number) => {
    const _errors = validatePin(v, t, {
      index,
      pin: pin,
      pins: personInfo.pin ?? [],
      namespace: namespace + '-pin',
      personName
    })
    hasErrors = hasErrors || _errors
  })

  if (!_.isEmpty(personInfo.pinMangler?.foedested)) {
    if (_.isEmpty(personInfo.pinMangler?.foedested?.by?.trim())) {
      v[namespace + '-foedested-by'] = {
        feilmelding: t('message:validation-noFoedestedByForPerson', { person: personName }),
        skjemaelementId: namespace + '-foedested-by'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(personInfo.pinMangler?.foedested?.region?.trim())) {
      v[namespace + '-foedested-region'] = {
        feilmelding: t('message:validation-noFoedestedRegionForPerson', { person: personName }),
        skjemaelementId: namespace + '-foedested-region'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(personInfo.pinMangler?.foedested?.land?.trim())) {
      v[namespace + '-foedested-land'] = {
        feilmelding: t('message:validation-noFoedestedLandForPerson', { person: personName }),
        skjemaelementId: namespace + '-foedested-land'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
