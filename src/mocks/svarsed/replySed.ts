
import {
  F001Sed,
  F002Sed,
  H001Sed,
  H002Sed,
  ReplySed,
  SedTypes,
  U002Sed,
  U004Sed,
  U017Sed,
  X008Sed,
  X009Sed,
  X010Sed,
  X011Sed,
  X012Sed
} from 'declarations/sed'
import f001 from '../seds/f001.json'
import f002 from '../seds/f002.json'
import u002 from '../seds/u002.json'
import u004 from '../seds/u004.json'
import u017 from '../seds/u017.json'
import h001 from '../seds/h001.json'
import h002 from '../seds/h002.json'
import x008 from '../seds/x008.json'
import x009 from '../seds/x009.json'
import x010 from '../seds/x010.json'
import x011 from '../seds/x011.json'
import x012 from '../seds/x012.json'

const seds: {[k in SedTypes]: ReplySed} = {
  F001: <F001Sed>f001,
  F002: <F002Sed>f002,
  U002: <U002Sed>u002,
  U004: <U004Sed>u004,
  U017: <U017Sed>u017,
  H001: <H001Sed>h001,
  H002: <H002Sed>h002,
  X008: <X008Sed>x008,
  X009: <X009Sed>x009,
  X010: <X010Sed>x010,
  X011: <X011Sed>x011,
  X012: <X012Sed>x012
}

const getReplySed = (sedType: string): ReplySed | null | undefined => Object.prototype.hasOwnProperty.call(seds, sedType)
  ? seds[sedType as SedTypes]
  : undefined

export default getReplySed
