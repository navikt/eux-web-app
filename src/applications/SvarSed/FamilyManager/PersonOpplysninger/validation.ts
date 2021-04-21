import { PersonInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export interface validatePersonOpplysningProps {
  personInfo: PersonInfo,
  namespace: string,
  personName: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePersonOpplysning = (
  v: Validation,
  t: any,
  {
    personInfo,
    namespace,
    personName
  }: validatePersonOpplysningProps
): void => {
  let generalFail: boolean = false
  let value: FeiloppsummeringFeil | undefined

  value = (personInfo.fornavn)
    ? undefined
    : {
      feilmelding: t('message:validation-noFornavnForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-fornavn-text'
    } as FeiloppsummeringFeil
  v[namespace + '-fornavn'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.etternavn)
    ? undefined
    : {
      feilmelding: t('message:validation-noEtternavnForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-etternavn-text'
    } as FeiloppsummeringFeil
  v[namespace + '-etternavn'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.foedselsdato)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedselsdato-text'
    } as FeiloppsummeringFeil
  v[namespace + '-foedselsdato'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.foedselsdato.match(datePattern))
    ? undefined
    : {
      feilmelding: t('message:validation-invalidFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedselsdato-text'
    } as FeiloppsummeringFeil
  if (!v[namespace + '-foedselsdato'] && value) {
    v[namespace + '-foedselsdato'] = value
    if (value) {
      generalFail = true
    }
  }

  value = (personInfo.kjoenn)
    ? undefined
    : {
      feilmelding: t('message:validation-noKjoenn', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-kjoenn-text'
    } as FeiloppsummeringFeil
  v[namespace + '-kjoenn'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.pinMangler?.foedested.by)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedestedByForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedested-by-text'
    } as FeiloppsummeringFeil
  v[namespace + '-foedested-by'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.pinMangler?.foedested.region)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedestedRegionForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedested-region-text'
    } as FeiloppsummeringFeil
  v[namespace + '-foedested-region'] = value
  if (value) {
    generalFail = true
  }

  value = (personInfo.pinMangler?.foedested.land)
    ? undefined
    : {
      feilmelding: t('message:validation-noFoedestedLandForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-foedested-land-text'
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
