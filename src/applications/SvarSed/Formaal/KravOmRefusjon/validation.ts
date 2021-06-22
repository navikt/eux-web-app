import { XXXFormalKravOmRefusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export const validateKravOmRefusjon = (
  v: Validation,
  t: TFunction,
  kravOmRefusjon: XXXFormalKravOmRefusjon,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(kravOmRefusjon?.krav?.trim())) {
    v[namespace + '-krav'] = {
      feilmelding: t('message:validation-noKravForPerson', { person: personName }),
      skjemaelementId: namespace + '-krav'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (kravOmRefusjon.krav.length > 500) {
      v[namespace + '-krav'] = {
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName }),
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
