import { Validation } from 'declarations/types'
import {SvarInntekt} from "../../../declarations/sed";
import {checkIfFilledOut, checkIfNotEmpty, checkLength} from "../../../utils/validation";
import {validatePeriode} from "components/Forms/validation";

export interface ValidationInntektProps {
  svarInntekt: SvarInntekt | undefined,
  label: string | undefined
}

export const validateInntekt = (
  v: Validation,
  namespace: string,
  {
    svarInntekt,
    label
  }: ValidationInntektProps
): boolean => {
  const hasErrors: Array<boolean> = []


  hasErrors.push(checkIfFilledOut(v, {
    needle: svarInntekt,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  if (svarInntekt?.inntektskilde === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: svarInntekt.annenkilde,
      id: namespace + '-annenkilde',
      message: 'validation:noAnnenKilde'
    }))

    hasErrors.push(checkLength(v, {
      needle: svarInntekt.annenkilde,
      max: 500,
      id: namespace + '-annenkilde',
      message: 'validation:textOverX'
    }))
  }

  if(svarInntekt?.periode && (svarInntekt?.periode.startdato || svarInntekt?.periode.sluttdato)) {
    hasErrors.push(validatePeriode(v, namespace + '-periode', {
      periode: svarInntekt.periode,
      periodeType: 'simple'
    }))
  }

  if(svarInntekt?.aarlig && svarInntekt?.aarlig.beloep) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: svarInntekt.aarlig.valuta,
      id: namespace + '-aarlig-valuta',
      message: 'validation:noValuta'
    }))
  }

  if(svarInntekt?.aarlig && svarInntekt?.aarlig.valuta) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: svarInntekt.aarlig.beloep,
      id: namespace + '-aarlig-beloep',
      message: 'validation:noBeløp'
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: svarInntekt?.ytterligereInformasjon,
    max: 500,
    id: namespace + '-ytterligereInfo',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
