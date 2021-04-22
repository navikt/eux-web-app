import { validatePeriod } from 'components/Period/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
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
): void => {
  let generalFail: boolean = false
  const extraNamespace = namespace + '-' + (index < 0 ? pageCategory : sedCategory)
  const idx = (index < 0 ? '' : '[' + index + ']')

  validatePeriod(
    v,
    t,
    {
      period: periode,
      index: index,
      namespace: extraNamespace,
      personName: personName
    }
  )

  if (v[extraNamespace + idx + '-startdato'] || v[extraNamespace + idx + '-sluttdato']) {
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

export const validateDekkedePeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index,
    namespace,
    personName
  }: ValidationDekkedePeriodeProps
): void => {
  validateGenericPeriode(v, t, {
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
): void => {
  validateGenericPeriode(v, t, {
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
): void => {
  let generalFail: boolean = false
  const extraNamespace = namespace + '-' + (index < 0 ? 'familieYtelse' : sedCategory)
  const idx = (index < 0 ? '' : '[' + index + ']')

  validatePeriod(
    v,
    t,
    {
      period: periode.periode,
      index: index,
      namespace: extraNamespace,
      personName: personName
    }
  )

  if (v[extraNamespace + idx + '-startdato'] || v[extraNamespace + idx + '-sluttdato']) {
    generalFail = true
  }

  const value: FeiloppsummeringFeil | undefined = periode.pensjonstype
    ? undefined
    : {
      feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
      skjemaelementId: 'c-' + extraNamespace + idx + '-pensjonstype-text'
    } as FeiloppsummeringFeil
  v[namespace + extraNamespace + idx + '-pensjonstype'] = value
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

export const validatePerioder = (
  v: Validation,
  t: TFunction,
  sedCategory: string,
  pageCategory: string,
  perioder: Array<Periode | PensjonPeriode>,
  namespace: string,
  personName: string
): void => {
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    if (sedCategory === 'perioderMedPensjon') {
      validateFamilieytelserPeriode(v, t, { periode: (periode as PensjonPeriode), index, namespace, sedCategory, personName })
    } else {
      validateGenericPeriode(v, t, { periode: (periode as Periode), index, namespace, personName }, pageCategory, sedCategory)
    }
  })
}

export const validateTrygdeordninger = (
  v: Validation,
  t: TFunction,
  perioderMap: {[k in string]: Array<Periode | PensjonPeriode>},
  namespace: string,
  personName: string
): void => {
  validatePerioder(v, t, 'perioderMedITrygdeordning', 'dekkede', perioderMap.perioderMedITrygdeordning, namespace, personName)
  validatePerioder(v, t, 'perioderUtenforTrygdeordning', 'udekkede', perioderMap.perioderUtenforTrygdeordning, namespace, personName)
  validatePerioder(v, t, 'perioderMedArbeid', 'familieYtelse', perioderMap.perioderMedArbeid, namespace, personName)
  validatePerioder(v, t, 'perioderMedTrygd', 'familieYtelse', perioderMap.perioderMedTrygd, namespace, personName)
  validatePerioder(v, t, 'perioderMedYtelser', 'familieYtelse', perioderMap.perioderMedYtelser, namespace, personName)
  validatePerioder(v, t, 'perioderMedPensjon', 'familieYtelse', perioderMap.perioderMedPensjon, namespace, personName)
}
