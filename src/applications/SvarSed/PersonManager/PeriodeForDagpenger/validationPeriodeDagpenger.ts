import { validatePeriode } from 'components/Forms/validation'
import { PeriodeDagpenger } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeDagpengerProps {
  periodeDagpenger: PeriodeDagpenger,
  perioderDagpenger: Array<PeriodeDagpenger>,
  index?: number
  namespace: string
}

export const validatePeriodeDagpenger = (
  v: Validation,
  t: TFunction,
  {
    periodeDagpenger,
    perioderDagpenger,
    index,
    namespace
  }: ValidationPeriodeDagpengerProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriode(v, t, {
    periode: periodeDagpenger?.periode,
    namespace: namespace + '-periode'
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeDagpenger?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderDagpenger, p => p.periode.startdato === periodeDagpenger?.periode.startdato && p.periode.sluttdato === periodeDagpenger.periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeDagpenger> = _.filter(perioderDagpenger, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.periode.startdato === periodeDagpenger?.periode?.startdato && p.periode.sluttdato === periodeDagpenger.periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-periode-startdato'] = {
        feilmelding: t('validation:duplicateStartdato'),
        skjemaelementId: namespace + idx + '-periode-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(periodeDagpenger?.institusjon.id.trim())) {
    v[namespace + idx + '-institusjon-id'] = {
      feilmelding: t('validation:noInstitusjonsID'),
      skjemaelementId: namespace + idx + '-institusjon-id'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeDagpenger?.institusjon.navn.trim())) {
    v[namespace + idx + '-institusjon-navn'] = {
      feilmelding: t('validation:noInstitusjonensNavn'),
      skjemaelementId: namespace + idx + '-institusjon-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(periodeDagpenger?.institusjon.idmangler?.navn?.trim())) {
    if (periodeDagpenger?.institusjon.idmangler?.navn?.trim() === '-') {
      v[namespace + idx + '-institusjon-idmangler-navn'] = {
        feilmelding: t('validation:noName'),
        skjemaelementId: namespace + idx + '-institusjon-idmangler-navn'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(periodeDagpenger?.institusjon.idmangler?.adresse?.land?.trim())) {
      v[namespace + idx + '-institusjon-idmangler-adresse-land'] = {
        feilmelding: t('validation:noAddressCountry'),
        skjemaelementId: namespace + idx + '-institusjon-idmangler-adresse-land'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(periodeDagpenger?.institusjon.idmangler?.adresse?.gate?.trim())) {
      v[namespace + idx + '-institusjon-idmangler-adresse-gate'] = {
        feilmelding: t('validation:noAddressStreet'),
        skjemaelementId: namespace + idx + '-institusjon-idmangler-adresse-gate'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(periodeDagpenger?.institusjon.idmangler?.adresse?.postnummer?.trim())) {
      v[namespace + idx + '-institusjon-idmangler-adresse-postnummer'] = {
        feilmelding: t('validation:noAddressPostnummer'),
        skjemaelementId: namespace + idx + '-institusjon-idmangler-adresse-postnummer'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if (_.isEmpty(periodeDagpenger?.institusjon.idmangler?.adresse?.by?.trim())) {
      v[namespace + idx + '-institusjon-idmangler-adresse-by'] = {
        feilmelding: t('validation:noAddressCity'),
        skjemaelementId: namespace + idx + '-institusjon-idmangler-adresse-by'
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

interface ValidatePerioderDagpengerProps {
  perioderDagpenger: Array<PeriodeDagpenger> | undefined
  namespace: string
}

export const validatePerioderDagpenger = (
  validation: Validation,
  t: TFunction,
  {
    perioderDagpenger,
    namespace
  }: ValidatePerioderDagpengerProps
): boolean => {
  let hasErrors: boolean = false
  perioderDagpenger?.forEach((periodeDagpenger: PeriodeDagpenger, index: number) => {
    const _errors: boolean = validatePeriodeDagpenger(validation, t, {
      periodeDagpenger: periodeDagpenger,
      perioderDagpenger: perioderDagpenger,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
