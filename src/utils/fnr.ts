import { Pin, ReplySed } from 'declarations/sed'
import _ from 'lodash'

export const getFnr = (replySed: ReplySed | null | undefined, person: string | undefined): string | undefined => {
  if (_.isNil(replySed) || _.isNil(person)) return undefined
  let pins: Array<Pin> | undefined = _.get(replySed, `${person}.personInfo.pin`)
  if (_.isEmpty(pins)) return undefined
  return _.find(pins, {land: 'NO'})?.identifikator
}
