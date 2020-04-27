import { PeriodePropType } from 'declarations/types.pt'

export interface Period {
  fom?: string;
  tom?: string;
}

export interface Arbeidsforholdet {
  arbeidsforholdIDnav?: number;
  orgnr?: string;
  navn?: string;
  ansettelsesPeriode?: PeriodePropType
}

export type Arbeidsforhold = Array<Arbeidsforholdet>

export interface Kodeverk {
  kode: string;
  term: string;
}

export interface BucTyper {
  awod: Array<Kodeverk>,
  administrative: Array<Kodeverk>,
  family: Array<Kodeverk>,
  horizontal: Array<Kodeverk>,
  legislation: Array<Kodeverk>,
  miscellaneous: Array<Kodeverk>,
  pensions: Array<Kodeverk>,
  recovery: Array<Kodeverk>,
  sickness: Array<Kodeverk>,
  unemployment: Array<Kodeverk>
}

export interface Person {
  fnr?: string;
  fdato?: string;
  fornavn?: string;
  etternavn?: string;
  kjoenn?: string;
  relasjoner?: Array<FamilieRelasjon>
}

export interface FamilieRelasjon extends Person {
  land?: string | null | undefined;
  statsborgerskap?: string | null | undefined;
  rolle?: string;
}

export interface Saksbehandler {
  brukernavn?: string;
  navn?: string;
}

export interface ServerInfo {
  namespace: string;
  cluster: string;
  branchName: string;
  longVersionHash: string;
  gosysURL: string;
  veraUrl: string;
  gosysURL: string;
}
export type Enheter = Array<Enhet>

export interface Enhet {
  enhetId: string;
  navn: string;
}

export interface OpprettetSak {
  rinasaksnummer: string;
  url: string;
}

export interface VedleggPayload {
  journalpostID: string;
  dokumentID: string;
  rinasaksnummer: string;
  rinadokumentID: string;
  rinaNrErSjekket: boolean;
  rinaNrErGyldig: boolean;
}

export interface Dokument {
  kode: string;
  rinadokumentID: string;
  opprettetdato?: string;
}

export interface VedleggSendResponse {
  filnavn?: string;
  vedleggID: string;
  url: string
}

export interface Tema {
  awod: Array<Kodeverk>,
  family: Array<Kodeverk>,
  horizontal: Array<Kodeverk>,
  legislation: Array<Kodeverk>,
  miscellaneous: Array<Kodeverk>,
  pensions: Array<Kodeverk>,
  recovery: Array<Kodeverk>,
  sickness: Array<Kodeverk>,
  unemployment: Array<Kodeverk>
}

export interface Kodemaps {
  BUC2SEDS: {[k: string]: Array<string>},
  SEKTOR2BUC: {[k: string]: string},
  SEKTOR2FAGSAK: {[k: string]: string}
}

export interface FagSak {
  saksID: string;
  sakstype: string;
  temakode: string;
  fagsystem: string;
  opprettet: string;
  status: string;
  fagsakNr?: string;
}

export type FagSaker = Array<FagSak>

export type Validation = {[k: string]: string | null}
