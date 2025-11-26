import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'
import { validatePeriode } from 'components/Forms/validation'
import {F002Sed, Motregning, Motregninger, ReplySed} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import {isF002Sed} from "../../../utils/sed";

export interface ValidationMotregningProps {
  replySed: ReplySed
  motregning: Motregning | undefined
  type: string
  nsIndex ?: string
  formalName?: string
}

export interface ValidationMotregningerProps {
  replySed: ReplySed
  formalName?: string
}

export const validateMotregning = (
  v: Validation,
  namespace: string,
  {
    replySed,
    motregning,
    type,
    nsIndex,
    formalName
  }: ValidationMotregningProps): boolean => {
  const hasErrors: Array<boolean> = []

  if (type === 'barn' && !nsIndex) {
    if(_.isEmpty(motregning?.__barn)) {
      hasErrors.push(addError(v, {
        id: namespace + type + '-barn',
        message: 'validation:noBarnSelected',
        personName: formalName
      }))
    } else {
      const barnArray = motregning?.__barn || []
      const hasSelectedBarn = barnArray.some(b => !!b.barnetsNavn && b.barnetsNavn.trim() !== '')
      if(!hasSelectedBarn) {
        hasErrors.push(addError(v, {
          id: namespace + type + '-barn',
          message: 'validation:noBarnSelected',
          personName: formalName
        }))
      }
      barnArray.forEach((b, idx) => {
        if(b.barnetsNavn && b.barnetsNavn.trim() !== ''){
          hasErrors.push(checkIfNotEmpty(v, {
            needle: b.ytelseNavn,
            id: namespace + type + idx + '-ytelseNavn',
            message: 'validation:noYtelse',
            personName: formalName
          }))
        }
      })
    }
  }

  if (type === 'heleFamilien' || (type === 'barn' && nsIndex)) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: motregning?.ytelseNavn,
      id: namespace + (nsIndex ?? type) + '-ytelseNavn',
      message: 'validation:noYtelse',
      personName: formalName
    }))
  }

  if(isF002Sed(replySed)){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: motregning?.svarType,
      id: namespace + (nsIndex ?? type) + '-svarType',
      message: 'validation:noType',
      personName: formalName
    }))
  }

  if (_.isEmpty(motregning?.beloep?.trim())) {
    hasErrors.push(addError(v, {
      id: namespace + (nsIndex ?? type) + '-beloep',
      message: 'validation:noBeløp',
      personName: formalName
    }))
  } else {
    if (!motregning?.beloep?.trim().match(/^[\d.,]+$/)) {
      hasErrors.push(addError(v, {
        id: namespace + (nsIndex ?? type) + '-beloep',
        message: 'validation:invalidBeløp',
        personName: formalName
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.valuta,
    id: namespace + (nsIndex ?? type) + '-valuta',
    message: 'validation:noValuta',
    personName: formalName
  }))

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? type), {
    periode: motregning,
    periodeType: 'simple',
    mandatoryStartdato: true,
    mandatorySluttdato: true,
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.utbetalingshyppighet,
    id: namespace + (nsIndex ?? type) + '-utbetalingshyppighet',
    message: 'validation:noAvgrensing',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: motregning?.begrunnelse,
    max: 500,
    id: namespace + (nsIndex ?? type) + '-begrunnelse',
    message: 'validation:textOverX',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: motregning?.ytterligereInfo,
    max: 500,
    id: namespace + (nsIndex ?? type) + '-ytterligereInfo',
    message: 'validation:textOverX',
    personName: formalName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateMotregninger = (
  v: Validation,
  namespace: string,
  {
    replySed,
    formalName
  }: ValidationMotregningerProps
): boolean => {
  const hasErrors: Array<boolean> = [];

  hasErrors.push(checkIfNotEmpty(v, {
    needle: (replySed as F002Sed).motregninger,
    id: namespace + '-motregninger',
    message: 'validation:noMotregninger'
  }))

  if((replySed as F002Sed).motregninger){
    const motregninger = (replySed as F002Sed).motregninger;
    if(motregninger && motregninger.barn){
      hasErrors.push(checkIfNotEmpty(v, {
        needle: motregninger.barn,
        id: namespace + '-motregninger',
        message: 'validation:noMotregninger'
      }))
    }
    if(motregninger && motregninger.heleFamilien){
      hasErrors.push(checkIfNotEmpty(v, {
        needle: motregninger.heleFamilien,
        id: namespace + '-motregninger',
        message: 'validation:noMotregninger'
      }))
    }

  }

  if((replySed as F002Sed).motregninger && (replySed as F002Sed).motregninger?.heleFamilienOppsummert){
    const heleFamilienOppsummert = (replySed as F002Sed).motregninger?.heleFamilienOppsummert;
    if(heleFamilienOppsummert?.totalbeloep || heleFamilienOppsummert?.valuta || heleFamilienOppsummert?.melding || heleFamilienOppsummert?.betalingsreferanse){
      if (_.isEmpty(heleFamilienOppsummert.totalbeloep?.trim())) {
        hasErrors.push(addError(v, {
          id: namespace + '-heleFamilienOppsummert-totalbeloep',
          message: 'validation:noBeløp',
          personName: formalName
        }))
      } else {
        if (!heleFamilienOppsummert?.totalbeloep?.trim().match(/^[\d.,]+$/)) {
          hasErrors.push(addError(v, {
            id: namespace + '-heleFamilienOppsummert-totalbeloep',
            message: 'validation:invalidBeløp',
            personName: formalName
          }))
        }
      }

      hasErrors.push(checkIfNotEmpty(v, {
        needle: heleFamilienOppsummert.valuta,
        id: namespace + '-heleFamilienOppsummert-valuta',
        message: 'validation:noValuta',
        personName: formalName
      }))
    }
  }

  if((replySed as F002Sed).motregninger && (replySed as F002Sed).motregninger?.barnOppsummert){
    const barnOppsummert = (replySed as F002Sed).motregninger?.barnOppsummert;
    if(barnOppsummert?.totalbeloep || barnOppsummert?.valuta || barnOppsummert?.melding || barnOppsummert?.betalingsreferanse){
      if (_.isEmpty(barnOppsummert.totalbeloep?.trim())) {
        hasErrors.push(addError(v, {
          id: namespace + '-barnOppsummert-totalbeloep',
          message: 'validation:noBeløp',
          personName: formalName
        }))
      } else {
        if (!barnOppsummert.totalbeloep?.trim().match(/^[\d.,]+$/)) {
          hasErrors.push(addError(v, {
            id: namespace + '-barnOppsummert-totalbeloep',
            message: 'validation:invalidBeløp',
            personName: formalName
          }))
        }
      }

      hasErrors.push(checkIfNotEmpty(v, {
        needle: barnOppsummert.valuta,
        id: namespace + '-barnOppsummert-valuta',
        message: 'validation:noValuta',
        personName: formalName
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
