import { Periode, PeriodePeriode } from 'declarations/sed'
import moment from 'moment'

const isDateValidFormat = (date: string, format:string) => {
  return moment(date, format, true).isValid()
}

export const periodeSort = (a: Periode, b: Periode) => {
  if(isDateValidFormat(a.startdato, 'YYYY-MM-DD') && isDateValidFormat(b.startdato, 'YYYY-MM-DD')){
    const dateA = moment(a.startdato, 'YYYY-MM-DD')
    const dateB = moment(b.startdato, 'YYYY-MM-DD')
    if(dateA.isSame(dateB)) return 0
    return dateA.isBefore(dateB) ? -1 : 1
  } else if(isDateValidFormat(a.startdato, 'DD.MM.YYYY') && isDateValidFormat(b.startdato, 'DD.MM.YYYY')){
    const dateA = moment(a.startdato, 'DD.MM.YYYY')
    const dateB = moment(b.startdato, 'DD.MM.YYYY')
    if(dateA.isSame(dateB)) return 0
    return dateA.isBefore(dateB) ? -1 : 1
  } else if(isDateValidFormat(a.startdato, 'DD.MM.YYYY') && isDateValidFormat(b.startdato, 'YYYY-MM-DD')){
    const dateA = moment(a.startdato, 'DD.MM.YYYY')
    const dateB = moment(b.startdato, 'YYYY-MM-DD')
    if(dateA.isSame(dateB)) return 0
    return dateA.isBefore(dateB) ? -1 : 1
  } else if(isDateValidFormat(a.startdato, 'YYYY-MM-DD') && isDateValidFormat(b.startdato, 'DD.MM.YYYY')){
    const dateA = moment(a.startdato, 'YYYY-MM-DD')
    const dateB = moment(b.startdato, 'DD.MM.YYYY')
    if(dateA.isSame(dateB)) return 0
    return dateA.isBefore(dateB) ? -1 : 1
  }
  const dateA = moment(a.startdato, 'YYYY-MM-DD')
  const dateB = moment(b.startdato, 'YYYY-MM-DD')
  if(dateA.isSame(dateB)) return 0
  return dateA.isBefore(dateB) ? -1 : 1
}

export const periodePeriodeSort = (a: PeriodePeriode, b: PeriodePeriode) => {
  const dateA = moment(a.periode.startdato, 'YYYY-MM-DD')
  const dateB = moment(b.periode.startdato, 'YYYY-MM-DD')
  if(dateA.isSame(dateB)) return 0
  return dateA.isBefore(dateB) ? -1 : 1
}
