import { KeyAndYtelse } from './KeyAndYtelse/KeyAndYtelse'
import { validatePeriode } from 'components/Forms/validation'
import { Motregning as IMotregning, ReplySed, Barn, F002Sed, BarnaEllerFamilie } from 'declarations/sed'
import { TFunction } from 'react-i18next'
import { Validation } from 'declarations/types'
import { ErrorElement } from 'declarations/app.d'
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
      feilmelding: t('validation:noAnswer') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-svarType'
    } as ErrorElement
    hasErrors = true
  }

  // if we are validation a new motregning and it has barnas, then
  // ytelseNavn comes through keyAndYtelsNavns (Array<IKeyAndYtelsNavn>)
  if (_.isNil(index)) {
    if (type === undefined && _.isEmpty(keyAndYtelses)) {
      v[namespace + idx + '-barnaEllerFamilie'] = {
        feilmelding: t('validation:noBarnaEllerFamilie'),
        skjemaelementId: namespace + idx + '-barnaEllerFamilie'
      } as ErrorElement
      hasErrors = true
    }
    if (type === 'barna' && _.isEmpty(keyAndYtelses)) {
      v[namespace + idx + '-ytelseNavn'] = {
        feilmelding: t('validation:noYtelse') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + idx + '-ytelseNavn'
      } as ErrorElement
      hasErrors = true
    }
  // on other cases, ytelseNavn comes on the motregning (new motregning as familie, or all existing motregning)
  } else {
    if (_.isEmpty(motregning?.ytelseNavn?.trim())) {
      v[namespace + idx + '-ytelseNavn'] = {
        feilmelding: t('validation:noYtelse') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + idx + '-ytelseNavn'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(motregning?.beloep?.trim())) {
    v[namespace + idx + '-beloep'] = {
      feilmelding: t('validation:noBeløp') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-beloep'
    } as ErrorElement
    hasErrors = true
  } else {
    if (!motregning?.beloep?.trim().match(/^[\d.,]+$/)) {
      v[namespace + idx + '-beloep'] = {
        skjemaelementId: namespace + idx + '-beloep',
        feilmelding: t('validation:invalidBeløp') + (formalName ? t('validation:til-person', { person: formalName }) : '')
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(motregning?.valuta?.trim())) {
    v[namespace + idx + '-valuta'] = {
      feilmelding: t('validation:noValuta') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-valuta'
    } as ErrorElement
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
      feilmelding: t('validation:noAvgrensing') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-utbetalingshyppighet'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(motregning?.mottakersNavn?.trim())) {
    v[namespace + idx + '-mottakersNavn'] = {
      feilmelding: t('validation:noMottakersNavn') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-mottakersNavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(motregning?.begrunnelse?.trim())) {
    v[namespace + idx + '-begrunnelse'] = {
      feilmelding: t('validation:noGrunn') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-begrunnelse'
    } as ErrorElement
    hasErrors = true
  } else {
    if (motregning?.begrunnelse.trim().length > 500) {
      v[namespace + idx + '-begrunnelse'] = {
        feilmelding: t('validation:textOverX', { x: 500 }) + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + idx + '-begrunnelse'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (motregning?.ytterligereInfo?.trim()?.length > 500) {
    v[namespace + idx + '-ytterligereInfo'] = {
      feilmelding: t('validation:textOverX', { x: 500 }) + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + idx + '-ytterligereInfo'
    } as ErrorElement
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
        motregning,
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
        motregning,
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
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
