import {ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring, U002Sed, USed} from 'declarations/sed'
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

export const getNrOfArbeidsPerioder = (replySed: USed): number => {
  return (
    ((replySed as U002Sed)?.perioderAnsattMedForsikring?.length ?? 0) +
    ((replySed as U002Sed)?.perioderSelvstendigMedForsikring?.length ?? 0) +
    ((replySed as U002Sed)?.perioderAnsattUtenForsikring?.length ?? 0) +
    ((replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.length ?? 0)
  )
}

export const getAllArbeidsPerioderHaveSluttDato = (replySed: USed): boolean => {
  let allArbeidsPerioderHaveSluttdato = true
  // U002. "Grunn til opphør" er ikke obligatorisk på en arbeidsperiode med åpen sluttdato.
  if ((replySed as USed).sedType === 'U002') {
    if (
      _.find((replySed as U002Sed)?.perioderAnsattMedForsikring, p => _.isEmpty(p.sluttdato)) ||
      _.find((replySed as U002Sed)?.perioderSelvstendigMedForsikring, p => _.isEmpty(p.sluttdato)) ||
      _.find((replySed as U002Sed)?.perioderAnsattUtenForsikring, p => _.isEmpty(p.sluttdato)) ||
      _.find((replySed as U002Sed)?.perioderSelvstendigUtenForsikring, p => _.isEmpty(p.sluttdato))
    ) {
      allArbeidsPerioderHaveSluttdato = false
    }
  }

  return allArbeidsPerioderHaveSluttdato
}

