import { UtbetalingTilInstitusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'

interface ValidateKontoopplysningProps {
  uti: UtbetalingTilInstitusjon
  namespace: string
  formalName: string
}

export const validateKontoopplysning = (
  v: Validation,
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
      feilmelding: t('validation:noBegrunnelse') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-begrunnelse'
    } as ErrorElement
    hasErrors = true
  } else {
    if (uti.begrunnelse.length > 500) {
      v[namespace + '-begrunnelse'] = {
        feilmelding: t('validation:textOverX', { x: 500 }) + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-begrunnelse'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(uti?.id?.trim())) {
    v[namespace + '-id'] = {
      feilmelding: t('validation:noInstitusjonensId') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-id'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(uti?.navn?.trim())) {
    v[namespace + '-navn'] = {
      feilmelding: t('validation:noInstitusjonensNavn') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-navn'
    } as ErrorElement
    hasErrors = true
  }

  if (!kontoType) {
    v[namespace + '-kontotype'] = {
      feilmelding: t('validation:noKontotype') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-kontotype'
    } as ErrorElement
    hasErrors = true
  }

  if (kontoType === 'ordinaer') {
    if (_.isEmpty(uti?.kontoOrdinaer?.swift?.trim())) {
      v[namespace + '-kontoOrdinaer-swift'] = {
        feilmelding: t('validation:noSwift') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-kontoOrdinaer-swift'
      } as ErrorElement
      hasErrors = true
    } else {
      if (!uti?.kontoOrdinaer?.swift?.trim().match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
        v[namespace + '-kontoOrdinaer-swift'] = {
          feilmelding: t('validation:invalidSwift') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
          skjemaelementId: namespace + '-kontoOrdinaer-swift'
        } as ErrorElement
        hasErrors = true
      }
    }
  }

  if (kontoType === 'sepa') {
    if (_.isEmpty(uti?.kontoSepa?.iban?.trim()) && _.isEmpty(uti?.kontoSepa?.swift?.trim())) {
      v[namespace + '-kontoSepa-iban'] = {
        feilmelding: t('validation:noIbanOrSwift') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-kontoSepa-iban'
      } as ErrorElement
      hasErrors = true
    }

    if (!_.isEmpty(uti?.kontoSepa?.iban?.trim()) && !uti.kontoSepa!.iban.trim().match(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{7}([a-zA-Z0-9]?){0,16}$/)) {
      v[namespace + '-kontoSepa-iban'] = {
        feilmelding: t('validation:invalidIban') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-kontoSepa-iban'
      } as ErrorElement
      hasErrors = true
    }

    if (_.isEmpty(uti?.kontoSepa?.iban?.trim()) && _.isEmpty(uti?.kontoSepa?.swift?.trim())) {
      v[namespace + '-kontoSepa-swift'] = {
        feilmelding: t('validation:noIbanOrSwift') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-kontoSepa-swift'
      } as ErrorElement
      hasErrors = true
    }

    if (!_.isEmpty(uti?.kontoSepa?.swift?.trim()) && _.isNil(uti?.kontoSepa?.swift?.trim().match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/))) {
      v[namespace + '-kontoSepa-swift'] = {
        feilmelding: t('validation:invalidSwift') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-kontoSepa-swift'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[formaalNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
