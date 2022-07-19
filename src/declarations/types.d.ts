import { FeatureToggles } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { PDU1 } from 'declarations/pd'
import { JaNei, ReplySed } from 'declarations/sed'

export type StorageTypes = PDU1 | ReplySed

export type SakAction = 'H001' | 'X001' | 'X005' | 'X007' | 'X008' | 'X009' | 'X012' | 'Close_Case' | 'Delete_Case' | 'CreateParticipants'

export type SedAction = 'X008' | 'X010' | 'X011' | 'X012' | 'U002' | 'U004' | 'U017' | 'F002' | 'H002' | 'Read' | 'Update' | 'Delete' | 'Send' | 'ReadParticipants'

export interface ArbeidsperiodeFraAA {
  fraDato?: string
  tilDato?: string
  fraInntektsregisteret?: string
  fraArbeidsgiverregisteret?: string
  arbeidsgiversOrgnr: string
  arbeidsgiversNavn ?: string
}

export interface ArbeidsperioderFraAA {
  uriArbeidsgiverRegister: string
  uriInntektRegister: string
  arbeidsperioder: Array<ArbeidsperiodeFraAA>
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

export interface LocalStorageEntry<CustomLocalStorageContent extends StorageTypes = any> {
  id: string
  name: string
  date: string
  content: CustomLocalStorageContent
}

export interface Sed {
  sedTittel: string
  sedType: string
  sedId: string
  sedUrl ?: string
  sedIdParent?: string
  status: string
  sistEndretDato: string
  svarsedType?: string
  svarsedId?: string
  svarsedDisplay?: string
  lenkeHvisForrigeSedMaaJournalfoeres?: string
  sedHandlinger: Array<SedAction>
  children ?: Array<Sed>
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

export interface PDU1SearchResult {
  fagsakId: string
  datoOpprettet: string
  journalpostId: string
  dokumentInfoId: string
  tema: string
  brevkode: string
  tittel: string
  dokumentvarianter: Array<string>
}

export type PDU1SearchResults = Array<PDU1SearchResult>

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
  sakId: string
  sakUrl: string
  sedId: string
}

export interface Saksbehandler {
  brukernavn?: string
  navn?: string
  featureToggles: FeatureToggles
}

export interface Sak {
  fornavn: string
  etternavn: string
  foedselsdato: string
  kjoenn: string
  fnr: string
  erSakseier? : JaNei
  sakType: string
  sakTittel: string
  sakId: string
  internasjonalSakId ?: string
  sakUrl: string
  motpart: Array<string>
  motpartInstitusjon?: string
  sistEndretDato: string
  sakshandlinger: Array<SakAction>
  sedListe: Array<Sed>
}

export type Saks = Array<Sak>

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
  sensitivt: boolean
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
