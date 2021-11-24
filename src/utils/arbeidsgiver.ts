import { ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring } from 'declarations/sed'
import { Arbeidsgiver } from 'declarations/types'
import _ from 'lodash'

export const arbeidsgiverToPeriodeMedForsikring = (a: Arbeidsgiver): PeriodeMedForsikring => {
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
      fraInntektsregisteret: a.fraInntektsregisteret
    }
  }
}

export const sanitizePeriodeMedForsikring = (a: PeriodeMedForsikring): PeriodeMedForsikring => {
  const _a = _.cloneDeep(a)
  delete _a.extra
  return _a
}

export const periodeMedForsikringToArbeidsgiver = (a: PeriodeMedForsikring): Arbeidsgiver => {
  return {
    fraInntektsregisteret: a.extra?.fraInntektsregisteret ?? '',
    fraArbeidsgiverregisteret: a.extra?.fraArbeidsgiverregisteret ?? '',
    arbeidsgiversOrgnr: getOrgnr(a, 'organisasjonsnummer') ?? '',
    fraDato: a.startdato,
    tilDato: a.sluttdato,
    arbeidsgiversNavn: a.arbeidsgiver.navn
  }
}

export const generateIdentifikatorKey = (ids: Array<ArbeidsgiverIdentifikator>): string => ids
  .sort((a, b) => a.type.localeCompare(b.type))
  .map(it => it.type + '-' + it.id).join(';')

export const getOrgnr = (arbeidsgiver: PeriodeMedForsikring, type: string): string | undefined => (
  _.find(arbeidsgiver.arbeidsgiver?.identifikatorer, (id: ArbeidsgiverIdentifikator) => id.type === type)?.id
)
