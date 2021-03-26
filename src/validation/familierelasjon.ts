import { FamilieRelasjon2 } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateFamilierelasjon = (
  v: Validation,
  familierelasjon: FamilieRelasjon2,
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false

  let value = (familierelasjon.periode.startdato)
    ? undefined
    : {
      feilmelding: t('message:validation-noDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-startdato-date'
    } as FeiloppsummeringFeil
  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-startdato'] = value
  if (value) {
    generalFail = true
  }

  if (familierelasjon.relasjonType === 'other') {
    value = (familierelasjon.annenRelasjonPersonNavn)
      ? undefined
      : {
        feilmelding: t('message:validation-noNameToPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-annenrelasjonpersonnavn-text'
      } as FeiloppsummeringFeil
    v[namespace + (index < 0 ? '' : '[' + index + ']') + '-annenrelasjonpersonnavn'] = value
    if (value) {
      generalFail = true
    }

    value = (familierelasjon.annenRelasjonDato)
      ? undefined
      : {
        feilmelding: t('message:validation-noRelationDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-annenrelasjondato-date'
      } as FeiloppsummeringFeil
    v[namespace + (index < 0 ? '' : '[' + index + ']') + '-annenrelasjondato'] = value
    if (value) {
      generalFail = true
    }

    value = (familierelasjon.borSammen)
      ? undefined
      : {
        feilmelding: t('message:validation-noBoSammen', { person: personName }),
        skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-borsammen-text'
      } as FeiloppsummeringFeil
    v[namespace + (index < 0 ? '' : '[' + index + ']') + '-borsammen'] = value
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
  familierelasjoner: Array<FamilieRelasjon2>,
  t: any,
  namespace: string,
  personName: string
): void => {
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon2, index: number) => {
    validateFamilierelasjon(validation, familierelasjon, index, t, namespace, personName)
  })
}
