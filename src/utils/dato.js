import moment from 'moment';

/**
 * Denne hjelperen vasker til internasjonalt datoformat: YYYYMMDD

 * Saksbehandlere har forskjellig måte å taste inn datoer på. Denne funksjonen forsøker å
 * vaske / tolke datoene og returnere en korrekt formattert dato.
 *
 * Eksempel på mulige datoinput: '790426', '19790426', '17-04-26', '1979-04-26', '79/04/26', '1979.04.26' etc.
 * Datoer må være tastet inn i rekkefølgen YYYYYMMDD
 * @param dato String Datoen som sakebehandleren har tastet inn.
 * @returns String Datoen som er vasket og stringified.
 */
const MAX_AR_FREM_I_TID = 0;

/** Gjør et beste forsøk på å vaske inputdato. Dersom vask ikke er mulig (feks ved helt feil datoformat eller
 * ugyldig dato, returner false.
 * @param dato
 * @returns {String | Bool } Datoen
 */
const vaskInputDato = dato => {
  // Fjern alle skille-tegn med mål om en ren tallrekke i datoen.
  const newDate = dato.replace(/[-./]/g, '');

  // Hvis datoen er mindre enn 6 tegn - dvs at dag, måned eller år er tastet med
  // kun 1 siffer ("51217" istedet for "051217"), returner ''.
  if (newDate.length < 6 || newDate.length > 8) {
    return false;
  }

  const dateArray = newDate.length === 6 ?
    [parseInt(newDate.substr(0, 2), 10), parseInt(newDate.substr(2, 2), 10), parseInt(newDate.substr(4, 2), 10)]
    :
    [parseInt(newDate.substr(0, 4), 10), parseInt(newDate.substr(4, 2), 10), parseInt(newDate.substr(6, 2), 10)];

  // Hvis kun de to siste årstallene er tastet inn, må vi gjøre en gjetning på hvilket århundre det
  // dreier seg om. Det er ikke sannsynlig at datoen gjelder for mer enn 10 år frem tid, så gjett da
  // på at det dreier se om århundre 19.
  if (dateArray[0] < 100) {
    const dagensAr = (new Date()).getFullYear();
    const testAr = parseInt(`${dagensAr.toString().substr(0, 2)}${dateArray[0]}`, 10);
    const guessCentury = (testAr - dagensAr > MAX_AR_FREM_I_TID) ? '19' : '20';
    const twoDigitYear = dateArray[0] < 10 ? `0${dateArray[0]}` : dateArray[0];
    dateArray[0] = parseInt(`${guessCentury}${twoDigitYear}`, 10);
  }

  const returnDate = moment(dateArray.join(), 'YYYYMMDD').format('YYYY.MM.DD');

  if (!moment(dateArray.join(), 'YYYYMMDD').isValid()) {
    return false;
  }

  return returnDate;
};

/** Normalisering gjennom Redux prop (normaize) sender 2 argumenter. Dersom disse er forskjellige,
 * indikerer det at brukeren ikke har forlatt skjemafeltet. Normalize kalles altså en ekstra gang onBlur.
 * Først dersom begge verdiene er like skal normalisering skje.
 *
 * @param verdi Totalverdien av feltet ETTER siste tastetrykk
 * @param forrigeVerdi Totalverdien av feltet FØR siste tastetrykk
 * @returns {String}
 */
const normaliserInputDato = (verdi, forrigeVerdi) => {
  const vasketDato = vaskInputDato(verdi) ? vaskInputDato(verdi) : verdi;
  return ((verdi === forrigeVerdi) ? vasketDato : verdi);
};

/** Gjør en vurdering av innkomne datoformat og formatter til korrekt YYYY.MM.DD, med eller uten tidspunkt.
 * Moment kunne ha vært benyttet direkte i hver komponent, men denne funksjonen tillater begge datoformater i tillegg
 * til å enklere åpne opp for dato med eller uten tidspunkt.
 *
 */
function formatterDatoTilNorsk(dato, visTidspunkt) {
  const inputFormat = ['YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm'];
  const momentFormat = visTidspunkt ? 'YYYY.MM.DD HH:mm' : 'YYYY.MM.DD';
  const momentDato = moment(dato, inputFormat);
  return momentDato.isValid() ? momentDato.format(momentFormat) : '';
}

/** Forutsatt at datoen er validert korrekt (YYYY.MM.DD HH:mm), formatter den til det maskinlesbare
 * formatet "YYYY-MM-DDTHH:mm:ss"
 *
 */
function formatterDatoTilISO(dato, tid = false) {
  const inputFormat = ['YYYY.MM.DD HH:mm', 'YYYY.MM.DD'];
  const momentFormat = tid ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD';
  return moment(dato, inputFormat).format(momentFormat);
}

/** Enkelte data kommer fra backend i form av en "kortdato", feks 2017-01. Denne funksjonen
 * formatterer om datoen til "jan - 2017" for bedre lesbarhet.
 */
function formatterKortDatoTilNorsk(kortDato) {
  const dato = moment(kortDato, 'YYYY-MM');
  return `${dato.format('MMM')} - ${dato.format('YYYY')}`;
}

function datoDiff (fom, tom, enhet = 'months') {
  if (!moment(fom, 'YYYY-MM-DD').isValid() || !moment(tom, 'YYYY-MM-DD').isValid()) return false;
  return moment(tom).diff(fom, enhet);
}

export {
  vaskInputDato,
  normaliserInputDato,
  formatterDatoTilNorsk,
  formatterDatoTilISO,
  formatterKortDatoTilNorsk,
  datoDiff,
  MAX_AR_FREM_I_TID,
};
