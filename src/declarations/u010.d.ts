import { Person } from 'declarations/h'
import { BaseReplySed, JaNei, Periode } from 'declarations/sed'
import { LokaltSaksnummer } from 'declarations/u013'

export type U010OmstendighetType =
  'den_arbeidsledige_får_jobb_eller_blir_selvstendig_næringsdrivende' |
  'den_arbeidsledige_får_inntekt_fra_en_annen_yrkesaktivitet_enn_de_ovennevnte' |
  'den_arbeidsledige_avslår_et_jobbtilbud' |
  'den_arbeidsledige_avslår_å_delta_i_en_samtale_hos_arbeidsformidlingen' |
  'den_arbeidsledige_avslår_å_delta_i_arbeidsavklaring' |
  'den_arbeidsledige_er_arbeidsufør' |
  'den_arbeidsledige_følger_ikke_kontrollprosedyrene' |
  'den_arbeidsledige_er_ikke_tilgjengelig_for_arbeidsformidlingen' |
  'andre_omstendigheter'

export interface Omstendigheter {
  periode?: Periode
  typer?: Array<U010OmstendighetType>
  andreOmstendigheter?: Array<string>
}

export interface U010Sed extends BaseReplySed {
  bruker: Person
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  omstendigheter?: Omstendigheter
  oenskerOppfoelging?: JaNei
}
