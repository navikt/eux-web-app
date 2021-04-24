import { validatePeriod } from 'components/Period/validation'
import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationBarnetilhoerigheterProps {
  barnetilhorighet: Barnetilhoerighet,
  index: number
  namespace: string,
  personName: string
}

export const validateBarnetilhoerighet = (
  v: Validation,
  t: TFunction,
  {
    barnetilhorighet,
    index,
    namespace,
    personName
  }: ValidationBarnetilhoerigheterProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (!barnetilhorighet.relasjonTilPerson) {
    v[namespace + idx + '-relasjonTilPerson'] = {
      feilmelding: t('message:validation-noRelationForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-relasjonTilPerson-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!barnetilhorighet.relasjonType) {
    v[namespace + idx + '-relasjonType'] = {
      feilmelding: t('message:validation-noRelationTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-relasjonType-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodError: boolean = validatePeriod(v, t, {
    period: barnetilhorighet.periode,
    index: index,
    namespace,
    personName
  })
  hasErrors = hasErrors || periodError

  if (['ja', 'nei'].indexOf(barnetilhorighet.erDeltForeldreansvar) < 0) {
    v[namespace + idx + '-erDeltForeldreansvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-erDeltForeldreansvar-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIBrukersHushold) < 0) {
    v[namespace + idx + '-borIBrukersHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borIBrukersHushold-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIEktefellesHushold) < 0) {
    v[namespace + idx + '-borIEktefellesHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borIEktefellesHushold-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIAnnenPersonsHushold) < 0) {
    v[namespace + idx + '-borIAnnenPersonsHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borIAnnenPersonsHushold-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borPaaInstitusjon) < 0) {
    v[namespace + idx + '-borPaaInstitusjon'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borPaaInstitusjon-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
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
  barnetilhorigheter?.forEach((barnetilhorighet: Barnetilhoerighet, index: number) => {
    let _error: boolean = validateBarnetilhoerighet(validation, t, { barnetilhorighet, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
