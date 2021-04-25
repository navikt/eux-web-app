import { validatePeriod } from 'components/Period/validation'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationGrunnlagForBosettingProps {
  period: Periode
  otherPeriods: Array<Periode>
  index: number
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateGrunnlagForBosetting = (
  v: Validation,
  t: TFunction,
  {
    period,
    otherPeriods,
    index,
    namespace
  }: ValidationGrunnlagForBosettingProps
): boolean => {
  const idx = getIdx(index)

  let hasErrors = validatePeriod(v, t, {
    period,
    index,
    namespace: namespace + '-perioder' + idx
  })
  if (!v[namespace + '-perioder' + idx + '-startdato'] &&
    _.find(otherPeriods, p => p.startdato === period.startdato)) {
    v[namespace + '-perioder' + idx + '-startdato'] = {
      skjemaelementId: namespace + '-perioder' + idx + '-startdato',
      feilmelding: t('message:validation-duplicateStartDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateAllGrunnlagForBosetting = (
  v: Validation,
  t: TFunction,
  flyttegrunn: Flyttegrunn,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false

  flyttegrunn.perioder.forEach((periode: Periode, index: number) => {
    const periodErrors : boolean = validatePeriod(v, t, {
      period: periode,
      index,
      namespace: namespace
    })
    hasErrors = hasErrors || periodErrors
  })

  if (!_.isEmpty(flyttegrunn.datoFlyttetTilAvsenderlandet) && !flyttegrunn.datoFlyttetTilAvsenderlandet.match(datePattern)) {
    v[namespace + '-datoFlyttetTilAvsenderlandet'] = {
      skjemaelementId: namespace + '-datoFlyttetTilAvsenderlandet',
      feilmelding: t('message:validation-invalidDateForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(flyttegrunn.datoFlyttetTilMottakerlandet) && !flyttegrunn.datoFlyttetTilMottakerlandet.match(datePattern)) {
    v[namespace + '-datoFlyttetTilMottakerlandet'] = {
      skjemaelementId: namespace + '-datoFlyttetTilMottakerlandet',
      feilmelding: t('message:validation-invalidDateForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(flyttegrunn.personligSituasjon) && flyttegrunn.personligSituasjon.length > 500) {
    v[namespace + '-personligSituasjon'] = {
      skjemaelementId: namespace + '-personligSituasjon',
      feilmelding: t('message:Det har for mye tekst', { person: personName })
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
