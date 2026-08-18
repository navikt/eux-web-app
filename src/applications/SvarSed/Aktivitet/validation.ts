import { Presisering, BostedOpplysninger } from '../../../declarations/h'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationPresiseringProps {
  presisering: Presisering | undefined
  index?: number
  personName?: string
}

export interface ValidationAktivitetProps {
  bostedOpplysninger: BostedOpplysninger | undefined
  inntektskildeHvisStudentMaxLength: number
  skattemessigGrunn?: string
  skattemessigGrunnId: string
  personName?: string
}

export const validatePresisering = (
  v: Validation,
  namespace: string,
  {
    presisering,
    index,
    personName
  }: ValidationPresiseringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkLength(v, {
    needle: presisering?.beskrivelse,
    id: namespace + idx + '-beskrivelse',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: presisering?.sted,
    id: namespace + idx + '-sted',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: presisering?.varighet,
    id: namespace + idx + '-varighet',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: presisering?.art,
    id: namespace + idx + '-art',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAktivitet = (
  v: Validation,
  namespace: string,
  {
    bostedOpplysninger,
    inntektskildeHvisStudentMaxLength,
    skattemessigGrunn,
    skattemessigGrunnId,
    personName
  }: ValidationAktivitetProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (bostedOpplysninger?.aktivitet?.type === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: bostedOpplysninger?.aktivitet?.annet,
      id: namespace + '-aktivitetAnnet',
      message: 'validation:noPersonensStatusAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: bostedOpplysninger?.aktivitet?.annet,
      id: namespace + '-aktivitetAnnet',
      max: 500,
      message: 'validation:textOverX',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.inntektskildeHvisStudent,
    id: namespace + '-inntektskildeHvisStudent',
    max: inntektskildeHvisStudentMaxLength,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.hvorPermanentBostedetEr,
    id: namespace + '-hvorPermanentBostedetEr',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: skattemessigGrunn,
    id: namespace + '-' + skattemessigGrunnId,
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  bostedOpplysninger?.aktivitet?.presiseringer?.forEach((presisering: Presisering, index: number) => {
    hasErrors.push(validatePresisering(v, namespace, {
      presisering,
      index,
      personName
    }))
  })

  return hasErrors.find(value => value) !== undefined
}
