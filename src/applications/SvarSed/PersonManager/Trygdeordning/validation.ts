import { validatePeriod } from 'components/Period/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationDekkedePeriodeProps {
  periode: Periode,
  index: number,
  namespace: string,
  personName: string
}

export interface ValidationUdekkedePeriodeProps {
  periode: Periode,
  index: number,
  namespace: string,
  personName: string
}

export interface ValidationFamilieytelsePeriodeProps {
  periode: PensjonPeriode,
  index: number,
  namespace: string,
  sedCategory: string,
  personName: string
}

const validateGenericPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps,
  pageCategory: string,
  sedCategory: string
): boolean => {
  let hasErrors: boolean = false
  const extraNamespace = namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']')

  let periodError: boolean = validatePeriod(
    v,
    t,
    {
      period: periode,
      index: index,
      namespace: extraNamespace,
      personName: personName
    }
  )
  hasErrors = hasErrors || periodError

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

export const validateDekkedePeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  return validateGenericPeriode(v, t, {
    periode,
    index,
    namespace,
    personName
  },
  'dekkede', 'perioderMedITrygdeordning')
}

export const validateUdekkedePeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  return validateGenericPeriode(v, t, {
    periode,
    index,
    namespace,
    personName
  },
  'udekkede', 'perioderUtenforTrygdeordning')
}

export const validateFamilieytelserPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index,
    namespace,
    sedCategory,
    personName
  }: ValidationFamilieytelsePeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const extraNamespace = namespace + '-' + (index < 0 ? 'familieYtelse' : sedCategory  + '[' + index + ']')

  let periodError: boolean = validatePeriod(
    v,
    t,
    {
      period: periode.periode,
      index: index,
      namespace: extraNamespace,
      personName: personName
    }
  )
  hasErrors = hasErrors || periodError

  if (!_.isEmpty(periode.pensjonstype)) {
    v[extraNamespace + '-pensjontype'] = {
      feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
      skjemaelementId: extraNamespace + '-pensjontype'
    } as FeiloppsummeringFeil
    hasErrors = true
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

export const validatePerioder = (
  v: Validation,
  t: TFunction,
  sedCategory: string,
  pageCategory: string,
  perioder: Array<Periode | PensjonPeriode>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    let _error: boolean
    if (sedCategory === 'perioderMedPensjon') {
      _error = validateFamilieytelserPeriode(v, t, { periode: (periode as PensjonPeriode), index, namespace, sedCategory, personName })
    } else {
      _error = validateGenericPeriode(v, t, { periode: (periode as Periode), index, namespace, personName }, pageCategory, sedCategory)
    }
    hasErrors = hasErrors || _error
  })
  return hasErrors
}

export const validateTrygdeordninger = (
  v: Validation,
  t: TFunction,
  perioderMap: {[k in string]: Array<Periode | PensjonPeriode>},
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  _error = validatePerioder(v, t, 'perioderMedITrygdeordning', 'dekkede', perioderMap.perioderMedITrygdeordning, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderUtenforTrygdeordning', 'udekkede', perioderMap.perioderUtenforTrygdeordning, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedArbeid', 'familieYtelse', perioderMap.perioderMedArbeid, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedTrygd', 'familieYtelse', perioderMap.perioderMedTrygd, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedYtelser', 'familieYtelse', perioderMap.perioderMedYtelser, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedPensjon', 'familieYtelse', perioderMap.perioderMedPensjon, namespace, personName)
  hasErrors = hasErrors || _error
  return hasErrors
}
