import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { validateIdentifikatorer } from 'applications/SvarSed/Identifikator/validation'
import { validatePeriode } from 'components/Forms/validation'
import {Adresse, PeriodeMedForsikring} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationArbeidsperiodeOversiktProps {
  forsikringPeriode: PeriodeMedForsikring | undefined,
  index ?: number
  personName ?: string
}

export interface ValidationArbeidsperioderOversiktProps {
  perioderMedForsikring: Array<PeriodeMedForsikring> | undefined
  personName ?: string
}

const adresseHasProps = (adresse: Adresse | undefined) => {
  let adresseHasProps = false
  if(adresse){
    Object.keys(adresse).forEach((k) => {
      if(adresse[k as keyof Adresse] && adresse[k as keyof Adresse] !== "" ) {
        adresseHasProps = true
      }
    })
  }
  return adresseHasProps
}

export const validateArbeidsperiodeOversikt = (
  v: Validation,
  namespace: string,
  {
    forsikringPeriode,
    personName,
    index
  }: ValidationArbeidsperiodeOversiktProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)
  hasErrors.push(validatePeriode(v, namespace, {
    periode: forsikringPeriode,
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: forsikringPeriode?.arbeidsgiver?.navn,
    id: namespace + idx + '-arbeidsgiver-navn',
    message: 'validation:noNavnArbeidsgiver',
    personName
  }))


  hasErrors.push(validateIdentifikatorer(v, namespace + idx + '-arbeidsgiver-identifikatorer', {
    identifikatorer: forsikringPeriode?.arbeidsgiver?.identifikatorer,
    personName
  }))

  if(adresseHasProps(forsikringPeriode?.arbeidsgiver?.adresse)) {
    hasErrors.push(validateAdresse(v, namespace + idx + '-arbeidsgiver-adresse', {
      adresse: forsikringPeriode?.arbeidsgiver.adresse,
      index,
      checkAdresseType: false,
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateArbeidsperioderOversikt = (
  validation: Validation,
  namespace: string,
  {
    perioderMedForsikring
  }: ValidationArbeidsperioderOversiktProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioderMedForsikring?.forEach((forsikringPeriode: PeriodeMedForsikring, index) => {
    hasErrors.push(validateArbeidsperiodeOversikt(validation, namespace, {
      forsikringPeriode,
      personName: undefined,
      index
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
