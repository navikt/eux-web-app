import { validatePeriod } from 'components/Period/validation'
import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationBarnetilhoerigheterProps {
  barnetilhorighet: Barnetilhoerighet,
  namespace: string,
  personName: string
}

export const validateBarnetilhoerighet = (
  v: Validation,
  t: TFunction,
  {
    barnetilhorighet,
    namespace,
    personName
  }: ValidationBarnetilhoerigheterProps
): boolean => {
  let hasErrors: boolean = false

  if (!barnetilhorighet.relasjonTilPerson) {
    v[namespace + '-relasjonTilPerson'] = {
      feilmelding: t('message:validation-noRelationForPerson', { person: personName }),
      skjemaelementId: namespace + '-relasjonTilPerson'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!barnetilhorighet.relasjonType) {
    v[namespace + '-relasjonType'] = {
      feilmelding: t('message:validation-noRelationTypeForPerson', { person: personName }),
      skjemaelementId: namespace + '-relasjonType'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodError: boolean = validatePeriod(v, t, {
    period: barnetilhorighet.periode,
    index: -1,
    namespace: namespace + '-periode',
    personName
  })
  hasErrors = hasErrors || periodError

  if (['ja', 'nei'].indexOf(barnetilhorighet.erDeltForeldreansvar) < 0) {
    v[namespace + '-erDeltForeldreansvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + '-erDeltForeldreansvar'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIBrukersHushold) < 0) {
    v[namespace + '-borIBrukersHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + '-borIBrukersHushold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIEktefellesHushold) < 0) {
    v[namespace + '-borIEktefellesHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + '-borIEktefellesHushold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIAnnenPersonsHushold) < 0) {
    v[namespace + '-borIAnnenPersonsHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + '-borIAnnenPersonsHushold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borPaaInstitusjon) < 0) {
    v[namespace + '-borPaaInstitusjon'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + '-borPaaInstitusjon'
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

export const validateBarnetilhoerigheter = (
  validation: Validation,
  t: TFunction,
  barnetilhorigheter: Array<Barnetilhoerighet>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  barnetilhorigheter?.forEach((barnetilhorighet: Barnetilhoerighet) => {
    let _error: boolean = validateBarnetilhoerighet(validation, t, { barnetilhorighet, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
