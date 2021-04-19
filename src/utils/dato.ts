import moment from 'moment'

/**
 * Saksbehandlere har forskjellig måte å taste inn datoer på. Denne funksjonen forsøker å
 * vaske / tolke datoene og returnere en korrekt formattert dato.
 *
 * Eksempel på mulige datoinput: '260479', '26041979', '26-04-79', '26-04-1979', '26/04/79', '26.04.1979' etc.
 * Datoer må være tastet inn i rekkefølgen DD MM ÅÅ(ÅÅ)
 * @param dato String Datoen som sakebehandleren har tastet inn.
 * @returns String Datoen som er vasket og stringified.
 */
const MAX_AR_FREM_I_TID = 10

/** Gjør et beste forsøk på å vaske inputdato. Dersom vask ikke er mulig (feks ved helt feil datoformat eller
 * ugyldig dato, returner false.
 * @param dato
 * @returns {String | Boolean } Datoen
 */
export const vaskInputDato = (dato: any) => {
  if (dato === null || dato === undefined) return false

  // Godta type number, men gjør den om til string først.
  const stringDato = Number.isInteger(dato) ? '' + dato : dato

  // Fjern alle skille-tegn med mål om en ren tallrekke i datoen.
  const newDate = stringDato.replace(/[-./]/g, '')

  // Hvis datoen er mindre enn 6 tegn - dvs at dag, måned eller år er tastet med
  // kun 1 siffer ("51217" istedet for "051217"), returner ''.
  if (newDate.length < 6 || newDate.length > 8) {
    return false
  }

  // const dateArray = newDate.match(/(..?)/g);
  const dateArray = [newDate.substr(0, 2), parseInt(newDate.substr(2, 2), 10), parseInt(newDate.substr(4), 10)]

  // Hvis kun de to siste årstallene er tastet inn, må vi gjøre en gjetning på hvilket århundre det
  // dreier seg om. Det er ikke sannsynlig at datoen gjelder for mer enn 10 år frem tid, så gjett da
  // på at det dreier se om århundre 19.
  if (dateArray[2] < 100) {
    const dagensAr = (new Date()).getFullYear()
    const testAr = parseInt(`${dagensAr.toString().substr(0, 2)}${dateArray[2]}`, 10)
    const gjettAarhundre = (testAr - dagensAr > MAX_AR_FREM_I_TID) ? '19' : '20'
    const toTallsAar = dateArray[2] < 10 ? `0${dateArray[2]}` : dateArray[2]
    dateArray[2] = parseInt(`${gjettAarhundre}${toTallsAar}`, 10)
  }

  const returnDate = moment(dateArray.join(), 'DDMMYYYY').format('DD.MM.YYYY')

  if (!moment(dateArray.join(), 'DDMMYYYY').isValid()) {
    return false
  }

  return returnDate
}

export const formatterDatoTilNorsk = (dato: any) => {
  const inputFormat = ['YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm']
  const momentDato = moment.utc(dato, inputFormat)
  return momentDato.isValid() ? momentDato.local().format('DD.MM.YYYY') : ''
}

