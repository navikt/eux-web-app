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

  if (_.isEmpty(ytelse?.barnetsNavn?.trim())) {
    v[namespace + '-barnetsNavn'] = {
      skjemaelementId: namespace + '-barnetsNavn',
      feilmelding: t('message:validation-noNameToPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.ytelseNavn?.trim())) {
    v[namespace + '-ytelseNavn'] = {
      skjemaelementId: namespace + '-ytelseNavn',
      feilmelding: t('message:validation-noBetegnelsePåYtelseForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-noBeløpForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.valuta?.trim())) {
    v[namespace + '-valuta'] = {
      skjemaelementId: namespace + '-valuta',
      feilmelding: t('message:validation-noValutaForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }


  const periodErrors: boolean = validatePeriod(v, t, {
    period: {
      startdato: ytelse?.startdato,
      sluttdato: ytelse?.sluttdato
    },
    namespace
  })
  hasErrors = hasErrors || periodErrors

  if (_.isEmpty(ytelse?.mottakersNavn?.trim())) {
    v[namespace + '-mottakersNavn'] = {
      skjemaelementId: namespace + '-mottakersNavn',
      feilmelding: t('message:validation-noNavnForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.utbetalingshyppighet?.trim())) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: namespace + '-utbetalingshyppighet',
      feilmelding: t('message:validation-noUtbetalingshyppighetForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
