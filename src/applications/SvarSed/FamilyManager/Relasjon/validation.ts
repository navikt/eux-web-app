import { validatePeriod } from 'components/Period/validation'
import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

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
): void => {
  let generalFail: boolean = false
  const idx = (!_.isNil(index) && index >= 0 ? '[' + index + ']' : '')

  if (!barnetilhorighet.relasjonTilPerson) {
    v[namespace + idx + '-relasjonTilPerson'] = {
      feilmelding: t('message:validation-noRelationForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-relasjonTilPerson-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (!barnetilhorighet.relasjonType) {
    v[namespace + idx + '-relasjonType'] = {
      feilmelding: t('message:validation-noRelationTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-relasjonType-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  validatePeriod(v, t, {
    period: barnetilhorighet.periode,
    index: index,
    namespace,
    personName
  })

  if (v[namespace + idx + '-startdato'] || v[namespace + idx + '-sluttdato']) {
    generalFail = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.erDeltForeldreansvar) < 0) {
    v[namespace + idx + '-erDeltForeldreansvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-erDeltForeldreansvar-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIBrukersHushold) < 0) {
    v[namespace + idx + '-borIBrukersHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borIBrukersHushold-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIEktefellesHushold) < 0) {
    v[namespace + idx + '-borIEktefellesHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borIEktefellesHushold-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borIAnnenPersonsHushold) < 0) {
    v[namespace + idx + '-borIAnnenPersonsHushold'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borIAnnenPersonsHushold-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (['ja', 'nei'].indexOf(barnetilhorighet.borPaaInstitusjon) < 0) {
    v[namespace + idx + '-borPaaInstitusjon'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-borPaaInstitusjon-text'
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validateBarnetilhoerigheter = (
  validation: Validation,
  t: TFunction,
  barnetilhorigheter: Array<Barnetilhoerighet>,
  namespace: string,
  personName: string
): void => {
  barnetilhorigheter?.forEach((barnetilhorighet: Barnetilhoerighet, index: number) => {
    validateBarnetilhoerighet(validation, t, { barnetilhorighet, index, namespace, personName })
  })
}