import { validateAdresse } from 'applications/SvarSed/MainForm/Adresser/validation'
import { validatePeriode } from 'components/Forms/validation'
import { PeriodeDagpenger } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeDagpengerProps {
  periodeDagpenger: PeriodeDagpenger,
  perioderDagpenger: Array<PeriodeDagpenger>,
  index?: number
  namespace: string
  personName?: string
}

export const validatePeriodeDagpenger = (
  v: Validation,
  t: TFunction,
  {
    periodeDagpenger,
    perioderDagpenger,
    index,
    namespace,
    personName
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
      } as ErrorElement
      hasErrors = true
    }
  }

  const idmangler = (
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.navn?.trim()) && periodeDagpenger.institusjon.idmangler?.navn?.trim() !== '-') ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.gate?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.postnummer?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.bygning?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.by?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.region?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.land?.trim())

  if (!idmangler) {
    if (_.isEmpty(periodeDagpenger?.institusjon.id.trim())) {
      v[namespace + idx + '-institusjon-id'] = {
        feilmelding: t('validation:noInstitusjonsID'),
        skjemaelementId: namespace + idx + '-institusjon-id'
      } as ErrorElement
      hasErrors = true
    }

    if (_.isEmpty(periodeDagpenger?.institusjon.navn.trim())) {
      v[namespace + idx + '-institusjon-navn'] = {
        feilmelding: t('validation:noInstitusjonensNavn'),
        skjemaelementId: namespace + idx + '-institusjon-navn'
      } as ErrorElement
      hasErrors = true
    }
  } else {
    if (_.isEmpty(periodeDagpenger?.institusjon.idmangler?.navn?.trim()) || periodeDagpenger?.institusjon.idmangler?.navn?.trim() === '-') {
      v[namespace + idx + '-institusjon-idmangler-navn'] = {
        feilmelding: t('validation:noName'),
        skjemaelementId: namespace + idx + '-institusjon-idmangler-navn'
      } as ErrorElement
      hasErrors = true
    }

    const _error: boolean = validateAdresse(v, t, {
      adresse: periodeDagpenger?.institusjon.idmangler?.adresse,
      namespace: namespace + idx + '-institusjon-idmangler-adresse',
      checkAdresseType: true,
      personName
    })
    hasErrors = hasErrors || _error
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

interface ValidatePerioderDagpengerProps {
  perioderDagpenger: Array<PeriodeDagpenger> | undefined
  namespace: string
  personName?: string
}

export const validatePerioderDagpenger = (
  validation: Validation,
  t: TFunction,
  {
    perioderDagpenger,
    namespace,
    personName
  }: ValidatePerioderDagpengerProps
): boolean => {
  let hasErrors: boolean = false
  perioderDagpenger?.forEach((periodeDagpenger: PeriodeDagpenger, index: number) => {
    const _errors: boolean = validatePeriodeDagpenger(validation, t, {
      periodeDagpenger,
      perioderDagpenger,
      index,
      namespace,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
