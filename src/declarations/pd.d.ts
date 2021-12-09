import {
  GrunnTilOpphør,
  JaNei,
  Periode,
  Adresse
} from 'declarations/sed'

export interface PeriodeMedAktivitetstype extends Periode {
  aktivitetstype: string
}

export interface PeriodeMedType extends Periode {
  type: string
}

export interface PeriodeMedBegrunnelse extends Periode {
  begrunnelse: string
}

export interface PeriodeMedLoenn extends Periode {
  loenn: string
}

export interface Pdu1Person {
  fnr: string
  kjoenn: string
  fornavn: string
  etternavn: string
  foedselsdato: string
  statsborgerskap: Array<string>
  etternavnVedFoedsel: string
  adresse: Adresse
  utenlandskePin: Array<string>
}

export type PDPeriode = Periode | PeriodeMedType | PeriodeMedBegrunnelse | PeriodeMedAktivitetstype | PeriodeMedLoenn

export interface ReplyPdu1 {
  saksreferanse: string, // Nav => cover letter,
  dato: string, // Nav => cover letter, 7.10
  bruker: Pdu1Person, // Person, Adresse => cover letter, section 1
  nav: { // NAV => cover letter, section 7
    enhetNavn: string,
    enhetId: string,
    adresse: Adresse,
    tlf: string,
    saksbehandler: { // cover letter
      navn: string
      enhet: string
    }
  },

  perioderAnsattMedForsikring: Array<Periode>, // Perioder => 2.1.1
  perioderSelvstendigMedForsikring: Array<Periode>, // Perioder 2.1.2
  perioderAndreForsikringer: Array<PeriodeMedType> // Perioder 2.1.3
  perioderAnsettSomForsikret: Array<PeriodeMedBegrunnelse> // Perioder 2.1.4?
  perioderAnsattUtenForsikring: Array<PeriodeMedAktivitetstype> // Perioder 2.2.1
  perioderSelvstendigUtenForsikring?: Array<PeriodeMedAktivitetstype> // Perioder 2.2.2
  perioderLoennSomAnsatt: Array<PeriodeMedLoenn> // Perioder 2.3.1
  perioderInntektSomSelvstendig: Array<PeriodeMedLoenn> // Perioder 2.3.2

  sisteAnsettelseInfo: GrunnTilOpphør // GrunnTilOpphør => 3

  andreMottatteUtbetalinger: { // UtbetalingerPD => 4
    utbetalingEtterEndtArbeidsforhold: string // 4.1
    kompensasjonForEndtArbeidsforhold: string// 4.2
    kompensasjonForFeriedager: { // 4.3
      antallDager: string
      beloep: string
    }
    avkallKompensasjonBegrunnelse: string // 4.4.1
    andreYtelserSomMottaForTiden: string // 4.5
  }
  perioderDagpengerMottatt: { // PerioderDagpengerPD => 5
    perioder: Array<Periode> // 5.1
    sisteUtbetaler: {
      sisteNavKontor: string // 5.2
      navn: string // 5.4
      id: string // 5.3
      adresse: Adresse // 5.5
    }
  }
  rettTilDagpenger: { // RettTilYtelserPD => 6
    startdato: string
    sluttdato: string
    ihhTilArtikkel64: JaNei
    ihhTilArtikkel65: JaNei
  }
  ikkeRettTilDagpenger: { // RettTilYtelserPD => 6
    ihhTilLovgivning: JaNei
    ikkeSoekt: JaNei
  }
}
