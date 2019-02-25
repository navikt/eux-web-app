import { doThenDispatch } from '../../services/utils';
import * as Api from '../../services/api';

import { formatterDatoTilISO } from '../../utils/dato';

import * as Types from './types';

/**
 * Operations
 * ----------------------------------------------------------------------------------
 * Dette er Thunk-operasjoner som muliggjør asynkrone kall mot Redux
 * ved å returnere en action-generatoren som en egen funksjon. Denne kjøres deretter
 * når det asynkrone kallet, feks fra API'et er ferdigkjørt.
 *
 */
const transformData = data => {
  if (data.tilleggsopplysninger.familierelasjoner.length > 0) {
    const {
      buctype, fnr, landKode: land, institusjonsID, sedtype, sektor, saksID,
      tilleggsopplysninger,
    } = data;
    const { arbeidsforhold } = tilleggsopplysninger;
    const familierelasjoner = tilleggsopplysninger.familierelasjoner.map(relasjon => ({ ...relasjon, fdato: formatterDatoTilISO(relasjon.fdato) }));
    return {
      buctype,
      fnr,
      land,
      institusjonsID,
      sedtype,
      sektor,
      saksid: saksID,
      tilleggsopplysninger: {
        familierelasjoner,
        arbeidsforhold,
      },
    };
  }
  return data;
};
/* eslint import/prefer-default-export:"off" */
export function sendSak(data) {
  /* Vask kjente datofelter slik at alle datoer sendes i formatet YYYY.MM.DD */
  const vaskedData = transformData(data);
  return doThenDispatch(() => Api.Rina.sendSak(vaskedData), {
    OK: Types.OK,
    FEILET: Types.FEILET,
    PENDING: Types.PENDING,
  });
}
