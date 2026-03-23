import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationAWODSpoersmaalProps {
  replySed: ReplySed
  personName?: string
}

export const validateAWODSpoersmaal = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAWODSpoersmaalProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H120Sed

  hasErrors.push(checkLength(v, {
    needle: sed.arbeidsulykkeyrkessykdom?.brukerStatusAnnet,
    max: 65,
    id: namespace + '-brukerStatusAnnet',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.arbeidsulykkeyrkessykdom?.sykdomKode,
    max: 25,
    id: namespace + '-sykdomKode',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.arbeidsulykkeyrkessykdom?.sykdomKodingssystem,
    max: 65,
    id: namespace + '-sykdomKodingssystem',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.arbeidsulykkeyrkessykdom?.konsekvensEllerBeskrivelse,
    max: 255,
    id: namespace + '-konsekvensEllerBeskrivelse',
    message: 'validation:textOverX',
    personName
  }))

  const awod = sed.arbeidsulykkeyrkessykdom
  const adresse = awod?.arbeidsgiver?.adresse
  const hasAnyAdresseField = !!(
    adresse?.gate?.trim() || adresse?.bygning?.trim() || adresse?.postnummer?.trim() ||
    adresse?.by?.trim() || adresse?.region?.trim() || adresse?.landkode?.trim()
  )

  const identifikator = awod?.arbeidsgiver?.identifikator?.[0]
  const hasIdentifikatorType = !!identifikator?.type?.trim()
  const hasIdentifikatorId = !!identifikator?.id?.trim()

  const hasAnyAWODField = !!(
    awod?.type || awod?.dato?.trim() || awod?.brukerStatus ||
    awod?.brukerStatusAnnet?.trim() || awod?.sykdomKode?.trim() ||
    awod?.sykdomKodingssystem?.trim() || awod?.konsekvensEllerBeskrivelse?.trim() ||
    awod?.arbeidsgiver?.navn?.trim() || hasAnyAdresseField || (hasIdentifikatorType || hasIdentifikatorId)
  )

  if (hasAnyAWODField) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: awod?.type,
      id: namespace + '-type',
      message: 'validation:noAWODType',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: awod?.dato,
      id: namespace + '-dato',
      message: 'validation:noAWODDato',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: awod?.arbeidsgiver?.navn,
      id: namespace + '-arbeidsgiverNavn',
      message: 'validation:noArbeidsgiverNavn',
      personName
    }))
  }

  if (hasAnyAdresseField) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: adresse?.by,
      id: namespace + '-arbeidsgiverBy',
      message: 'validation:noBy',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: adresse?.landkode,
      id: namespace + '-arbeidsgiverLand',
      message: 'validation:noLand',
      personName
    }))
  }

  if (hasIdentifikatorType || hasIdentifikatorId) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: identifikator?.type,
      id: namespace + '-identifikatorType',
      message: 'validation:noIdentifikatorType',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: identifikator?.id,
      id: namespace + '-identifikatorId',
      message: 'validation:noIdentifikatorId',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
