import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationAnmodningInfoProps {
  replySed: ReplySed
  personName?: string
}

export const validateAnmodningInfo = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAnmodningInfoProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H120Sed

  if (sed.anmodningInfo?.gjelderArbeidsufoerhet === undefined || sed.anmodningInfo?.gjelderArbeidsufoerhet === null) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: undefined,
      id: namespace + '-gjelderArbeidsufoerhet',
      message: 'validation:noGjelderArbeidsufoerhet',
      personName
    }))
  }

  if (sed.anmodningInfo?.gjelderArbeidsufoerhet === true) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.anmodningInfo?.periodeStartdato,
      id: namespace + '-periodeStartdato',
      message: 'validation:noPeriodeStartdato',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.anmodningInfo?.periodeSluttdato,
      id: namespace + '-periodeSluttdato',
      message: 'validation:noPeriodeSluttdato',
      personName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.anmodningInfo?.dekningKostnader,
    id: namespace + '-dekningKostnader',
    message: 'validation:noDekningKostnader',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
