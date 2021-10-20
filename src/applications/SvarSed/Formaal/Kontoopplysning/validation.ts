import { UtbetalingTilInstitusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

interface ValidateKontoopplysningProps {
  uti: UtbetalingTilInstitusjon
  namespace: string
  formalName: string
}

export const validateKontoopplysning = (
  v: Validation,
  t: TFunction,
  {
    uti,
    namespace,
    formalName
  }: ValidateKontoopplysningProps
): boolean => {
  let hasErrors: boolean = false
  let kontoType
  if (Object.prototype.hasOwnProperty.call(uti, 'kontoOrdinaer')) {
    kontoType = 'ordinaer'
  }
  if (Object.prototype.hasOwnProperty.call(uti, 'kontoSepa')) {
    kontoType = 'sepa'
  }

  if (_.isEmpty(uti?.begrunnelse?.trim())) {
    v[namespace + '-begrunnelse'] = {
      feilmelding: t('message:validation-noBegrunnelseTil', { person: formalName }),
      skjemaelementId: namespace + '-begrunnelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (uti.begrunnelse.length > 500) {
      v[namespace + '-begrunnelse'] = {
        feilmelding: t('message:validation-textOver500Til', { person: formalName }),
        skjemaelementId: namespace + '-begrunnelse'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(uti?.id?.trim())) {
    v[namespace + '-id'] = {
      feilmelding: t('message:validation-noInstitusjonensIdTil', { person: formalName }),
      skjemaelementId: namespace + '-id'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(uti?.navn?.trim())) {
    v[namespace + '-navn'] = {
      feilmelding: t('message:validation-noInstitusjonensNavnTil', { person: formalName }),
      skjemaelementId: namespace + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!kontoType) {
    v[namespace + '-kontotype'] = {
      feilmelding: t('message:validation-noKontotype'),
      skjemaelementId: namespace + '-kontotype'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (kontoType === 'ordinar') {
    if (_.isEmpty(uti?.kontoOrdinaer?.swift?.trim())) {
      v[namespace + '-kontoOrdinaer-swift'] = {
        feilmelding: t('message:validation-noSwiftTil', { person: formalName }),
        skjemaelementId: namespace + '-kontoOrdinaer-swift'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (kontoType === 'sepa') {
    if (_.isEmpty(uti?.kontoSepa?.iban?.trim())) {
      v[namespace + '-kontoSepa-iban'] = {
        feilmelding: t('message:validation-noIbanTil', { person: formalName }),
        skjemaelementId: namespace + '-kontoSepa-iban'
      } as FeiloppsummeringFeil
      hasErrors = true
    } else {
      if (!uti?.kontoSepa?.iban.trim().match(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{7}([a-zA-Z0-9]?){0,16}$/)) {
        v[namespace + '-kontoSepa-iban'] = {
          feilmelding: t('message:validation-invalidIbanTil', { person: formalName }),
          skjemaelementId: namespace + '-kontoSepa-iban'
        } as FeiloppsummeringFeil
        hasErrors = true
      }
    }

    if (_.isEmpty(uti?.kontoSepa?.swift?.trim())) {
      v[namespace + '-kontoSepa-swift'] = {
        feilmelding: t('message:validation-noSwiftTil', { person: formalName }),
        skjemaelementId: namespace + '-kontoSepa-swift'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  } else {
    if (!uti?.kontoSepa?.swift?.trim().match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
      v[namespace + '-kontoSepa-swift'] = {
        feilmelding: t('message:validation-invalidSwiftTil', { person: formalName }),
        skjemaelementId: namespace + '-kontoSepa-swift'
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
