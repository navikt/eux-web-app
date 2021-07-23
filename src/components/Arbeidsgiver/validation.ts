import { PeriodeMedForsikring } from 'declarations/sed'
import { Arbeidsgiver, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getNavn, getOrgnr, getSluttDato, getStartDato } from 'utils/arbeidsgiver'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: Arbeidsgiver | PeriodeMedForsikring
  namespace: string
  includeAddress: boolean
}

export const validateArbeidsgiver = (
  v: Validation,
  t: TFunction,
  {
    arbeidsgiver,
    namespace,
    includeAddress
  }: ValidationArbeidsgiverProps
): boolean => {
  let hasErrors: boolean = false

  const navn: string | undefined = getNavn(arbeidsgiver, includeAddress)
  const orgnr: string | undefined = getOrgnr(arbeidsgiver, includeAddress)
  const startDato: string | undefined = getStartDato(arbeidsgiver, includeAddress)
  const sluttDato: string | undefined = getSluttDato(arbeidsgiver, includeAddress)

  if (_.isEmpty(navn?.trim())) {
    v[namespace + '-navn'] = {
      skjemaelementId: namespace + '-navn',
      feilmelding: t('message:validation-noNavn')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(orgnr?.trim())) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: namespace + '-orgnr',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(startDato?.trim())) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(startDato) && !(startDato!.trim().match(datePattern))) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(sluttDato) && !(sluttDato!.trim().match(datePattern))) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (includeAddress) {
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.gate)) {
      v[namespace + '-gateadresse'] = {
        skjemaelementId: namespace + '-gateadresse',
        feilmelding: t('message:validation-noAddressStreet')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer)) {
      v[namespace + '-postnummer'] = {
        skjemaelementId: namespace + '-postnummer',
        feilmelding: t('message:validation-noAddressPostnummer')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by)) {
      v[namespace + '-by'] = {
        skjemaelementId: namespace + '-by',
        feilmelding: t('message:validation-noAddressCity')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land)) {
      v[namespace + '-land'] = {
        skjemaelementId: namespace + '-land',
        feilmelding: t('message:validation-noAddressLand')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  return hasErrors
}
