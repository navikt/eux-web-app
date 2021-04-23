import { validatePeriod } from 'components/Period/validation'
import { Ytelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationBeløpNavnOgValutaProps {
  ytelse: Ytelse
  namespace: string,
  personName: string
}

export const validateBeløpNavnOgValuta = (
  v: Validation,
  t: TFunction,
  {
    ytelse,
    namespace,
    personName
  }: ValidationBeløpNavnOgValutaProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(ytelse.barnetsNavn)) {
    v[namespace + '-barnetsNavn'] = {
      skjemaelementId: 'c-' + namespace + '-barnetsNavn-text',
      feilmelding: t('message:validation-noNameToPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse.ytelseNavn)) {
    v[namespace + '-ytelseNavn'] = {
      skjemaelementId: 'c-' + namespace + '-ytelseNavn-text',
      feilmelding: t('message:validation-noBetegnelsePåYtelseForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse.beloep)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: 'c-' + namespace + '-beloep-text',
      feilmelding: t('message:validation-noBeløpForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse.valuta)) {
    v[namespace + '-valuta'] = {
      skjemaelementId: 'c-' + namespace + '-valuta-text',
      feilmelding: t('message:validation-noValutaForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodErrors: boolean = validatePeriod(v, t, {
    period: {
      startdato: ytelse.startdato,
      sluttdato: ytelse.sluttdato
    },
    index: -1,
    namespace
  })
  hasErrors = hasErrors || periodErrors

  if (_.isEmpty(ytelse.mottakersNavn)) {
    v[namespace + '-mottakersNavn'] = {
      skjemaelementId: 'c-' + namespace + '-mottakersNavn-text',
      feilmelding: t('message:validation-noNavnForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse.utbetalingshyppighet)) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: 'c-' + namespace + '-utbetalingshyppighet-text',
      feilmelding: t('message:validation-noUtbetalingshyppighetForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
