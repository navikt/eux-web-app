import { PersonInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface validatePersonOpplysningProps {
  personInfo: PersonInfo,
  namespace: string,
  personName: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePersonOpplysninger = (
  v: Validation,
  t: TFunction,
  {
    personInfo,
    namespace,
    personName
  }: validatePersonOpplysningProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(personInfo?.fornavn?.trim())) {
    v[namespace + '-fornavn'] = {
      feilmelding: t('message:validation-noFornavnForPerson', { person: personName }),
      skjemaelementId: namespace + '-fornavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.etternavn?.trim())) {
    v[namespace + '-etternavn'] = {
      feilmelding: t('message:validation-noEtternavnForPerson', { person: personName }),
      skjemaelementId: namespace + '-etternavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.foedselsdato?.trim())) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('message:validation-noFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: namespace + '-foedselsdato'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!personInfo?.foedselsdato?.trim().match(datePattern)) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('message:validation-invalidFoedselsdatoForPerson', { person: personName }),
      skjemaelementId: namespace + '-foedselsdato'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.kjoenn?.trim())) {
    v[namespace + '-kjoenn'] = {
      feilmelding: t('message:validation-noKjoennForPerson', { person: personName }),
      skjemaelementId: namespace + '-kjoenn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(personInfo.pinMangler)) {
    if (_.isEmpty(personInfo.pinMangler?.foedested?.by?.trim())) {
      v[namespace + '-foedested-by'] = {
        feilmelding: t('message:validation-noFoedestedByForPerson', { person: personName }),
        skjemaelementId: namespace + '-foedested-by'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(personInfo.pinMangler?.foedested?.region?.trim())) {
      v[namespace + '-foedested-region'] = {
        feilmelding: t('message:validation-noFoedestedRegionForPerson', { person: personName }),
        skjemaelementId: namespace + '-foedested-region'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(personInfo.pinMangler?.foedested?.land?.trim())) {
      v[namespace + '-foedested-land'] = {
        feilmelding: t('message:validation-noFoedestedLandForPerson', { person: personName }),
        skjemaelementId: namespace + '-foedested-land'
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
