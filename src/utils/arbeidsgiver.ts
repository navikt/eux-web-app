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
    ... newPeriode,
    arbeidsgiver: {
      identifikator: [{
        type: 'registrering',
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
    arbeidsgiversOrgnr: getOrgnr(a) ?? '',
    fraDato: a.startdato,
    tilDato: a.sluttdato,
    arbeidsgiversNavn: a.arbeidsgiver.navn
  }
}

export const getOrgnr = (arbeidsgiver: PeriodeMedForsikring): string | undefined => (
  _.find(arbeidsgiver.arbeidsgiver?.identifikator, (id: ArbeidsgiverIdentifikator) => id.type === 'registrering')?.id
)

export const hasOrgnr = (arbeidsgiver: PeriodeMedForsikring, needleId: string): boolean => (
  _.find(arbeidsgiver.arbeidsgiver.identifikator, (id: ArbeidsgiverIdentifikator) => id.type === 'registrering' && id.id === needleId) !== undefined
)
