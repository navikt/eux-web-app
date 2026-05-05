import { H021Sed } from 'declarations/h021'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkIfNotNumber, checkLength, checkIfInteger } from 'utils/validation'

export interface ValidationGlobaltKravProps {
  replySed: ReplySed
  personName?: string
}

export const validateGlobaltKrav = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationGlobaltKravProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H021Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.id,
    id: namespace + '-kreditorinstitusjon-id',
    message: 'validation:noInstitusjonId',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.navn,
    id: namespace + '-kreditorinstitusjon-navn',
    message: 'validation:noInstitusjonNavn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.globalReferanse,
    id: namespace + '-kreditorinstitusjon-globalReferanse',
    message: 'validation:noGlobalReferanse',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.globalReferanse,
    max: 25,
    id: namespace + '-kreditorinstitusjon-globalReferanse',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.debitorinstitusjon?.globalReferanse,
    id: namespace + '-debitorinstitusjon-globalReferanse',
    message: 'validation:noGlobalReferanse',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.refusjonskrav?.debitorinstitusjon?.globalReferanse,
    max: 25,
    id: namespace + '-debitorinstitusjon-globalReferanse',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.totaltAntallFakturaer,
    id: namespace + '-totaltAntallFakturaer',
    message: 'validation:noTotaltAntallFakturaer',
    personName
  }))

  hasErrors.push(checkIfInteger(v, {
    needle: sed.refusjonskrav?.totaltAntallFakturaer,
    id: namespace + '-totaltAntallFakturaer',
    message: 'validation:kunTall',
    personName
  }))

  // Utbetaling — kravTotalbeloep required
  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.kravTotalbeloep?.beloep,
    id: namespace + '-kravTotalbeloep-beloep',
    message: 'validation:noBeloep',
    personName
  }))

  hasErrors.push(checkIfNotNumber(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.kravTotalbeloep?.beloep,
    id: namespace + '-kravTotalbeloep-beloep',
    message: 'validation:invalidBeloep',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.kravTotalbeloep?.valuta,
    id: namespace + '-kravTotalbeloep-valuta',
    message: 'validation:noValuta',
    personName
  }))

  // utbetalingTotalbeloep required
  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.utbetalingTotalbeloep?.beloep,
    id: namespace + '-utbetalingTotalbeloep-beloep',
    message: 'validation:noBeloep',
    personName
  }))

  hasErrors.push(checkIfNotNumber(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.utbetalingTotalbeloep?.beloep,
    id: namespace + '-utbetalingTotalbeloep-beloep',
    message: 'validation:invalidBeloep',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.utbetalingTotalbeloep?.valuta,
    id: namespace + '-utbetalingTotalbeloep-valuta',
    message: 'validation:noValuta',
    personName
  }))

  // avvistKravTotalbeloep optional, but if beloep filled, valuta required and vice versa
  const avvistBeloep = sed.refusjonskrav?.kreditorinstitusjon?.avvistKravTotalbeloep?.beloep
  const avvistValuta = sed.refusjonskrav?.kreditorinstitusjon?.avvistKravTotalbeloep?.valuta
  if (avvistBeloep && !avvistValuta) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: avvistValuta,
      id: namespace + '-avvistKravTotalbeloep-valuta',
      message: 'validation:noValuta',
      personName
    }))
  }
  if (avvistValuta && !avvistBeloep) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: avvistBeloep,
      id: namespace + '-avvistKravTotalbeloep-beloep',
      message: 'validation:noBeloep',
      personName
    }))
  }

  hasErrors.push(checkIfNotNumber(v, {
    needle: avvistBeloep,
    id: namespace + '-avvistKravTotalbeloep-beloep',
    message: 'validation:invalidBeloep',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.refusjonskrav?.kreditorinstitusjon?.betalingsreferanse,
    max: 255,
    id: namespace + '-betalingsreferanse',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
