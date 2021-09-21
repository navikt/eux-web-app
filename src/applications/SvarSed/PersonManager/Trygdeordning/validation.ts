import { validatePeriod } from 'components/Period/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationDekkedePeriodeProps {
  periode: Periode,
  perioder: Array<Periode>,
  index?: number,
  namespace: string,
  personName: string
}

export interface ValidationUdekkedePeriodeProps {
  periode: Periode,
  perioder: Array<Periode>,
  index?: number,
  namespace: string,
  personName: string
}

export interface ValidationFamilieytelsePeriodeProps {
  periode: Periode | PensjonPeriode,
  perioder: Array<Periode | PensjonPeriode>
  index?: number,
  namespace: string,
  sedCategory: string,
  personName: string
}

const validateGenericPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps,
  pageCategory: string,
  sedCategory: string
): boolean => {
  let hasErrors: boolean = false
  const extraNamespace = namespace + '-' + (!_.isNil(index) && index >= 0 ? sedCategory : pageCategory)

  const periodError: boolean = validatePeriod(
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
  const idx = getIdx(index)

  if (!_.isEmpty(periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<Periode> = _.filter(perioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[extraNamespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdatoForPerson', { person: personName }),
        skjemaelementId: namespace + idx + '-startdato'
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

export const validateDekkedePeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  return validateGenericPeriode(v, t, {
    periode,
    perioder,
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
    perioder,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  return validateGenericPeriode(v, t, {
    periode,
    perioder,
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
    perioder,
    index,
    namespace,
    sedCategory,
    personName
  }: ValidationFamilieytelsePeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)
  const extraNamespace = namespace + '-' + (!_.isNil(index) && index >= 0 ? sedCategory : 'familieYtelse') + idx
  let extraperiodeNamespace = extraNamespace
  if (sedCategory === 'perioderMedPensjon' && !_.isNil(index) && index >= 0) {
    extraperiodeNamespace += '-periode'
  }
  const period = sedCategory === 'perioderMedPensjon' ? (periode as PensjonPeriode).periode : (periode as Periode)

  const periodError: boolean = validatePeriod(
    v,
    t,
    {
      period: period,
      namespace: extraperiodeNamespace,
      personName: personName
    }
  )
  hasErrors = hasErrors || periodError

  let duplicate: boolean
  if (_.isNil(index)) {
    if (sedCategory === 'perioderMedPensjon') {
      duplicate = _.find(perioder, (p: PensjonPeriode) => p.periode.startdato === period.startdato && p.periode.sluttdato === period.sluttdato) !== undefined
    } else {
      duplicate = _.find(perioder, (p: Periode) => p.startdato === period.startdato && p.sluttdato === period.sluttdato) !== undefined
    }
  } else {
    if (sedCategory === 'perioderMedPensjon') {
      if (_.isNil(index)) {
        duplicate = _.find(perioder, (p: PensjonPeriode) => p.periode.startdato === period?.startdato && p.periode.sluttdato === period.sluttdato) !== undefined
      } else {
        const otherPensjonPerioder: Array<PensjonPeriode> = _.filter(perioder, (p, i: number) => i !== index) as Array<PensjonPeriode>
        duplicate = _.find(otherPensjonPerioder, p => p.periode.startdato === period.startdato && p.periode.sluttdato === period.sluttdato) !== undefined
      }
    } else {
      if (_.isNil(index)) {
        duplicate = _.find(perioder, (p: Periode) => p.startdato === period?.startdato && p.sluttdato === period?.sluttdato) !== undefined
      } else {
        const otherPensjonPerioder: Array<Periode> = _.filter(perioder, (p, i: number) => i !== index) as Array<Periode>
        duplicate = _.find(otherPensjonPerioder, p => p.startdato === period.startdato && p.sluttdato === period.sluttdato) !== undefined
      }
    }
  }
  if (duplicate) {
    v[extraperiodeNamespace + '-startdato'] = {
      feilmelding: t('message:validation-duplicateStartdatoForPerson', { person: personName }),
      skjemaelementId: extraperiodeNamespace + '-startdato'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (sedCategory === 'perioderMedPensjon') {
    if (_.isEmpty((periode as PensjonPeriode).pensjonstype)) {
      v[extraNamespace + '-pensjonstype'] = {
        feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
        skjemaelementId: extraNamespace + '-pensjonstype'
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
      _error = validateFamilieytelserPeriode(v, t, { periode: (periode as PensjonPeriode), perioder: (perioder as Array<PensjonPeriode>), index, namespace, sedCategory, personName })
    } else {
      _error = validateGenericPeriode(v, t, { periode: (periode as Periode), perioder: (perioder as Array<Periode>), index, namespace, personName }, pageCategory, sedCategory)
    }
    hasErrors = hasErrors || _error
  })
  return hasErrors
}

interface ValidateTrygdeordningerProps {
  perioder: {[k in string]: Array<Periode | PensjonPeriode>}
  namespace: string
  personName: string
}

export const validateTrygdeordninger = (
  v: Validation,
  t: TFunction,
  {
    perioder,
    namespace,
    personName
  } : ValidateTrygdeordningerProps
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  _error = validatePerioder(v, t, 'perioderMedITrygdeordning', 'dekkede', perioder.perioderMedITrygdeordning, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderUtenforTrygdeordning', 'udekkede', perioder.perioderUtenforTrygdeordning, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedArbeid', 'familieYtelse', perioder.perioderMedArbeid, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedTrygd', 'familieYtelse', perioder.perioderMedTrygd, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedYtelser', 'familieYtelse', perioder.perioderMedYtelser, namespace, personName)
  hasErrors = hasErrors || _error
  _error = validatePerioder(v, t, 'perioderMedPensjon', 'familieYtelse', perioder.perioderMedPensjon, namespace, personName)
  hasErrors = hasErrors || _error
  return hasErrors
}
