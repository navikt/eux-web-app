import { KeyAndYtelse } from './KeyAndYtelse'
import { validatePeriode } from 'components/Forms/validation'
import { Motregning as IMotregning, ReplySed, Barn, F002Sed, BarnaEllerFamilie } from 'declarations/sed'
import { TFunction } from 'react-i18next'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'

export interface ValidationMotregningProps {
  motregning: IMotregning
  keyAndYtelses?: Array<KeyAndYtelse> | undefined // only used for the new-motregning
  type: BarnaEllerFamilie
  index ?: number
  namespace: string
  formalName: string
}

export interface ValidationMotregningerProps {
  replySed: ReplySed
  namespace: string
  formalName: string
}

export const validateMotregning = (
  v: Validation,
  t: TFunction,
  {
    motregning,
    keyAndYtelses,
    index,
    type,
    namespace,
    formalName
  }: ValidationMotregningProps): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(motregning?.svarType?.trim())) {
    v[namespace + idx + '-svarType'] = {
      feilmelding: t('message:validation-noAnswerTil', { person: formalName }),
      skjemaelementId: namespace + idx + '-svarType'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  // if we are validation a new motregning and it has barnas, then
  // ytelseNavn comes through keyAndYtelsNavns (Array<IKeyAndYtelsNavn>)
  if (_.isNil(index)) {
    if (type === undefined && _.isEmpty(keyAndYtelses)) {
      v[namespace + idx + '-barnaEllerFamilie'] = {
        feilmelding: t('message:validation-noBarnaEllerFamilie'),
        skjemaelementId: namespace + idx + '-barnaEllerFamilie'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (type === 'barna' && _.isEmpty(keyAndYtelses)) {
      v[namespace + idx + '-ytelseNavn'] = {
        feilmelding: t('message:validation-noYtelseTil', { person: formalName }),
        skjemaelementId: namespace + idx + '-ytelseNavn'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  // on other cases, ytelseNavn comes on the motregning (new motregning as familie, or all existing motregning)
  } else {
    if (_.isEmpty(motregning?.ytelseNavn?.trim())) {
      v[namespace + idx + '-ytelseNavn'] = {
        feilmelding: t('message:validation-noYtelseTil', { person: formalName }),
        skjemaelementId: namespace + idx + '-ytelseNavn'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(motregning?.beloep?.trim())) {
    v[namespace + idx + '-beloep'] = {
      feilmelding: t('message:validation-noBeløpTil', { person: formalName }),
      skjemaelementId: namespace + idx + '-beloep'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!motregning?.beloep?.trim().match(/^[\d.,]+$/)) {
      v[namespace + idx + '-beloep'] = {
        skjemaelementId: namespace + idx + '-beloep',
        feilmelding: t('message:validation-invalidBeløpTil', { person: formalName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(motregning?.valuta?.trim())) {
    v[namespace + idx + '-valuta'] = {
      feilmelding: t('message:validation-noValutaTil', { person: formalName }),
      skjemaelementId: namespace + idx + '-valuta'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodError: boolean = validatePeriode(v, t, {
    periode: {
      startdato: motregning.startdato,
      sluttdato: motregning.sluttdato
    },
    namespace: namespace + idx,
    personName: formalName
  })
  hasErrors = hasErrors || periodError

  if (_.isEmpty(motregning?.utbetalingshyppighet?.trim())) {
    v[namespace + idx + '-utbetalingshyppighet'] = {
      feilmelding: t('message:validation-noAvgrensingTil', { person: formalName }),
      skjemaelementId: namespace + idx + '-utbetalingshyppighet'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.mottakersNavn?.trim())) {
    v[namespace + idx + '-mottakersNavn'] = {
      feilmelding: t('message:validation-noMottakersNavnTil', { person: formalName }),
      skjemaelementId: namespace + idx + '-mottakersNavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.begrunnelse?.trim())) {
    v[namespace + idx + '-begrunnelse'] = {
      feilmelding: t('message:validation-noGrunnTil', { person: formalName }),
      skjemaelementId: namespace + idx + '-begrunnelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (motregning?.begrunnelse.trim().length > 500) {
      v[namespace + idx + '-begrunnelse'] = {
        feilmelding: t('message:validation-textOver500Til', { person: formalName }),
        skjemaelementId: namespace + idx + '-begrunnelse'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (motregning?.ytterligereInfo?.trim()?.length > 500) {
    v[namespace + idx + '-ytterligereInfo'] = {
      feilmelding: t('message:validation-textOver500Til', { person: formalName }),
      skjemaelementId: namespace + idx + '-ytterligereInfo'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateMotregninger = (
  v: Validation,
  t: TFunction,
  {
    replySed,
    namespace,
    formalName
  }: ValidationMotregningerProps
): boolean => {
  let hasErrors: boolean = false;

  (replySed as F002Sed).barn?.forEach((b: Barn) => {
    b.motregninger?.forEach((motregning: IMotregning, index: number) => {
      const answer = validateMotregning(v, t, {
        motregning: motregning,
        type: 'barna',
        index,
        namespace,
        formalName
      })
      hasErrors = hasErrors || answer
    })
  })

  if (!_.isNil((replySed as F002Sed).familie?.motregninger)) {
    (replySed as F002Sed).familie?.motregninger?.forEach((motregning: IMotregning, index: number) => {
      const answer = validateMotregning(v, t, {
        motregning: motregning,
        type: 'familie',
        index,
        namespace,
        formalName
      })
      hasErrors = hasErrors || answer
    })
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
