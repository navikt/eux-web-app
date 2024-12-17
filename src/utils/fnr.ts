import { PDU1 } from 'declarations/pd'
import { Pin, ReplySed } from 'declarations/sed'
import _ from 'lodash'

export const getFnr = (replySed: ReplySed | PDU1 | null | undefined, person: string | undefined): string | undefined => {
  if (_.isNil(replySed) || _.isNil(person)) return undefined
  const pins: Array<Pin> | undefined = _.get(replySed, `${person}.personInfo.pin`)
  if (_.isEmpty(pins)) return undefined
  return _.find(pins, { landkode: 'NOR' })?.identifikator
}
