import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export interface Period {
  fom?: string
  tom?: string
}

export interface Arbeidsforholdet {
  ansettelsesPeriode?: Period
  arbeidsforholdIDnav?: number
  navn?: string
  orgnr?: string
}

export type Arbeidsforhold = Array<Arbeidsforholdet>

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
  BUC2SEDS: ArrayStringMapMap
  SEKTOR2BUC: StringMap
  SEKTOR2FAGSAK: StringMap
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

export interface ConnectedSed {
  replySedType: string
  replySedDisplay: string
  querySedDocumentId: string
}

export interface Periode {
  startdato: string
  sluttdato?: string
  aapenPeriodeType?: string
}
export type Seds = {[k in string]: Array<ConnectedSed>}

export interface Arbeidsgiver {
  arbeidsgiver: {
    navn: string
    adresse?: {
      gate: string
      postnummer: string
      by: string
      land: string
      bygning: string
      region: string
    },
    identifikatorer: Array<{
      type: string
      id: string
    }>
  }
  periode?: Periode
  typeTrygdeforhold?: string
}

export interface ReplySed {
  sedType: string
  sedVersjon: string,
  replySedType?: string,
  replyDisplay?: string,
  queryDocumentId?: string,
  bruker: {
    personInfo: {
      fornavn: string,
      etternavn: string
      kjoenn: string
      foedselsdato: string
      statsborgerskap: Array<{ land: string }>
      pin: Array<{
        land: string
        sektor: string
        identifikator: string
        institusjonsid: string
        institusjonsnavn: string
      }>
      pinmangler: {
        foedested: {
          by: string
          region: string
          land: string
        },
        far: {
          fornavn: string
          etternavnvedfoedsel: string
        },
        mor: {
          fornavn: string
          etternavnvedfoedsel: string
        },
        etternavnvedfoedsel: string
        fornavnvedfoedsel: string
      }
    }
  },
  anmodningsperiode: Periode,
  lokaleSakIder: Array<{
    saksnummer: string
    institusjonsnavn: string
    institusjonsid: string
    land: string
  }>,
  perioderDagpenger?: Array<{
    periode: Periode,
    institusjon: {
      navn: string
      id: string
      idmangler?: {
        navn: string
        adresse: {
          gate: string
          postnummer: string
          by: string
          land: string
          bygning: string
          region: string
        }
      }
    }
  }>,
  rettTilYtelse?: {
    bekreftelsesgrunn: string
    periode: Periode
    avvisningsgrunn: string
  },
  loennsopplysninger?: Array<{
    periode: Periode
    ansettelsestype?: string
    inntekter: Array<{
      type: string
      typeAnnen?: string
      beloep: string
      valuta: string
    }>,
    arbeidsdager?: string
    arbeidstimer?: string
  }>,
  perioderAnsattUtenForsikring?: Array<Arbeidsgiver>,
  perioderAnsattMedForsikring?: Array<Arbeidsgiver>
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
