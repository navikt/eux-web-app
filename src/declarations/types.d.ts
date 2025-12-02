import { FeatureToggles } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { PDU1 } from 'declarations/pd'
import {JaNei, ReplySed, Statsborgerskap} from 'declarations/sed'
import {Context, Item} from "@navikt/tabell";

export type StorageTypes = PDU1 | ReplySed
export type SedAction = 'X008' | 'X010' | 'X011' | 'X012' | 'U002' | 'U004' | 'U017' | 'F002' | 'H002' | 'Read' | 'Update' | 'Delete' | 'Send' | 'ReadParticipants' | 'Participants_Send'

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

export type CountryCodes = {
  "v4.2": CountryCodeLists,
  "v4.3": CountryCodeLists
}

export type CountryCodeLists = {
  "euEftaLand": Array<SimpleCountry>
  "verdensLand": Array<SimpleCountry>
  "verdensLandHistorisk": Array<SimpleCountry>
  "statsborgerskap": Array<SimpleCountry>
}

export type SimpleCountry = {
  landkode: string
  landnavn: string
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

export interface Sed {
  sedTittel: string
  sedType: string
  sedId: string
  sedUrl ?: string
  sedIdParent?: string | null
  status: string
  sistEndretDato: string
  svarsedType?: string | null
  svarsedId?: string | null
  svarsedDisplay?: string
  sedHandlinger?: Array<SedAction>
  vedlegg?: Array<Attachment>
  children ?: Array<Sed>,
  manglerInformasjonOmEktefelleEllerAnnenPerson? : boolean
  fagsak?: Fagsak | null
}

export interface Attachment {
  id: string,
  navn: string
  sensitivt: boolean
}

export interface AttachmentTableItem extends Item {
  id: string
  navn: string
  sensitivt: boolean
}

export interface AttachmentContext extends Context {
  gettingAttachmentFile: boolean
  deletingAttachment: boolean
  settingAttachmentSensitive: boolean
  clickedItem: AttachmentTableItem | undefined
}


export interface Dokument {
  kode: string
  rinadokumentID: string
  opprettetdato?: string
}

export interface Enhet {
  enhetNr: string
  navn: string
  erFavoritt: boolean
  fagomrader?: Array<string>
}

export type Enheter = Array<Enhet>

export type Bucer = Array<string>

export interface PersonInfoPDL {
  fnr?: string
  foedselsdato?: string
  fornavn?: string
  mellomnavn?: string
  forOgMellomnavn?: string
  etternavn?: string
  kjoenn?: string
  statsborgerskap?: Array<Statsborgerskap>
  adresser?: Array<AdressePDL>
  utenlandskePin?: Array<Pin>
  adressebeskyttelse?: string
  __rolle?: string
  __fraPersonMedFamilie?: boolean
}

export interface PersonInfoUtland {
  fornavn?: string,
  etternavn?: string,
  kjoenn?: string,
  statsborgerskap?: string,
  foedselsdato?: string,
  pin?: string,
  pinLandkode?: string,
  __rolle?: string
}

export interface AdressePDL {
  type?: string,
  gate?: string,
  postNr?: string,
  postSted?: string,
  region?: string,
  landkode?: string
}

export interface Pin {
  identifikator: string
  landkode: string
}

export interface PersonMedFamilie extends PersonInfoPDL {
  ektefelle?: PersonInfoPDL
  annenperson?: PersonInfoPDL
  barn?: Array<PersonInfoPDL>
}

export interface Fagsak {
  aktoerId?: string | null | undefined
  tema?: string | null | undefined
  type?: string | null | undefined
  nr?: string | null | undefined
  system?: string | null | undefined
  fnr?: string | null | undefined
  opprettetTidspunkt?: string | null | undefined
  _id?: string
}

export interface JournalfoeringLogg {
  journalfoert?: Array<string> | null | undefined,
  ikkeJournalfoert?: Array<string> | null | undefined,
  varJournalfoertFeil?: Array<string> | null | undefined
  tilknyttedeOppgaver?: Array<TilknyttetOppgave> | null | undefined
}

export interface FeilregistrerJournalposterLogg {
  bleFeilregistrert?: Array<string> | null | undefined,
  bleIkkeFeilregistrert?: Array<string> | null | undefined
}

export interface TilknyttetOppgave {
  status: string,
  beskrivelse: string
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

export type Fagsaker = Array<Fagsak>

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
  fnr?: string
  adressebeskyttelse?: string
  erSakseier? : boolean
  sakseier?: NavInstitusjon
  sakType: string
  sakTittel: string
  sakId: string
  internasjonalSakId ?: string
  sakUrl: string
  motparter: Array<Motpart>
  motpart?: Array<string>
  motpartInstitusjon?: string
  navinstitusjon: NavInstitusjon
  sistEndretDato: string
  sakshandlinger?: Array<string>
  sensitiv?: boolean
  fagsak?: Fagsak | null
  sedListe: Array<Sed>
  ikkeJournalfoerteSed?:Array<string>
  sedUnderJournalfoeringEllerUkjentStatus?:Array<string>
  journalpoststatus?: string | null
  relaterteRinasakIder?: Array<string>
  cdmVersjon: string
}

export interface NavInstitusjon {
  id: string
  navn: string
}

export interface Motpart {
  formatertNavn: string
  motpartId: string
  motpartNavn: string
  motpartLand?: string //Two letter code
  motpartLandkode: string //Three letter code
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
