import { ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring } from 'declarations/sed'
import { ArbeidsperiodeFraAA } from 'declarations/types'
import _ from 'lodash'

export const arbeidsperioderFraAAToForsikringPeriode = (a: ArbeidsperiodeFraAA): PeriodeMedForsikring => {
  const newPeriode: Periode = {
    startdato: a.fraDato!
  }
  if (!a.tilDato) {
    newPeriode.aapenPeriodeType = 'åpen_sluttdato'
  } else {
    newPeriode.sluttdato = a.tilDato
  }

  return {
    ...newPeriode,
    arbeidsgiver: {
      identifikatorer: [{
        type: 'organisasjonsnummer',
        id: a.arbeidsgiversOrgnr
      }],
      navn: a.arbeidsgiversNavn ?? ''
    },
    extra: {
      fraArbeidsgiverregisteret: a.fraArbeidsgiverregisteret,
      fraInntektsregisteret: a.fraInntektsregisteret,
      fraSed: 'nei'
    }
  } as PeriodeMedForsikring
}

export const generateIdentifikatorKey = (ids: Array<ArbeidsgiverIdentifikator> | undefined): string | undefined => {
  if (_.isNil(ids)) {
    return undefined
  }
  return ids
    .sort((a, b) => a.type.localeCompare(b.type))
    .map(it => it.type + '-' + it.id).join(';')
}

export const getOrgnr = (arbeidsgiver: PeriodeMedForsikring, type: string): string | undefined => (
  _.find(arbeidsgiver.arbeidsgiver?.identifikatorer, (id: ArbeidsgiverIdentifikator) => id.type === type)?.id
)
