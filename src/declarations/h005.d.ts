import { Adresse, BaseReplySed, PersonInfo } from 'declarations/sed'

// ===== H005 Bruker (§1 Person) =====

export interface Bruker {
  personInfo: PersonInfo
}

// ===== §3.1 Adresse med oppholds- og varighetsinformasjon =====

export interface AdresseMedVarighet {
  adresse?: Adresse
  oppholdetsVarighet?: string
  varighetUavbruttOpphold?: string
}

// ===== §3.2 Personens status =====

export type PersonensStatus =
  | 'ansatt'
  | 'selvstendig_næringsdrivende'
  | 'grensearbeider'
  | 'pensjonist'
  | 'person_som_krever_pensjon'
  | 'arbeidsledig'
  | 'familiemedlem_forsørget'
  | 'student'
  | 'annet'

// ===== §3.4 Aktivitet =====

export type AktivitetType =
  | 'inntektsgivende_virksomhet'
  | 'ikke_inntektsgivende_virksomhet'

export interface Aktivitet {
  type?: AktivitetType
  beskrivelse?: string
  sted?: string
  varighet?: string
  art?: string
}

// ===== §3.8 Familiestatus =====

export interface Familiemedlem {
  familiemedlem?: string
  bosted?: string
}

export interface Barn {
  familiemedlem?: string
  bosted?: string
  skolekrets?: string
}

export interface Familiestatus {
  ektefelle?: Familiemedlem
  barn?: Barn
}

// ===== §3 Informasjon for å fastslå bosted =====

export interface InformasjonFastslaaBosted {
  adresser?: Array<AdresseMedVarighet>
  personensStatus?: PersonensStatus
  personensStatusAnnet?: string
  aktiviteter?: Array<Aktivitet>
  inntektskildeStudenter?: string
  bosituasjonHvorPermanent?: string
  permanentOppholdSkattemessig?: string
  familiestatus?: Familiestatus
  grunnForFlytting?: string
}

// ===== H005 SED — Anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H005Sed extends BaseReplySed {
  bruker: Bruker
  anmodningOmInformasjon?: string
  informasjonFastslaaBosted?: InformasjonFastslaaBosted
  ytterligereInfo?: string
}
