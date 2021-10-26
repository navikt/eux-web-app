
import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

interface ValidateGrunnTilOpphørProps {
  grunntilopphor: GrunnTilOpphør | undefined
  namespace: string
}

export const validateGrunnTilOpphor = (
  v: Validation,
  t: TFunction,
  {
    grunntilopphor,
    namespace
  }: ValidateGrunnTilOpphørProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(grunntilopphor?.typeGrunnOpphoerAnsatt)) {
    v[namespace + '-typeGrunnOpphoerAnsatt'] = {
      skjemaelementId: namespace + '-typeGrunnOpphoerAnsatt',
      feilmelding: t('validation:noType')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
