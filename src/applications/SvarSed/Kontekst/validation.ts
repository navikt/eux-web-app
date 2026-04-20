import { X002Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkIfInteger } from 'utils/validation'

export interface ValidationKontekstProps {
  replySed: X002Sed
  personName ?: string | undefined
}

export const validateKontekst = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationKontekstProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const hasArbeidsgiver = replySed.arbeidsgiver !== undefined
  const hasRefusjonskrav = replySed.refusjonskrav !== undefined

  if (!hasArbeidsgiver && !hasRefusjonskrav) {
    // Person context: all four fields required per XSD
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.bruker?.fornavn,
      id: namespace + '-bruker-fornavn',
      message: 'validation:noFornavn',
      personName
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.bruker?.etternavn,
      id: namespace + '-bruker-etternavn',
      message: 'validation:noEtternavn',
      personName
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.bruker?.foedselsdato,
      id: namespace + '-bruker-foedselsdato',
      message: 'validation:noFoedselsdato',
      personName
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.bruker?.kjoenn,
      id: namespace + '-bruker-kjoenn',
      message: 'validation:noKjoenn',
      personName
    }))
  }

  if (hasArbeidsgiver) {
    // Employer context: name is required per XSD
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.arbeidsgiver?.navn,
      id: namespace + '-arbeidsgiver-navn',
      message: 'validation:noNavnArbeidsgiver',
      personName
    }))

    // Address is optional, but if any address field is filled, town and country are required per XSD
    const addr = replySed.arbeidsgiver?.adresse
    const hasAnyAddress = addr && (addr.bygning || addr.gate || addr.by || addr.postnummer || addr.region || addr.landkode)
    if (hasAnyAddress) {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: addr?.by,
        id: namespace + '-arbeidsgiver-by',
        message: 'validation:noBy',
        personName
      }))
      hasErrors.push(checkIfNotEmpty(v, {
        needle: addr?.landkode,
        id: namespace + '-arbeidsgiver-landkode',
        message: 'validation:noLand',
        personName
      }))
    }
  }

  if (hasRefusjonskrav) {
    // Reimbursement context: both fields required per XSD
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.refusjonskrav?.id,
      id: namespace + '-refusjonskrav-id',
      message: 'validation:noId',
      personName
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.refusjonskrav?.antallkrav,
      id: namespace + '-refusjonskrav-antallkrav',
      message: 'validation:noAntallkrav',
      personName
    }))
    hasErrors.push(checkIfInteger(v, {
      needle: replySed.refusjonskrav?.antallkrav,
      id: namespace + '-refusjonskrav-antallkrav',
      message: 'validation:notInteger',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
