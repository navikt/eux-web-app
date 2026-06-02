import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkIfNotEmpty } from 'utils/validation'
import { validatePeriode } from 'components/Forms/validation'

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

  const isArbeidsufoer = !!(sed.arbeidsufoer?.periodeStartdato || sed.arbeidsufoer?.periodeSluttdato)
  const isArbeidsdyktig = !!sed.arbeidsdyktig?.dekkesKostnader
  const hasSelection = isArbeidsufoer || isArbeidsdyktig

  if (!hasSelection) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: undefined,
      id: namespace + '-gjelderArbeidsufoerhet',
      message: 'validation:noGjelderArbeidsufoerhet',
      personName
    }))
  }

  if (isArbeidsufoer) {
    hasErrors.push(validatePeriode(v, namespace, {
      periode: {
        startdato: sed.arbeidsufoer?.periodeStartdato ?? '',
        sluttdato: sed.arbeidsufoer?.periodeSluttdato ?? ''
      },
      mandatoryStartdato: true,
      mandatorySluttdato: true,
      periodeType: 'simple'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.arbeidsufoer?.dekkesKostnader,
      id: namespace + '-dekkesKostnader',
      message: 'validation:noDekningKostnader',
      personName
    }))
  }

  if (isArbeidsdyktig) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.arbeidsdyktig?.dekkesKostnader,
      id: namespace + '-dekkesKostnader',
      message: 'validation:noDekningKostnader',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
