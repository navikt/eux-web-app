import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

interface ValidateKravOmRefusjonProps {
  kravOmRefusjon: string | undefined,
  namespace: string
  formalName: string
}

export const validateKravOmRefusjon = (
  v: Validation,
  t: TFunction,
  {
    kravOmRefusjon,
    namespace,
    formalName
  }: ValidateKravOmRefusjonProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(kravOmRefusjon?.trim())) {
    v[namespace + '-krav'] = {
      feilmelding: t('message:validation-noKravForPerson', { person: formalName }),
      skjemaelementId: namespace + '-krav'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (kravOmRefusjon && kravOmRefusjon.length > 500) {
      v[namespace + '-krav'] = {
        feilmelding: t('message:validation-textOver500TilPerson', { person: formalName }),
        skjemaelementId: namespace + '-krav'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
