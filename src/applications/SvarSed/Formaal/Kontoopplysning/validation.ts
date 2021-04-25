import { UtbetalingTilInstitusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export const validateKontoopplysning = (
  v: Validation,
  t: TFunction,
  uti: UtbetalingTilInstitusjon,
  namespace: string,
  personName?: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(uti?.begrunnelse?.trim())) {
    v[namespace + '-begrunnelse'] = {
      feilmelding: t('message:validation-noBegrunnelseTilPerson', {person: personName}),
      skjemaelementId: namespace + '-begrunnelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(uti?.id?.trim())) {
    v[namespace + '-id'] = {
      feilmelding: t('message:validation-noInstitusjonensIdTilPerson', {person: personName}),
      skjemaelementId: namespace + '-id'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(uti?.navn?.trim())) {
    v[namespace + '-navn'] = {
      feilmelding: t('message:validation-noInstitusjonensNavnTilPerson', {person: personName}),
      skjemaelementId: namespace + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(uti?.kontoOrdinaer?.sepaKonto?.trim())) {
    v[namespace + '-kontoOrdinaer-sepaKonto'] = {
      feilmelding: t('message:validation-noSepaKontoForPerson', {person: personName}),
      skjemaelementId: namespace + '-kontoOrdinaer-sepaKonto'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(uti?.kontoOrdinaer?.iban?.trim())) {
    v[namespace + '-kontoOrdinaer-iban'] = {
      feilmelding: t('message:validation-noIbanForPerson', {person: personName}),
      skjemaelementId: namespace + '-kontoOrdinaer-iban'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(uti?.kontoOrdinaer?.swift?.trim())) {
    v[namespace + '-kontoOrdinaer-swift'] = {
      feilmelding: t('message:validation-noSwiftForPerson', {person: personName}),
      skjemaelementId: namespace + '-kontoOrdinaer-swift'
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
