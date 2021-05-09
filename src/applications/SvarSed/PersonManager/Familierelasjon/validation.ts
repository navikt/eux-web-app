import { validatePeriod } from 'components/Period/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationFamilierelasjonProps {
  familierelasjon: FamilieRelasjon
  index?: number
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
  const idx = getIdx(index)

  if (_.isEmpty(familierelasjon.relasjonType?.trim())) {
    v[namespace + idx + '-relasjonType'] = {
      feilmelding: t('message:validation-noRelationForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-relasjonType'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodErrors : boolean = validatePeriod(v, t, {
    period: familierelasjon.periode,
    index,
    namespace: namespace + idx + '-periode',
    personName
  })
  hasErrors = hasErrors || periodErrors

  if (familierelasjon.relasjonType === 'ANNEN') {
    if (_.isEmpty(familierelasjon?.annenRelasjonPersonNavn?.trim())) {
      v[namespace + idx + '-annenRelasjonPersonNavn'] = {
        feilmelding: t('message:validation-noNameToPerson', { person: personName }),
        skjemaelementId: namespace + idx + '-annenRelasjonPersonNavn'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(familierelasjon?.annenRelasjonDato?.trim())) {
      v[namespace + idx + '-annenRelasjonDato'] = {
        feilmelding: t('message:validation-noRelationDateForPerson', { person: personName }),
        skjemaelementId: namespace + idx + '-annenRelasjonDato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(familierelasjon?.borSammen?.trim())) {
      v[namespace + idx + '-borSammen'] = {
        feilmelding: t('message:validation-noBoSammen', { person: personName }),
        skjemaelementId: namespace + idx + '-borSammen'
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

export const validateFamilierelasjoner = (
  validation: Validation,
  t: TFunction,
  familierelasjoner: Array<FamilieRelasjon>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon, index: number) => {
    const _errors : boolean = validateFamilierelasjon(validation, t, {
      familierelasjon,
      index,
      namespace,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
