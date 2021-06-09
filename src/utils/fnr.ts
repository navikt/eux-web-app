import { ReplySed } from 'declarations/sed'
import _ from 'lodash'

export const getFnr = (replySed: ReplySed | undefined): string | undefined => _.find(replySed?.bruker?.personInfo.pin, p => p.land === 'NO')?.identifikator
