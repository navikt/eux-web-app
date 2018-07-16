import { doThenDispatch } from '../../services/utils';
import * as Api from '../../services/api';

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
export function send(data) {
  return doThenDispatch(() => Api.Rina.sendSak(data), {
    OK: Types.OK,
    FEILET: Types.FEILET,
    PENDING: Types.PENDING,
  });
}
