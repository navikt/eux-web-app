import { FeatureToggles } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'

export interface OldPeriod {
  fom: string
  tom: string
}

export interface Arbeidsgiver {
  fraDato?: string
  tilDato?: string
  fraInntektsregisteret?: string
  fraArbeidsgiverregisteret?: string
  arbeidsgiversOrgnr: string
  arbeidsgiversNavn ?: string
}

export interface Arbeidsperioder {
  uriArbeidsgiverRegister: string
  uriInntektRegister: string
  arbeidsperioder: Array<Arbeidsgiver>
}

export type StringMap = {[k: string]: string}
export type ArrayStringMap = {[k: string]: Array<string>}
export type ArrayStringMapMap = {[k: string]: ArrayStringMap}

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

export interface LocalStorageEntry<CustomLocalStorageContent extends any = any> {
  id: string
  name: string
  date: string
  content: CustomLocalStorageContent
}

export interface ConnectedSed {
  sedTittel: string
  sedType: string
  sedId: string
  sedIdParent?: string
  status: string
  sistEndretDato: string
  svarsedType: string
  svarsedId: string
  svarsedDisplay: string
  lenkeHvisForrigeSedMaaJournalfoeres?: string
}

export interface Dokument {
  kode: string
  rinadokumentID: string
  opprettetdato?: string
}

export interface Enhet {
  enhetId: string
  navn: string
}

export type Enheter = Array<Enhet>

export interface Person {
  fnr?: string
  fdato?: string
  fornavn?: string
  etternavn?: string
  kjoenn?: string
  relasjoner?: Array<OldFamilieRelasjon>
}

export interface FagSak {
  saksID: string
  temakode: string
  fagsystem: string
  aktoerId?: string
  orgnr?: string
  fagsakNr?: string
  sakstype?: string
  opprettet?: string
  opprettetAv?: string
  opprettetTidspunkt?: string
  status?: string
}

export type FagSaker = Array<FagSak>

export interface OldFamilieRelasjon extends Person {
  land?: string | null | undefined
  statsborgerskap?: string | null | undefined
  rolle?: string
  nasjonalitet?: string
}

export interface IInntekt {
  orgNr: string
  arbeidsgiverNavn: string
  sisteLoennsendring: string
  stillingsprosent: number
  maanedsinntektSnitt: number
  maanedsinntekter: {[k in string]: number}
}

export interface IInntekter {
  uriInntektRegister: string
  inntektsperioder: Array<IInntekt>
}

export interface Institusjon {
  institusjonsID: string
  navn: string
  landkode: string
  buctype: string
}

export type Institusjoner = Array<Institusjon>

export interface Kodemaps {
  BUC2SEDS: ArrayStringMapMap
  SEKTOR2BUC: StringMap
  SEKTOR2FAGSAK: StringMap
}

export interface LogMeAgainPayload {
  Location: string
}

export interface OpprettetSak {
  rinasaksnummer: string
  url: string
}

export interface Saksbehandler {
  brukernavn?: string
  navn?: string
  featureToggles: FeatureToggles
}

export interface Sed {
  sakType: string
  sakTittel: string
  sakId: string
  sakUrl: string
  motpart: Array<string>
  motpartInstitusjon: string
  sistEndretDato: string
  sedListe: Array<ConnectedSed>
}

export type Seds = Array<Sed>

export interface ServerInfo {
  namespace: string
  cluster: string
  branchName: string
  longVersionHash: string
  gosysURL: string
  veraUrl: string
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

export type Validation = {[key: string]: ErrorElement | undefined}

export interface VedleggPayload {
  journalpostID: string
  dokumentID: string
  rinasaksnummer: string
  rinadokumentID: string
  rinaNrErSjekket: boolean
  rinaNrErGyldig: boolean
}

export interface VedleggSendResponse {
  filnavn?: string
  vedleggID: string
  url: string
}

export interface UtgaarDatoPayload {
  naa?: string
  utgaarDato: string
}

export interface UpdateReplySedPayload {
  needle: string
  value: any
}

export interface UpdatePdu1Payload {
  needle: string
  value: any
}

export interface CreateSedResponse {
 sedId: string
}
