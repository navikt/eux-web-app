
import { ReplySed } from 'declarations/sed'
import f002 from './seds/f002.json'
import u002 from './seds/u002.json'
import u004 from './seds/u004.json'
import u017 from './seds/u017.json'

type SedTypes = 'F002' | 'U002' | 'U004' | 'U017'

const seds: {[k in SedTypes]: ReplySed} = {
  F002: f002,
  U002: u002,
  U004: u004,
  U017: u017
}

const getReplySed = (sedType: string): ReplySed | undefined => Object.prototype.hasOwnProperty.call(seds, sedType)
  ? seds[sedType as SedTypes]
  : undefined

export default getReplySed
