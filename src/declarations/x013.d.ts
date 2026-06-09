import { XSed } from 'declarations/sed'

export type KanIkkeKlargjoereGrunnType =
  | 'kan_ikke_fremlegge_etterspurt_støttedokumentasjon_klargjøring'
  | 'personen_samarbeidet_ikke'
  | 'annet'

export interface Klargjoering {
  punkt?: string
  del?: string
  klargjoering?: string
}

export interface KanIkkeKlargjoere {
  punkt?: string
  del?: string
  grunnType?: string
  grunnAnnet?: string
}

export interface X013Sed extends XSed {
  svarPaaSedId?: string
  klargjoeringer?: Array<Klargjoering>
  kanIkkeKlargjoere?: Array<KanIkkeKlargjoere>
}
