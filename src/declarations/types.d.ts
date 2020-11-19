import { PeriodePropType } from 'declarations/types.pt'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export interface Period {
  fom?: string
  tom?: string
}

export interface Arbeidsforholdet {
  ansettelsesPeriode?: PeriodePropType
  arbeidsforholdIDnav?: number
  navn?: string
  orgnr?: string
}

export type Arbeidsforhold = Array<Arbeidsforholdet>

export interface Kodeverk {
  kode: string
  term: string
}

export interface BucTyper {
  awod: Array<Kodeverk>
  administrative: Array<Kodeverk>
  family: Array<Kodeverk>
  horizontal: Array<Kodeverk>
  legislation: Array<Kodeverk>
  miscellaneous: Array<Kodeverk>
  pensions: Array<Kodeverk>
  recovery: Array<Kodeverk>
  sickness: Array<Kodeverk>
  unemployment: Array<Kodeverk>
}

export interface Person {
  fnr?: string
  fdato?: string
  fornavn?: string
  etternavn?: string
  kjoenn?: string
  relasjoner?: Array<any>// Array<FamilieRelasjon>
}

export interface FamilieRelasjon extends Person {
  land?: string | null | undefined
  statsborgerskap?: string | null | undefined
  rolle?: string
  nasjonalitet?: string
}

export interface Saksbehandler {
  brukernavn?: string
  navn?: string
}

export interface ServerInfo {
  namespace: string
  cluster: string
  branchName: string
  longVersionHash: string
  gosysURL: string
  veraUrl: string
  gosysURL: string
}

export interface Enhet {
  enhetId: string
  navn: string
}

export type Enheter = Array<Enhet>

export interface OpprettetSak {
  rinasaksnummer: string
  url: string
}

export interface VedleggPayload {
  journalpostID: string
  dokumentID: string
  rinasaksnummer: string
  rinadokumentID: string
  rinaNrErSjekket: boolean
  rinaNrErGyldig: boolean
}

export interface Dokument {
  kode: string
  rinadokumentID: string
  opprettetdato?: string
}

export interface VedleggSendResponse {
  filnavn?: string
  vedleggID: string
  url: string
}

export interface Tema {
  awod: Array<Kodeverk>
  family: Array<Kodeverk>
  horizontal: Array<Kodeverk>
  legislation: Array<Kodeverk>
  miscellaneous: Array<Kodeverk>
  pensions: Array<Kodeverk>
  recovery: Array<Kodeverk>
  sickness: Array<Kodeverk>
  unemployment: Array<Kodeverk>
}

export interface Kodemaps {
  BUC2SEDS: { [k: string]: Array<string> }
  SEKTOR2BUC: { [k: string]: string }
  SEKTOR2FAGSAK: { [k: string]: string }
}

export interface FagSak {
  saksID: string
  sakstype: string
  temakode: string
  fagsystem: string
  opprettet: string
  status: string
  fagsakNr?: string
}

export type FagSaker = Array<FagSak>

export interface Inntekt {
  fraDato: string
  tilDato: string
  beloep: number
  type: string
}

export type Inntekter = Array<Inntekt>

export interface Sed {
  documentId: string
  documentType: string
  operation: string
}

export interface UtgaarDatoPayload {
  naa?: string
  utgaarDato: string
}

export interface LogMeAgainPayload {
  Location: string
}

export interface Institusjon {
  institusjonsID: string
  navn: string
  landkode: string
  buctype: string
}

export type Institusjoner = Array<Institusjon>

export type Validation = {[key: string]: FeiloppsummeringFeil | undefined}
