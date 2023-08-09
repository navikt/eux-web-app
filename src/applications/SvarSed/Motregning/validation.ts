import { KeyAndYtelse } from 'applications/SvarSed/Motregning/Motregning'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'
import { validatePeriode } from 'components/Forms/validation'
import { Motregning, ReplySed, Barn, F002Sed, BarnEllerFamilie } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'

export interface ValidationMotregningProps {
  motregning: Motregning |undefined
  nsIndex ?: string
  formalName?: string
}

export interface ValidationMotregningerProps {
  replySed: ReplySed
  formalName?: string
}

const getId = (m: Motregning | undefined | null): string => m ? m.__type + '-' + m?.startdato + '-' + (m?.sluttdato ?? '') : 'new'

export const validateMotregning = (
  v: Validation,
  namespace: string,
  {
    motregning,
    nsIndex,
    formalName
  }: ValidationMotregningProps): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.__type,
    id: namespace + (nsIndex ?? '') + '-BarnEllerFamilie',
    message: 'validation:noBarnEllerFamilie',
    personName: formalName
  }))

  if (motregning?.__type === 'barn') {
    const selectedBarn: Array<KeyAndYtelse> = motregning?.__index?.values?.filter((value: KeyAndYtelse) => {
      return value.isChecked
    })

    hasErrors.push(checkIfNotEmpty(v, {
      needle: motregning?.__index.values,
      id: namespace + (nsIndex ?? '') + '-selectedBarn',
      message: 'validation:noBarnSelected',
      personName: formalName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: selectedBarn,
      id: namespace + (nsIndex ?? '') + '-selectedBarn',
      message: 'validation:noBarnSelected',
      personName: formalName
    }))

    motregning?.__index?.values?.forEach((value: KeyAndYtelse, i: number) => {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: value?.ytelseNavn,
        id: namespace + (nsIndex ?? '') + '-ytelse[' + i + ']-ytelseNavn',
        message: 'validation:noYtelse',
        personName: formalName
      }))
    })
  }

  if (motregning?.__type === 'familie') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: motregning?.ytelseNavn,
      id: namespace + (nsIndex ?? '') + '-ytelseNavn',
      message: 'validation:noYtelse',
      personName: formalName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.svarType,
    id: namespace + (nsIndex ?? '') + '-svarType',
    message: 'validation:noAnswer',
    personName: formalName
  }))

  if (_.isEmpty(motregning?.beloep?.trim())) {
    hasErrors.push(addError(v, {
      id: namespace + (nsIndex ?? '') + '-beloep',
      message: 'validation:noBeløp',
      personName: formalName
    }))
  } else {
    if (!motregning?.beloep?.trim().match(/^[\d.,]+$/)) {
      hasErrors.push(addError(v, {
        id: namespace + (nsIndex ?? '') + '-beloep',
        message: 'validation:invalidBeløp',
        personName: formalName
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.valuta,
    id: namespace + (nsIndex ?? '') + '-valuta',
    message: 'validation:noValuta',
    personName: formalName
  }))

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? ''), {
    periode: motregning,
    periodeType: 'simple',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.utbetalingshyppighet,
    id: namespace + (nsIndex ?? '') + '-utbetalingshyppighet',
    message: 'validation:noAvgrensing',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.mottakersNavn,
    id: namespace + (nsIndex ?? '') + '-mottakersNavn',
    message: 'validation:noMottakersNavn',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.begrunnelse,
    id: namespace + (nsIndex ?? '') + '-begrunnelse',
    message: 'validation:noGrunn',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: motregning?.begrunnelse,
    max: 500,
    id: namespace + (nsIndex ?? '') + '-begrunnelse',
    message: 'validation:textOverX',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: motregning?.ytterligereInfo,
    max: 500,
    id: namespace + (nsIndex ?? '') + '-ytterligereInfo',
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

  (replySed as F002Sed).barn?.forEach((b: Barn, i: number) => {
    b.motregninger?.forEach((motregning: Motregning, index: number) => {
      if (_.isNil(motregning.__type)) {
        motregning.__type = 'barn' as BarnEllerFamilie
        motregning.__index = {
          index: getId(motregning),
          values: [{
            isChecked: true,
            ytelseNavn: motregning.ytelseNavn,
            key1: 'barn[' + i + ']',
            key2: index
          } as KeyAndYtelse]
        }
      }

      hasErrors.push(validateMotregning(v, namespace, {
        motregning,
        formalName
      }))
    })
  })

  if (!_.isNil((replySed as F002Sed).familie?.motregninger)) {
    (replySed as F002Sed).familie?.motregninger?.forEach((motregning: Motregning, index: number) => {
      if (_.isNil(motregning.__type)) {
        motregning.__type = 'familie' as BarnEllerFamilie
        motregning.__index = {
          index: getId(motregning),
          values: [{
            key1: 'familie',
            key2: index
          }]
        }
        motregning.__index = getId(motregning)
      }

      hasErrors.push(validateMotregning(v, namespace, {
        motregning,
        formalName
      }))
    })
  }
  return hasErrors.find(value => value) !== undefined
}
