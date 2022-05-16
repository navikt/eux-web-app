import { Periode, PeriodePeriode } from 'declarations/sed'
import moment from 'moment'

export const periodeSort = (a: Periode, b: Periode) => (
  moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
)

export const periodePeriodeSort = (a: PeriodePeriode, b: PeriodePeriode) => (
  moment(a.periode.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.periode.startdato, 'YYYY-MM-DD')) ? -1 : 1
)
