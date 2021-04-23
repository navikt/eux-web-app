import { validatePeriod } from 'components/Period/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationFamilierelasjonProps {
  familierelasjon: FamilieRelasjon
  index: number
  namespace: string
  personName: string
}

export const validateFamilierelasjon = (
  v: Validation,
  t: TFunction,
  {
    familierelasjon,
    index,
    namespace,
    personName
  }: ValidationFamilierelasjonProps
): boolean => {
  let hasErrors: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  hasErrors = hasErrors && validatePeriod(v, t, {
    period: familierelasjon.periode,
    index,
    namespace,
    personName
  })

  if (familierelasjon.relasjonType === 'ANNEN') {
    if (_.isEmpty(familierelasjon.annenRelasjonPersonNavn)) {
      v[namespace + idx + '-annenrelasjonpersonnavn'] = {
        feilmelding: t('message:validation-noNameToPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-annenrelasjonpersonnavn-text'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(familierelasjon.annenRelasjonDato)) {
      v[namespace + idx + '-annenrelasjondato'] = {
        feilmelding: t('message:validation-noRelationDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-annenrelasjondato-date'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(familierelasjon.borSammen)) {
      v[namespace + idx + '-borsammen'] = {
        feilmelding: t('message:validation-noBoSammen', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-borsammen-text'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}

export const validateFamilierelasjoner = (
  validation: Validation,
  t: TFunction,
  familierelasjoner: Array<FamilieRelasjon>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon, index: number) => {
    hasErrors = hasErrors && validateFamilierelasjon(validation, t, {
      familierelasjon,
      index,
      namespace,
      personName
    })
  })
  return hasErrors
}
