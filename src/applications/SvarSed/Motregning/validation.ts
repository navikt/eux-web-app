import { validatePeriod } from 'components/Period/validation'
import { FormalMotregning, NavnOgBetegnelse } from 'declarations/sed'
import { TFunction } from 'react-i18next'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import _ from 'lodash'

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
  const idx = (index < 0 ? '' : '[' + index + ']')

  if (_.isEmpty(navnOgBetegnelse.navn)) {
    v[namespace + '-navn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: 'c-' + namespace + idx + '-navn-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(navnOgBetegnelse.betegnelsePåYtelse)) {
    v[namespace + '-betegnelsepåytelse'] = {
      feilmelding: t('message:validation-noBetegnelsePåYtelse'),
      skjemaelementId: 'c-' + namespace + idx + '-betegnelsepåytelse-text'
    } as FeiloppsummeringFeil
    hasErrors = false
  }
  return hasErrors
}

export const validateMotregning = (
  v: Validation,
  t: TFunction,
  motregning: FormalMotregning,
  namespace: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(motregning.anmodningEllerSvar)) {
    v[namespace + '-anmodningEllerSvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson'),
      skjemaelementId: 'c-' + namespace + '-anmodningEllerSvar-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  motregning.navnOgBetegnelser?.forEach((navnOgBetegnelse: NavnOgBetegnelse, index: number) => {
    hasErrors = hasErrors && validateMotregningNavnOgBetegnelser(v, t, { navnOgBetegnelse, index, namespace: namespace + '-navnOgBetegnelser' })
  })

  if (_.isEmpty(motregning.beloep)) {
    v[namespace + '-beloep'] = {
      feilmelding: t('message:validation-noBeløp'),
      skjemaelementId: 'c-' + namespace + '-beloep-number'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.valuta)) {
    v[namespace + '-valuta'] = {
      feilmelding: t('message:validation-noValuta'),
      skjemaelementId: 'c-' + namespace + '-valuta-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  hasErrors = hasErrors && validatePeriod(v, t, {
    period: {
      startdato: motregning.startdato,
      sluttdato: motregning.sluttdato
    },
    index: -1,
    namespace
  })

  if (_.isEmpty(motregning.avgrensing)) {
    v[namespace + '-avgrensing'] = {
      feilmelding: t('message:validation-noAvgrensing'),
      skjemaelementId: 'c-' + namespace + '-avgrensing-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.mottakersNavn)) {
    v[namespace + '-mottakersNavn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: 'c-' + namespace + '-mottakersNavn-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.grunnerTilAnmodning)) {
    v[namespace + '-grunnerTilAnmodning'] = {
      feilmelding: t('message:validation-noGrunn'),
      skjemaelementId: 'c-' + namespace + '-grunnerTilAnmodning-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
