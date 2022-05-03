import { validatePeriode } from 'components/Forms/validation'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'

export interface ValidationGrunnlagForBosettingProps {
  periode: Periode
  perioder: Array<Periode> | undefined
  index?: number
  namespace: string
  personName?: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateGrunnlagForBosetting = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    namespace,
    personName
  }: ValidationGrunnlagForBosettingProps
): boolean => {
  let hasErrors = validatePeriode(v, t, {
    periode,
    namespace,
    personName
  })
  if (!_.isEmpty(periode?.startdato)) {
    const duplicate: boolean = _.find(perioder, p => p.startdato === periode?.startdato) !== undefined
    if (duplicate) {
      v[namespace + '-perioder-startdato'] = {
        feilmelding: t('validation:duplicateStartdato') + (personName ? t('validation:til-person', { person: personName }) : ''),
        skjemaelementId: namespace + 'perioder-startdato'
      } as ErrorElement
      hasErrors = true
    }
  }
  return hasErrors
}

interface ValidateAllGrunnlagForBosettingProps {
  flyttegrunn: Flyttegrunn
  namespace: string
  personName?: string
}

export const validateAllGrunnlagForBosetting = (
  v: Validation,
  t: TFunction,
  {
    flyttegrunn,
    namespace,
    personName
  }: ValidateAllGrunnlagForBosettingProps
): boolean => {
  let hasErrors: boolean = false

  flyttegrunn?.perioder?.forEach((periode: Periode, index: number) => {
    const periodErrors : boolean = validatePeriode(v, t, {
      periode,
      index,
      namespace: namespace + '-perioder',
      personName
    })
    hasErrors = hasErrors || periodErrors
  })

  if (!_.isEmpty(flyttegrunn?.datoFlyttetTilAvsenderlandet) && !flyttegrunn?.datoFlyttetTilAvsenderlandet.match(datePattern)) {
    v[namespace + '-datoFlyttetTilAvsenderlandet'] = {
      skjemaelementId: namespace + '-datoFlyttetTilAvsenderlandet',
      feilmelding: t('validation:invalidDate') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(flyttegrunn?.datoFlyttetTilMottakerlandet) && !flyttegrunn?.datoFlyttetTilMottakerlandet.match(datePattern)) {
    v[namespace + '-datoFlyttetTilMottakerlandet'] = {
      skjemaelementId: namespace + '-datoFlyttetTilMottakerlandet',
      feilmelding: t('validation:invalidDate') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(flyttegrunn?.personligSituasjon) && flyttegrunn?.personligSituasjon!.length > 500) {
    v[namespace + '-personligSituasjon'] = {
      skjemaelementId: namespace + '-personligSituasjon',
      feilmelding: t('validation:textOverX', { x: 500 }) + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
