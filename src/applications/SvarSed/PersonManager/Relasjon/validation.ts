import { validatePeriode } from 'components/Forms/validation'
import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationBarnetilhoerigheterProps {
  barnetilhorighet: Barnetilhoerighet,
  barnetilhorigheter: Array<Barnetilhoerighet>,
  index?: number
  namespace: string,
  personName: string
}

export const validateBarnetilhoerighet = (
  v: Validation,
  t: TFunction,
  {
    barnetilhorighet,
    barnetilhorigheter,
    namespace,
    index,
    personName
  }: ValidationBarnetilhoerigheterProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(barnetilhorighet.relasjonTilPerson)) {
    v[namespace + idx + '-relasjonTilPerson'] = {
      feilmelding: t('message:validation-noRelationForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-relasjonTilPerson'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(barnetilhorigheter, { relasjonTilPerson: barnetilhorighet.relasjonTilPerson }) !== undefined
    } else {
      const otherBarnetilhoerigheter: Array<Barnetilhoerighet> = _.filter(barnetilhorigheter, (t, i) => i !== index)
      duplicate = _.find(otherBarnetilhoerigheter, { relasjonTilPerson: barnetilhorighet.relasjonTilPerson }) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-relasjonTilPerson'] = {
        feilmelding: t('message:validation-duplicateRelationForPerson', { person: personName }),
        skjemaelementId: namespace + idx + '-relasjonTilPerson'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(barnetilhorighet.relasjonType)) {
    v[namespace + idx + '-relasjonType'] = {
      feilmelding: t('message:validation-noRelationTypeForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-relasjonType'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodError: boolean = validatePeriode(v, t, {
    periode: barnetilhorighet.periode,
    namespace: namespace + idx + '-periode',
    personName
  })
  hasErrors = hasErrors || periodError

  if (['ja', 'nei'].indexOf(barnetilhorighet.erDeltForeldreansvar) < 0) {
    v[namespace + idx + '-erDeltForeldreansvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-erDeltForeldreansvar'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIBrukersHushold) < 0) {
    v[namespace + idx + '-borIBrukersHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-borIBrukersHushold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIEktefellesHushold) < 0) {
    v[namespace + idx + '-borIEktefellesHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-borIEktefellesHushold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIAnnenPersonsHushold) < 0) {
    v[namespace + idx + '-borIAnnenPersonsHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-borIAnnenPersonsHushold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borPaaInstitusjon) < 0) {
    v[namespace + idx + '-borPaaInstitusjon'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-borPaaInstitusjon'
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

interface ValidadeBarnetilhoerigheterProps {
  barnetilhorigheter: Array<Barnetilhoerighet>
  namespace: string
  personName: string
}

export const validateBarnetilhoerigheter = (
  validation: Validation,
  t: TFunction,
  {
    barnetilhorigheter,
    namespace,
    personName
  }: ValidadeBarnetilhoerigheterProps
): boolean => {
  let hasErrors: boolean = false
  barnetilhorigheter?.forEach((barnetilhorighet: Barnetilhoerighet, index) => {
    const _error: boolean = validateBarnetilhoerighet(validation, t, { barnetilhorighet, barnetilhorigheter, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
