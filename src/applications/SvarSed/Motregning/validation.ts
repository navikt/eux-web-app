import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'
import { KeyAndYtelse } from './KeyAndYtelse/KeyAndYtelse'
import { validatePeriode } from 'components/Forms/validation'
import { Motregning as IMotregning, ReplySed, Barn, F002Sed, BarnaEllerFamilie } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'

export interface ValidationMotregningProps {
  motregning: IMotregning
  keyAndYtelses?: Array<KeyAndYtelse> | undefined // only used for the new-motregning
  type: BarnaEllerFamilie
  index ?: number
  formalName: string
}

export interface ValidationMotregningerProps {
  replySed: ReplySed
  formalName: string
}

export const validateMotregning = (
  v: Validation,
  namespace: string,
  {
    motregning,
    keyAndYtelses,
    index,
    type,
    formalName
  }: ValidationMotregningProps): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.svarType,
    id: namespace + idx + '-svarType',
    message: 'validation:noAnswer',
    personName: formalName
  }))

  // if we are validation a new motregning and it has barnas, then
  // ytelseNavn comes through keyAndYtelsNavns (Array<IKeyAndYtelsNavn>)
  if (_.isNil(index)) {
    if (type === undefined && _.isEmpty(keyAndYtelses)) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-barnaEllerFamilie',
        message: 'validation:noBarnaEllerFamilie',
        personName: formalName
      }))
    }

    if (type === 'barna' && _.isEmpty(keyAndYtelses)) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-ytelseNavn',
        message: 'validation:noYtelse',
        personName: formalName
      }))
    }
  // on other cases, ytelseNavn comes on the motregning (new motregning as familie, or all existing motregning)
  } else {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: motregning?.ytelseNavn,
      id: namespace + idx + '-ytelseNavn',
      message: 'validation:noYtelse',
      personName: formalName
    }))
  }

  if (_.isEmpty(motregning?.beloep?.trim())) {
    hasErrors.push(addError(v, {
      id: namespace + idx + '-beloep',
      message: 'validation:noBeløp',
      personName: formalName
    }))
  } else {
    if (!motregning?.beloep?.trim().match(/^[\d.,]+$/)) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-beloep',
        message: 'validation:invalidBeløp',
        personName: formalName
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:noValuta',
    personName: formalName
  }))

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode: {
      startdato: motregning.startdato,
      sluttdato: motregning.sluttdato
    },
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.utbetalingshyppighet,
    id: namespace + idx + '-utbetalingshyppighet',
    message: 'validation:noAvgrensing',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.mottakersNavn,
    id: namespace + idx + '-mottakersNavn',
    message: 'validation:noMottakersNavn',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: motregning?.begrunnelse,
    id: namespace + idx + '-begrunnelse',
    message: 'validation:noGrunn',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: motregning?.begrunnelse,
    max: 500,
    id: namespace + idx + '-begrunnelse',
    message: 'validation:textOverX',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: motregning?.ytterligereInfo,
    max: 500,
    id: namespace + idx + '-ytterligereInfo',
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

  (replySed as F002Sed).barn?.forEach((b: Barn) => {
    b.motregninger?.forEach((motregning: IMotregning, index: number) => {
      hasErrors.push(validateMotregning(v, namespace, {
        motregning,
        type: 'barna',
        index,
        formalName
      }))
    })
  })

  if (!_.isNil((replySed as F002Sed).familie?.motregninger)) {
    (replySed as F002Sed).familie?.motregninger?.forEach((motregning: IMotregning, index: number) => {
      hasErrors.push(validateMotregning(v, namespace, {
        motregning,
        type: 'familie',
        index,
        formalName
      }))
    })
  }

  return hasErrors.find(value => value) !== undefined
}
