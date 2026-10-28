import { Adresse, BaseReplySed } from 'declarations/sed'
import { Bruker, LokaltSaksnummer } from 'declarations/u'

export interface Institusjon {
  id?: string
  navn?: string
}

export interface UregistrertInstitusjon {
  navn?: string
  adresse?: Adresse
}

export interface KompetentLandBruker {
  adresse?: Adresse
}

export interface KompetentLand {
  bruker?: KompetentLandBruker
  institusjon?: Institusjon
  uregistrertInstitusjon?: UregistrertInstitusjon
}

export interface U007Sed extends BaseReplySed {
  bruker: Bruker
  lokaleSaksnumre?: Array<LokaltSaksnummer>
  registreringsdato?: string
  kompetentLand?: KompetentLand
}
