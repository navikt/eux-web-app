import { XSed } from 'declarations/sed'

// ===== X003 interfaces =====

export interface X003SvarGjenaapning {
  erGodkjent?: string
  grunnType?: string
  grunnAnnet?: string
}

// ===== X003 SED =====

export interface X003Sed extends XSed {
  svarGjenaapning?: X003SvarGjenaapning
}
