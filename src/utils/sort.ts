import { Periode } from 'declarations/sed'
import moment from 'moment'

export const periodeSort = (a: Periode, b: Periode) => (
  moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
)
