import { validatePeriod } from 'components/Period/validation'
import { FormalMotregning, NavnOgBetegnelse } from 'declarations/sed'
import { TFunction } from 'react-i18next'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'

export interface ValidationMotregningNavnOgBetegnelserProps {
  navnOgBetegnelse: NavnOgBetegnelse
  index?: number
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

  if (_.isEmpty(navnOgBetegnelse?.navn?.trim())) {
    v[namespace + '-navnOgBetegnelser' + idx + '-navn'] = {
      feilmelding: t('message:validation-noNavn'),
      skjemaelementId: namespace + '-navnOgBetegnelser' + idx + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(navnOgBetegnelse?.betegnelsePåYtelse?.trim())) {
    v[namespace + '-navnOgBetegnelser' + idx + '-betegnelsePåYtelse'] = {
      feilmelding: t('message:validation-noBetegnelsePåYtelse'),
      skjemaelementId: namespace + '-navnOgBetegnelser' + idx + '-betegnelsePåYtelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateMotregning = (
  v: Validation,
  t: TFunction,
  motregning: FormalMotregning = { } as any,
  namespace: string,
  formalName: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(motregning?.anmodningEllerSvar?.trim())) {
    v[namespace + '-anmodningEllerSvar'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: formalName }),
      skjemaelementId: namespace + '-anmodningEllerSvar'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  motregning.navnOgBetegnelser?.forEach((navnOgBetegnelse: NavnOgBetegnelse, index: number) => {
    const _error: boolean = validateMotregningNavnOgBetegnelser(v, t, { navnOgBetegnelse, index, namespace: namespace + '-navnOgBetegnelser' })
    hasErrors = hasErrors || _error
  })

  if (_.isEmpty(motregning?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      feilmelding: t('message:validation-noBeløpForPerson', { person: formalName }),
      skjemaelementId: namespace + '-beloep'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!motregning?.beloep?.trim().match(/^\d+$/)) {
      v[namespace + '-beloep'] = {
        skjemaelementId: namespace + '-beloep',
        feilmelding: t('message:validation-invalidBeløpForPerson', {person: formalName})
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(motregning?.valuta?.trim())) {
    v[namespace + '-valuta'] = {
      feilmelding: t('message:validation-noValutaForPerson', { person: formalName }),
      skjemaelementId: namespace + '-valuta'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodError: boolean = validatePeriod(v, t, {
    period: {
      startdato: motregning.startdato,
      sluttdato: motregning.sluttdato
    },
    namespace: namespace,
    personName: formalName
  })
  hasErrors = hasErrors || periodError

  if (_.isEmpty(motregning?.avgrensing?.trim())) {
    v[namespace + '-avgrensing'] = {
      feilmelding: t('message:validation-noAvgrensingForPerson', { person: formalName }),
      skjemaelementId: namespace + '-avgrensing'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.mottakersNavn?.trim())) {
    v[namespace + '-mottakersNavn'] = {
      feilmelding: t('message:validation-noMottakersNavnForPerson', { person: formalName }),
      skjemaelementId: namespace + '-mottakersNavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.grunnerTilAnmodning?.trim())) {
    v[namespace + '-grunnerTilAnmodning'] = {
      feilmelding: t('message:validation-noGrunnForPerson', { person: formalName }),
      skjemaelementId: namespace + '-grunnerTilAnmodning'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
