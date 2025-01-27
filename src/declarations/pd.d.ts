import {
  JaNei,
  Periode,
  Adresse
} from 'declarations/sed'

export interface PDPeriode extends Periode {
  info: string
}

export interface Pin {
  landkode?: string
  identifikator ?: string
}

export interface Pdu1Person {
  fnr: string
  adressebeskyttelse?: string
  kjoenn: string
  fornavn: string
  etternavn: string
  foedselsdato: string
  statsborgerskap: Array<string>
  etternavnVedFoedsel: string
  adresse: Adresse
  utenlandskePin: Array<Pin>
}

export interface Avsender {
  saksbehandler: { // cover letter
    navn: string
    enhetNavn: string
  },
  navEnhetNavn: string
  navOrgNr: string
  navTlf: string
  adresse: Adresse
}

export interface Etterbetalinger {
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

export interface Oppsigelsesgrunn {
  typeGrunnAnsatt: string
  annenGrunnAnsatt?: string
  grunnSelvstendig?: string
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

export interface FagsakPayload {
  aar?: string
}

export interface PDU1 {
  // added
  __journalpostId?: string
  __dokumentId?: string
  __fagsak?: string
  __fnr?: string

  versjon?: string
  saksreferanse: string, // Nav => cover letter,
  fagsakId: string,
  dato: string, // Nav => cover letter, 7.10
  bruker: Pdu1Person, // Person, Adresse => cover letter, section 1
  avsender: Avsender
  info: string

  perioderAnsattMedForsikring: Array<PDPeriode>, // Perioder => 2.1.1
  perioderAnsattUtenForsikring: Array<PDPeriode> // Perioder 2.2.1
  perioderSelvstendigMedForsikring: Array<PDPeriode>, // Perioder 2.1.2
  perioderSelvstendigUtenForsikring?: Array<PDPeriode> // Perioder 2.2.2
  perioderAndreForsikringer: Array<PDPeriode> // Perioder 2.1.3
  perioderAnsettSomForsikret: Array<PDPeriode> // Perioder 2.1.4?
  perioderLoennSomAnsatt: Array<PDPeriode> // Perioder 2.3.1
  perioderInntektSomSelvstendig: Array<PDPeriode> // Perioder 2.3.2
  perioderDagpengerMottatt: Array<PDPeriode> // Dagpenger => 5

  oppsigelsesgrunn: Oppsigelsesgrunn

  etterbetalinger: Etterbetalinger // Utbetaling => 4

  rettTilDagpenger?: RettTilDagpenger // RettTilDagpenger => 6
  ikkeRettTilDagpenger?: IkkeRettTilDagpenger // RettTilDagpenger => 6
}
