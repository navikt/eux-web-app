import { KodeverkPropType, PeriodePropType } from 'declarations/types.pt'
import PT from 'prop-types'

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

export interface FamilieRelasjon {
  fnr?: string;
  fdato?: string;
  nasjonalitet?: string;
  rolle?: string;
  kjoenn?: string;
  fornavn?: string;
  etternavn?: string
}

export interface Person {
  fnr?: string;
  fdato?: string;
  fornavn?: string;
  etternavn?: string;
  kjoenn?: string;
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
  veraURL: string;
}

export interface OpprettetSak {
  rinasaksnummer: string;
  url: string;
}

export interface VedleggSendResponse {
  vedleggID: string;
  url: string
}

export type FamilieRelasjoner = Array<Kodeverk>
export type Kjoenn = Array<Kodeverk>
export type Landkoder = Array<Kodeverk>
export type Sektor = Array<Kodeverk>
export type SedTyper =  Array<Kodeverk>

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
