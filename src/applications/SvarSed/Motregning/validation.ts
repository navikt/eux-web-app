import { TFunction } from 'react-i18next'
import { NavnOgBetegnelse } from './Motregning'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateMotregning = (
  v: Validation,
  navnOgBetegnelse: NavnOgBetegnelse,
  index: number,
  t: TFunction,
  namespace: string
): void => {
  let generalFail: boolean = false

  let value = navnOgBetegnelse.navn
    ? undefined
    : {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-navn-text'
    } as FeiloppsummeringFeil

  v[namespace + '-navn'] = value

  if (value) {
    generalFail = true
  }

  value = navnOgBetegnelse.betegnelsePåYtelse
    ? undefined
    : {
      feilmelding: t('message:validation-noBetegnelsePåYtelse'),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-betegnelsepåytelse-text'
    } as FeiloppsummeringFeil

  v[namespace + '-betegnelsepåytelse'] = value

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validateMotregninger = (
  validation: Validation,
  NavnOgBetegnelser :Array<NavnOgBetegnelse>,
  t: TFunction,
  namespace: string
): void => {
  NavnOgBetegnelser?.forEach((nob: NavnOgBetegnelse, index: number) => {
    validateMotregning(validation, nob, index, t, namespace)
  })
}
