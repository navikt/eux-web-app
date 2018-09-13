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
/* eslint import/prefer-default-export:"off" */
export function sendSak(data) {
  /* Vask kjente datofelter slik at alle datoer sendes i formatet YYYY.MM.DD */
  const vaskedeData = { ...data };
  const { familierelasjoner } = vaskedeData.tilleggsopplysninger;
  vaskedeData.tilleggsopplysninger.familierelasjoner = familierelasjoner.map(relasjon => ({ ...relasjon, fdato: formatterDatoTilISO(relasjon.fdato) }));

  return doThenDispatch(() => Api.Rina.sendSak(vaskedeData), {
    OK: Types.OK,
    FEILET: Types.FEILET,
    PENDING: Types.PENDING,
  });
}
