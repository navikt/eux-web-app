import { validatePeriod } from 'components/Period/validation'
import { NavnOgBetegnelse, Motregning as IMotregning, ReplySed, Barn, F002Sed } from 'declarations/sed'
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
  motregning: IMotregning,
  type: string,
  namespace: string,
  formalName: string
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(motregning?.svarType?.trim())) {
    v[namespace + '-svarType'] = {
      feilmelding: t('message:validation-noAnswerForPerson', { person: formalName }),
      skjemaelementId: namespace + '-svarType'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.barnetsNavn?.trim())) {
    v[namespace + '-barnetsNavn'] = {
      feilmelding: t('message:validation-noNameForPerson', { person: formalName }),
      skjemaelementId: namespace + '-barnetsNavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.ytelseNavn?.trim())) {
    v[namespace + '-ytelseNavn'] = {
      feilmelding: t('message:validation-noYtelseTilPerson', { person: formalName }),
      skjemaelementId: namespace + '-ytelseNavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

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
        feilmelding: t('message:validation-invalidBeløpForPerson', { person: formalName })
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

  if (_.isEmpty(motregning?.utbetalingshyppighet?.trim())) {
    v[namespace + '-utbetalingshyppighet'] = {
      feilmelding: t('message:validation-noAvgrensingForPerson', { person: formalName }),
      skjemaelementId: namespace + '-utbetalingshyppighet'
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

  if (_.isEmpty(motregning?.begrunnelse?.trim())) {
    v[namespace + '-begrunnelse'] = {
      feilmelding: t('message:validation-noGrunnForPerson', { person: formalName }),
      skjemaelementId: namespace + '-begrunnelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (motregning?.begrunnelse.trim().length > 500) {
      v[namespace + '-begrunnelse'] = {
        feilmelding: t('message:validation-textOver500TilPerson', { person: formalName }),
        skjemaelementId: namespace + '-begrunnelse'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (motregning?.ytterligereInfo?.trim()?.length > 500) {
    v[namespace + '-ytterligereInfo'] = {
      feilmelding: t('message:validation-textOver500TilPerson', { person: formalName }),
      skjemaelementId: namespace + '-ytterligereInfo'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateMotregninger = (
  v: Validation,
  t: TFunction,
  replySed: ReplySed,
  namespace: string,
  formalName: string
): boolean => {
  let hasErrors: boolean = false;

  (replySed as F002Sed).barn?.forEach((b: Barn) => {
    if (!_.isNil(b.motregning)) {
      const answer = validateMotregning(v, t, b.motregning, 'barna', namespace, formalName)
      hasErrors = hasErrors || answer
    }
  })

  if (!_.isNil((replySed as F002Sed).familie?.motregning)) {
    const answer = validateMotregning(v, t, (replySed as F002Sed).familie?.motregning!, 'familie', namespace, formalName)
    hasErrors = hasErrors || answer
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
