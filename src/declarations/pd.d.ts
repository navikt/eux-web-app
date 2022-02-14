import {
  GrunnTilOpphør,
  JaNei,
  Periode,
  Adresse
} from 'declarations/sed'

export interface PeriodeMedComment extends Periode {
  info: string
}

export interface PeriodeMedAktivitetstype extends PeriodeMedComment {
  aktivitetstype: string
}

export interface PeriodeMedType extends PeriodeMedComment {
  type: string
}

export interface PeriodeMedBegrunnelse extends PeriodeMedComment {
  begrunnelse: string
}

export interface PeriodeMedLoenn extends PeriodeMedComment {
  loenn: string
}

export interface PeriodeMedInntekt extends PeriodeMedComment {
  inntekt: string
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

export interface NavInfo {
  enhetNavn: string,
  enhetId: string,
  adresse: Adresse,
  tlf: string,
  saksbehandler: { // cover letter
    navn: string
    enhet: string
  }
}

export interface AndreMottatteUtbetalinger {
  utbetalingEtterEndtArbeidsforhold: string // 4.1
  kompensasjonForEndtArbeidsforhold: string// 4.2
  kompensasjonForFeriedager: { // 4.3
    antallDager: string
    beloep: string
  }
  avkallKompensasjonBegrunnelse: string // 4.4.1
  andreYtelserSomMottasForTiden: string // 4.5
  _utbetalingEtterEndtArbeidsforholdCheckbox: boolean | undefined
  _kompensasjonForEndtArbeidsforholdCheckbox: boolean | undefined
  _kompensasjonForFeriedagerCheckbox: boolean | undefined
  _avkallKompensasjonBegrunnelseCheckbox: boolean | undefined
  _andreYtelserSomMottasForTidenCheckbox: boolean | undefined
}

export interface RettTilDagpenger {
  startdato?: string
  sluttdato?: string
  ihhTilArtikkel64: JaNei
  ihhTilArtikkel65: JaNei
}

export interface IkkeRettTilDagpenger {
  ihhTilLovgivning: JaNei
  ikkeSoekt: JaNei
}

export type PDPeriode = Periode | PeriodeMedType | PeriodeMedBegrunnelse | PeriodeMedAktivitetstype | PeriodeMedLoenn | PeriodeMedInntekt

export interface PDU1 {
  saksreferanse: string, // Nav => cover letter,
  dato: string, // Nav => cover letter, 7.10
  bruker: Pdu1Person, // Person, Adresse => cover letter, section 1
  nav: NavInfo // NAV => cover letter, section 7
  perioderAnsattMedForsikring: Array<PeriodeMedComment>, // Perioder => 2.1.1
  perioderSelvstendigMedForsikring: Array<PeriodeMedComment>, // Perioder 2.1.2
  perioderAndreForsikringer: Array<PeriodeMedType> // Perioder 2.1.3
  perioderAnsettSomForsikret: Array<PeriodeMedBegrunnelse> // Perioder 2.1.4?
  perioderAnsattUtenForsikring: Array<PeriodeMedAktivitetstype> // Perioder 2.2.1
  perioderSelvstendigUtenForsikring?: Array<PeriodeMedAktivitetstype> // Perioder 2.2.2
  perioderLoennSomAnsatt: Array<PeriodeMedLoenn> // Perioder 2.3.1
  perioderInntektSomSelvstendig: Array<PeriodeMedInntekt> // Perioder 2.3.2
  opphoer: GrunnTilOpphør // SisteAnsettelseInfo => 3
  andreMottatteUtbetalinger: AndreMottatteUtbetalinger // Utbetaling => 4
  perioderDagpengerMottatt: Array<Periode> // Dagpenger => 5
  rettTilDagpenger?: RettTilDagpenger // RettTilDagpenger => 6
  ikkeRettTilDagpenger?: IkkeRettTilDagpenger // RettTilDagpenger => 6
}
