import { Periode, PeriodePeriode } from 'declarations/sed'
import moment from 'moment'

const isDateValidFormat = (date: string, format:string) => {
  return moment(date, format, true).isValid()
}

export const periodeSort = (a: Periode, b: Periode) => {
  if(isDateValidFormat(a.startdato, 'YYYY-MM-DD') && isDateValidFormat(b.startdato, 'YYYY-MM-DD')){
    return moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
  } else if(isDateValidFormat(a.startdato, 'DD.MM.YYYY') && isDateValidFormat(b.startdato, 'DD.MM.YYYY')){
    return moment(a.startdato, 'DD.MM.YYYY').isSameOrBefore(moment(b.startdato, 'DD.MM.YYYY')) ? -1 : 1
  } else if(isDateValidFormat(a.startdato, 'DD.MM.YYYY') && isDateValidFormat(b.startdato, 'YYYY-MM-DD')){
    return moment(a.startdato, 'DD.MM.YYYY').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
  } else if(isDateValidFormat(a.startdato, 'YYYY-MM-DD') && isDateValidFormat(b.startdato, 'DD.MM.YYYY')){
    return moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'DD.MM.YYYY')) ? -1 : 1
  }
  return moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
}

export const periodePeriodeSort = (a: PeriodePeriode, b: PeriodePeriode) => (
  moment(a.periode.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.periode.startdato, 'YYYY-MM-DD')) ? -1 : 1
)
