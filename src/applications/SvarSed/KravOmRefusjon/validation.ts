import { Validation } from 'declarations/types'
import _ from 'lodash'
import {addError, checkIfNotEmpty, checkLength} from 'utils/validation'
import {F002Sed, Refusjon, RefusjonsKrav, ReplySed} from "../../../declarations/sed";
import {validatePeriode} from "../../../components/Forms/validation";
import {getIdx} from "../../../utils/namespace";

export interface ValidationKravOmRefusjonProps {
  kravOmRefusjon: string | undefined,
  formalName: string | undefined
}

export interface ValidationRefusjonsKravProps {
  refusjonsKrav: RefusjonsKrav | undefined,
  nsIndex?: number
  formalName: string | undefined
}

export interface ValidationRefusjonProps {
  replySed?: ReplySed
  formalName: string | undefined
}

export const validateKravOmRefusjon = (
  v: Validation,
  namespace: string,
  {
    kravOmRefusjon,
    formalName
  }: ValidationKravOmRefusjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: kravOmRefusjon,
    id: namespace + '-krav',
    message: 'validation:noKrav',
    personName: formalName
  }))

  if (!_.isEmpty(kravOmRefusjon?.trim())) {
    hasErrors.push(checkLength(v, {
      needle: kravOmRefusjon,
      max: 500,
      id: namespace + '-krav',
      message: 'validation:textOverX',
      personName: formalName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateRefusjonsKrav = (
  v: Validation,
  namespace: string,
  {
    refusjonsKrav,
    nsIndex,
    formalName
  }: ValidationRefusjonsKravProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(nsIndex)

  if (_.isEmpty(refusjonsKrav?.beloep?.trim())) {
    hasErrors.push(addError(v, {
      id: namespace + idx + '-beloep',
      message: 'validation:noBeløp',
      personName: formalName
    }))
  } else {
    if (!refusjonsKrav?.beloep?.trim().match(/^[\d.,]+$/)) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-beloep',
        message: 'validation:invalidBeløp',
        personName: formalName
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonsKrav?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:noValuta',
    personName: formalName
  }))

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode: refusjonsKrav,
    periodeType: 'simple',
    mandatoryStartdato: true,
    mandatorySluttdato: true,
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: refusjonsKrav?.ytterligereinformasjon,
    max: 500,
    id: namespace + idx + '-ytterligereinformasjon',
    message: 'validation:textOverX',
    personName: formalName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateRefusjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    formalName
  }: ValidationRefusjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if((replySed as F002Sed).refusjon){
    const refusjon: Refusjon = (replySed as F002Sed).refusjon as Refusjon
    if(refusjon?.totalbeloep || refusjon?.valuta || refusjon?.melding || refusjon?.betalingsreferanse){
      if (_.isEmpty(refusjon.totalbeloep?.trim())) {
        hasErrors.push(addError(v, {
          id: namespace + '-totalbeloep',
          message: 'validation:noBeløp',
          personName: formalName
        }))
      } else {
        if (!refusjon.totalbeloep?.trim().match(/^[\d.,]+$/)) {
          hasErrors.push(addError(v, {
            id: namespace + '-totalbeloep',
            message: 'validation:invalidBeløp',
            personName: formalName
          }))
        }
      }

      hasErrors.push(checkIfNotEmpty(v, {
        needle: refusjon.valuta,
        id: namespace + '-valuta',
        message: 'validation:noValuta',
        personName: formalName
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
