import { Adresse, BaseReplySed, PersonInfo } from 'declarations/sed'

// ===== H005 Bruker (§1 Person) =====

export interface H005Bruker {
  personInfo: PersonInfo
}

// ===== §3.1 Adresse med oppholds- og varighetsinformasjon =====

export interface H005AdresseMedVarighet {
  adresse?: Adresse
  oppholdetsVarighet?: string
  varighetUavbruttOpphold?: string
}

// ===== §3.2 Personens status =====

export type H005PersonensStatus =
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

export type H005AktivitetType =
  | 'inntektsgivende_virksomhet'
  | 'ikke_inntektsgivende_virksomhet'

export interface H005Aktivitet {
  type?: H005AktivitetType
  beskrivelse?: string
  sted?: string
  varighet?: string
  art?: string
}

// ===== §3.8 Familiestatus =====

export interface H005Familiemedlem {
  familiemedlem?: string
  bosted?: string
}

export interface H005Barn {
  familiemedlem?: string
  bosted?: string
  skolekrets?: string
}

export interface H005Familiestatus {
  ektefelle?: H005Familiemedlem
  barn?: H005Barn
}

// ===== §3 Informasjon for å fastslå bosted =====

export interface H005InformasjonFastslaaBosted {
  adresser?: Array<H005AdresseMedVarighet>
  personensStatus?: H005PersonensStatus
  personensStatusAnnet?: string
  aktiviteter?: Array<H005Aktivitet>
  inntektskildeStudenter?: string
  bosituasjonHvorPermanent?: string
  permanentOppholdSkattemessig?: string
  familiestatus?: H005Familiestatus
  grunnForFlytting?: string
}

// ===== H005 SED — Anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H005Sed extends BaseReplySed {
  bruker: H005Bruker
  anmodningOmInformasjon?: string
  informasjonFastslaaBosted?: H005InformasjonFastslaaBosted
  ytterligereInfo?: string
}
