import { PersonInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validatePersonOpplysning = (
  v: Validation,
  personInfo: PersonInfo,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false

  let value = (personInfo.fornavn)
    ? undefined
    : {
      feilmelding: t('message:validation-noFornavnForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-fornavn-input'
    } as FeiloppsummeringFeil
  v[namespace + '-fornavn'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.etternavn)
    ? undefined
    : {
      feilmelding: t('message:validation-noEtternavnForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-etternavn-input'
    } as FeiloppsummeringFeil
  v[namespace + '-etternavn'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.foedselsdato)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedselsdato-input'
    } as FeiloppsummeringFeil
  v[namespace + '-foedselsdato'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.kjoenn)
    ? undefined
    : {
      feilmelding: t('message:validation-noKjoenn', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-kjoenn-radiogroup'
    } as FeiloppsummeringFeil
  v[namespace + '-kjoenn'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.pinMangler?.foedested.by)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedestedByForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedested-by-input'
    } as FeiloppsummeringFeil
  v[namespace + '-foedested-by'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.pinMangler?.foedested.region)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedestedRegionForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedested-region-input'
    } as FeiloppsummeringFeil
  v[namespace + '-foedested-region'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.pinMangler?.foedested.land)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedestedLandForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedested-land-countryselect'
    } as FeiloppsummeringFeil
  v[namespace + '-foedested-land'] = value
  if (value) {
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
