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
): void => {
  let generalFail: boolean = false

  if (_.isEmpty(ytelse.barnetsNavn)) {
    v[namespace + '-barnetsNavn'] = {
      skjemaelementId: 'c-' + namespace + '-barnetsNavn-text',
      feilmelding: t('message:validation-noNameToPerson', { person: personName })
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (_.isEmpty(ytelse.ytelseNavn)) {
    v[namespace + '-ytelseNavn'] = {
      skjemaelementId: 'c-' + namespace + '-ytelseNavn-text',
      feilmelding: t('message:validation-noBetegnelsePåYtelseForPerson', { person: personName })
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (_.isEmpty(ytelse.beloep)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: 'c-' + namespace + '-beloep-text',
      feilmelding: t('message:validation-noBeløpForPerson', { person: personName })
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (_.isEmpty(ytelse.valuta)) {
    v[namespace + '-valuta'] = {
      skjemaelementId: 'c-' + namespace + '-valuta-text',
      feilmelding: t('message:validation-noValutaForPerson', { person: personName })
    } as FeiloppsummeringFeil
    generalFail = true
  }

  validatePeriod(v, t, {
    period: {
      startdato: ytelse.startdato,
      sluttdato: ytelse.sluttdato
    },
    index: -1,
    namespace
  })

  if (v[namespace + '-startdato'] || v[namespace + '-sluttdato']) {
    generalFail = true
  }

  if (_.isEmpty(ytelse.mottakersNavn)) {
    v[namespace + '-mottakersNavn'] = {
      skjemaelementId: 'c-' + namespace + '-mottakersNavn-text',
      feilmelding: t('message:validation-noNavnForPerson', { person: personName })
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (_.isEmpty(ytelse.utbetalingshyppighet)) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: 'c-' + namespace + '-utbetalingshyppighet-text',
      feilmelding: t('message:validation-noUtbetalingshyppighetForPerson', { person: personName })
    } as FeiloppsummeringFeil
    generalFail = true
  }

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}
