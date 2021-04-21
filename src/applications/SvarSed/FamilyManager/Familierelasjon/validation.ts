import { validatePeriod } from 'components/Period/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
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
): void => {
  let value: FeiloppsummeringFeil | undefined
  let generalFail: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  validatePeriod(v, t, {
    period: familierelasjon.periode,
    index,
    namespace
  })

  if (v[namespace + idx + '-startdato']) {
    generalFail = true
  }

  if (familierelasjon.relasjonType === 'ANNEN') {
    value = (familierelasjon.annenRelasjonPersonNavn)
      ? undefined
      : {
        feilmelding: t('message:validation-noNameToPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-annenrelasjonpersonnavn-text'
      } as FeiloppsummeringFeil
    v[namespace + idx + '-annenrelasjonpersonnavn'] = value
    if (value) {
      generalFail = true
    }

    value = (familierelasjon.annenRelasjonDato)
      ? undefined
      : {
        feilmelding: t('message:validation-noRelationDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-annenrelasjondato-date'
      } as FeiloppsummeringFeil
    v[namespace + idx + '-annenrelasjondato'] = value
    if (value) {
      generalFail = true
    }

    value = (familierelasjon.borSammen)
      ? undefined
      : {
        feilmelding: t('message:validation-noBoSammen', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-borsammen-text'
      } as FeiloppsummeringFeil
    v[namespace + idx + '-borsammen'] = value
    if (value) {
      generalFail = true
    }
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

export const validateFamilierelasjoner = (
  validation: Validation,
  t: TFunction,
  familierelasjoner: Array<FamilieRelasjon>,
  namespace: string,
  personName: string
): void => {
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon, index: number) => {
    validateFamilierelasjon(validation, t, {
      familierelasjon,
      index,
      namespace,
      personName
    })
  })
}
