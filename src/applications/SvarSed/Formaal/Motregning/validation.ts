import { validatePeriod } from 'components/Period/validation'
import { FormalMotregning, NavnOgBetegnelse } from 'declarations/sed'
import { TFunction } from 'react-i18next'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'

export interface ValidationMotregningNavnOgBetegnelserProps {
  navnOgBetegnelse: NavnOgBetegnelse
  index: number
  namespace: string
}

export const validateMotregningNavnOgBetegnelser = (
  v: Validation,
  t: TFunction,
  {
    navnOgBetegnelse,
    index,
    namespace
  }: ValidationMotregningNavnOgBetegnelserProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(navnOgBetegnelse.navn)) {
    v[namespace + '-navnOgBetegnelser' + idx + '-navn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: namespace + '-navnOgBetegnelser' + idx + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(navnOgBetegnelse.betegnelsePåYtelse)) {
    v[namespace + '-navnOgBetegnelser' +  + idx + '-betegnelse'] = {
      feilmelding: t('message:validation-noBetegnelsePåYtelse'),
      skjemaelementId: namespace + '-navnOgBetegnelser' + idx + '-betegnelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateMotregning = (
  v: Validation,
  t: TFunction,
  motregning: FormalMotregning = { } as any ,
  namespace: string
): boolean => {

  let hasErrors: boolean = false

  if (_.isEmpty(motregning.anmodningEllerSvar)) {
    v[namespace + '-anmodningEllerSvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson'),
      skjemaelementId: namespace + '-anmodningEllerSvar'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  motregning.navnOgBetegnelser?.forEach((navnOgBetegnelse: NavnOgBetegnelse, index: number) => {
    let _error: boolean = validateMotregningNavnOgBetegnelser(v, t, { navnOgBetegnelse, index, namespace: namespace + '-navnOgBetegnelser' })
    hasErrors = hasErrors || _error
  })

  if (_.isEmpty(motregning.beloep)) {
    v[namespace + '-beloep'] = {
      feilmelding: t('message:validation-noBeløp'),
      skjemaelementId: namespace + '-beloep'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.valuta)) {
    v[namespace + '-valuta'] = {
      feilmelding: t('message:validation-noValuta'),
      skjemaelementId: namespace + '-valuta'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let periodError: boolean = validatePeriod(v, t, {
    period: {
      startdato: motregning.startdato,
      sluttdato: motregning.sluttdato
    },
    index: -1,
    namespace: namespace
  })
  hasErrors = hasErrors || periodError

  if (_.isEmpty(motregning.avgrensing)) {
    v[namespace + '-avgrensing'] = {
      feilmelding: t('message:validation-noAvgrensing'),
      skjemaelementId: namespace + '-avgrensing'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.mottakersNavn)) {
    v[namespace + '-mottakersNavn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: namespace + '-mottakersNavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.grunnerTilAnmodning)) {
    v[namespace + '-grunnerTilAnmodning'] = {
      feilmelding: t('message:validation-noGrunn'),
      skjemaelementId: namespace + '-grunnerTilAnmodning'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
