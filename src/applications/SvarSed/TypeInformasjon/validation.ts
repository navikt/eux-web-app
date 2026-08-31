import { H003Sed } from 'declarations/h003'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength, checkValidDateFormat } from 'utils/validation'

export interface ValidationTypeInformasjonProps {
  replySed: ReplySed
  personName?: string
}

export const validateTypeInformasjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationTypeInformasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H003Sed

  // Begrunnelse for fremlegget/meldingen: maks 255 tegn (bindende).
  hasErrors.push(checkLength(v, {
    needle: sed.fremlegg?.begrunnelse,
    max: 255,
    id: namespace + '-fremlegg-begrunnelse',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.varsel?.begrunnelse,
    max: 255,
    id: namespace + '-varsel-begrunnelse',
    message: 'validation:textOverX',
    personName
  }))

  // Startdato må være et gyldig datoformat dersom den er oppgitt.
  if (sed.fremlegg?.startdato) {
    hasErrors.push(checkValidDateFormat(v, {
      needle: sed.fremlegg?.startdato,
      id: namespace + '-fremlegg-startdato',
      message: 'validation:invalidDateFormat',
      personName
    }))
  }

  if (sed.varsel?.startdato) {
    hasErrors.push(checkValidDateFormat(v, {
      needle: sed.varsel?.startdato,
      id: namespace + '-varsel-startdato',
      message: 'validation:invalidDateFormat',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
