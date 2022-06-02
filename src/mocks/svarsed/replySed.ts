
import { F002Sed, H001Sed, H002Sed, ReplySed, SedTypes, U002Sed, U004Sed, U017Sed, X008Sed, X009Sed } from 'declarations/sed'
import f002 from '../seds/f002.json'
import u002 from '../seds/u002.json'
import u004 from '../seds/u004.json'
import u017 from '../seds/u017.json'
import h001 from '../seds/h001.json'
import h002 from '../seds/h002.json'
import x008 from '../seds/x008.json'
import x009 from '../seds/x009.json'

const seds: {[k in SedTypes]: ReplySed} = {
  F002: <F002Sed>f002,
  U002: <U002Sed>u002,
  U004: <U004Sed>u004,
  U017: <U017Sed>u017,
  H001: <H001Sed>h001,
  H002: <H002Sed>h002,
  X008: <X008Sed>x008,
  X009: <X009Sed>x009
}

const getReplySed = (sedType: string): ReplySed | null | undefined => Object.prototype.hasOwnProperty.call(seds, sedType)
  ? seds[sedType as SedTypes]
  : undefined

export default getReplySed
