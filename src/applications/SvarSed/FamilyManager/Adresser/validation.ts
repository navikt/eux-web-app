import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const validateAdresse = (
  v: Validation,
  adresse: Adresse,
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false
  let value = (!_.isEmpty(adresse.type))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-type-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-type'] = value
  if (value) {
    generalFail = true
  }

  value = (!_.isEmpty(adresse.land))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-land-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-land'] = value
  if (value) {
    generalFail = true
  }
  value = (!_.isEmpty(adresse.gate))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressStreetForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-gate-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-gate'] = value
  if (value) {
    generalFail = true
  }
  value = (!_.isEmpty(adresse.postnummer))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressPostnummerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-postnummer-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-postnummer'] = value
  if (value) {
    generalFail = true
  }
  value = (!_.isEmpty(adresse.by))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressCityForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-by-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-by'] = value
  if (value) {
    generalFail = true
  }

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validateAdresser = (
  validation: Validation,
  adresser: Array<Adresse>,
  t: any,
  namespace: string,
  personName: string
): void => {
  adresser?.forEach((adresse: Adresse, index: number) => {
    validateAdresse(validation, adresse, index, t, namespace, personName)
  })
}

const useCustomValidation: () => [
  Validation,
  (key: string | undefined) => void,
  ({data, index, namespace, personName}: any) => boolean
] = () => {

  const { t } = useTranslation()
  const [_validation, setValidation] = useState<Validation>({})

  const resetValidation = (key: string | undefined): void => {
    if (!key) {
      setValidation({})
    }
    setValidation({
      ..._validation,
      [key!]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = ({
    data,
    index,
    namespace,
    personName
  }: any): boolean => {
    const newValidation: Validation = {}
    validateAdresse(
      newValidation,
      data,
      index,
      t,
      namespace,
      personName
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  return [
    _validation,
    resetValidation,
    performValidation
  ]
}

export default useCustomValidation
