import { XSed } from 'declarations/sed'

// ===== X002 interfaces =====

export interface X002Gjenaapning {
  aarsakType?: string
  aarsakAnnet?: string
}

// ===== X002 SED =====

export interface X002Sed extends XSed {
  gjenaapning?: X002Gjenaapning
}
