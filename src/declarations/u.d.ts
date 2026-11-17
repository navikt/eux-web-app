import { Adresse, Epost, PersonInfo, Telefon } from 'declarations/sed'

export interface Person {
  personInfo: PersonInfo
}

export interface Bruker extends Person {
  adresse?: Adresse
  telefon?: Array<Telefon>
  epost?: Array<Epost>
}

export interface LokaltSaksnummer {
  landkode?: string
  saksnummer?: string
  institusjonsid?: string
  institusjonsnavn?: string
}

export type OmstendighetType =
  'den_arbeidsledige_får_jobb_eller_blir_selvstendig_næringsdrivende' |
  'den_arbeidsledige_får_inntekt_fra_en_annen_yrkesaktivitet_enn_de_ovennevnte' |
  'den_arbeidsledige_avslår_et_jobbtilbud' |
  'den_arbeidsledige_avslår_å_delta_i_en_samtale_hos_arbeidsformidlingen' |
  'den_arbeidsledige_avslår_å_delta_i_arbeidsavklaring' |
  'den_arbeidsledige_er_arbeidsufør' |
  'den_arbeidsledige_følger_ikke_kontrollprosedyrene' |
  'den_arbeidsledige_er_ikke_tilgjengelig_for_arbeidsformidlingen' |
  'andre_omstendigheter' |
  'ingen' //U008 only
