import { validatePeriod } from 'components/Period/validation'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

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
): void => {
  const idx = (index < 0 ? '' : '[' + index + ']')

  validatePeriod(v, t, {
    period,
    index,
    namespace
  })

  if (!v[namespace + '-startdato'] &&
    _.find(otherPeriods, p => p.startdato === period.startdato)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: t('message:validation-duplicateStartDate')
    } as FeiloppsummeringFeil
  }
}

export const validateAllGrunnlagForBosetting = (
  v: Validation,
  t: TFunction,
  flyttegrunn: Flyttegrunn,
  namespace: string,
  personName: string
) => {
  let generalFail: boolean = false

  flyttegrunn.perioder.forEach((periode: Periode, index: number) => {
    const idx = (index < 0 ? '' : '[' + index + ']')
    validatePeriod(v, t, {
      period: periode,
      index,
      namespace: namespace + '-periode' + idx
    })
    if (v[namespace + '-periode' + idx + '-startdato'] || v[namespace + '-periode' + idx + '-sluttdato']) {
      generalFail = true
    }
  })

  if (!_.isEmpty(flyttegrunn.datoFlyttetTilAvsenderlandet) && !flyttegrunn.datoFlyttetTilAvsenderlandet.match(datePattern)) {
    v[namespace + '-avsenderdato'] = {
      skjemaelementId: 'c-' + namespace + '-avsenderdato-date',
      feilmelding: t('message:validation-invalidDateForPerson', { person: personName })
    } as FeiloppsummeringFeil
  }

  if (!_.isEmpty(flyttegrunn.datoFlyttetTilMottakerlandet) && !flyttegrunn.datoFlyttetTilMottakerlandet.match(datePattern)) {
    v[namespace + '-mottakerdato'] = {
      skjemaelementId: 'c-' + namespace + '-mottakerdato-date',
      feilmelding: t('message:validation-invalidDateForPerson', { person: personName })
    } as FeiloppsummeringFeil
  }

  if (!_.isEmpty(flyttegrunn.personligSituasjon) && flyttegrunn.personligSituasjon.length > 500) {
    v[namespace + '-personligSituasjon'] = {
      skjemaelementId: 'c-' + namespace + '-personligSituasjon-text',
      feilmelding: t('message:Det har for mye tekst', { person: personName })
    } as FeiloppsummeringFeil
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
