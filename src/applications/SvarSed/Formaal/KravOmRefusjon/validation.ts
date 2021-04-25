import { FormalKravOmRefusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export const validateKravOmRefusjon = (
  v: Validation,
  t: TFunction,
  kravOmRefusjon: FormalKravOmRefusjon,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(kravOmRefusjon?.krav?.trim())) {
    v[namespace + '-krav'] = {
      feilmelding: t('message:validation-noKravForPerson', {person: personName}),
      skjemaelementId: namespace + '-krav'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const formaalNamespace = namespaceBits[0]
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
