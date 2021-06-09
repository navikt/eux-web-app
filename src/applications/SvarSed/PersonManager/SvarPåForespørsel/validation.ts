import { HSed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationSvarPåForespørselProps {
  replySed: ReplySed
  namespace: string,
  personName: string
}

export const validateSvarPåForespørsel = (
  v: Validation,
  t: TFunction,
  {
    replySed,
    namespace,
    personName
  }: ValidationSvarPåForespørselProps
): boolean => {

  let hasErrors: boolean = false
  const doWeHavePositive: boolean = !!(replySed as HSed)?.positivtSvar?.informasjon ||
    !!(replySed as HSed)?.positivtSvar?.dokument ||
    !!(replySed as HSed)?.positivtSvar?.sed

  const doWeHaveNegative: boolean = (replySed as HSed)?.negativeSvar?.length > 0

  if (!doWeHavePositive && !doWeHaveNegative) {
    v[namespace + '-svar'] = {
      skjemaelementId: namespace + '-svar',
      feilmelding: t('message:validation-noSvarTypeTilPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const target: string | undefined = doWeHavePositive ? 'positivt' : doWeHaveNegative ? 'negative' : undefined

  if (target === 'positivt') {
    if (!_.isEmpty((replySed as HSed).positivtSvar.informasjon) && (replySed as HSed).positivtSvar.informasjon.length > 500) {
      v[namespace + '-informasjon'] = {
        skjemaelementId: namespace + '-informasjon',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (!_.isEmpty((replySed as HSed).positivtSvar.dokument) && (replySed as HSed).positivtSvar.dokument.length > 500) {
      v[namespace + '-dokument'] = {
        skjemaelementId: namespace + '-dokument',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (!_.isEmpty((replySed as HSed).positivtSvar.sed) && (replySed as HSed).positivtSvar.sed.length > 500) {
      v[namespace + '-sed'] = {
        skjemaelementId: namespace + '-sed',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (target === 'negative') {
    if (!_.isEmpty((replySed as HSed).negativeSvar[0].informasjon) && (replySed as HSed).negativeSvar[0].informasjon.length > 500) {
      v[namespace + '-informasjon'] = {
        skjemaelementId: namespace + '-informasjon',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (!_.isEmpty((replySed as HSed).negativeSvar[0].dokument) && (replySed as HSed).negativeSvar[0].dokument.length > 500) {
      v[namespace + '-dokument'] = {
        skjemaelementId: namespace + '-dokument',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (!_.isEmpty((replySed as HSed).negativeSvar[0].sed) && (replySed as HSed).negativeSvar[0].sed.length > 500) {
      v[namespace + '-sed'] = {
        skjemaelementId: namespace + '-sed',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    // @ts-ignore
    if (!_.isEmpty((replySed as HSed).negativeSvar[0].grunn) && (replySed as HSed)?.negativeSvar[0]?.grunn?.length > 500) {
      v[namespace + '-grunn'] = {
        skjemaelementId: namespace + '-grunn',
        feilmelding: t('message:validation-textOver500TilPerson', { person: personName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
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
