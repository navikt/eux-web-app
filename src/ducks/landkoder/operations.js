/**
 * Operations
 * ----------------------------------------------------------------------------------
 * Dette er Thunk-operasjoner som muliggjør asynkrone kall mot Redux
 * ved å returnere en action-generatoren som en egen funksjon. Denne kjøres deretter
 * når det asynkrone kallet, feks fra API'et er ferdigkjørt.
 *
 */

import * as Api from '../../services/api';
import * as Types from './types';
import { doThenDispatch } from '../../services/utils';

// eslint-disable-next-line import/prefer-default-export
export function hent(buctype, landskode) {
  return doThenDispatch(() => Api.Landkoder.hent(buctype, landskode), {
    OK: Types.OK,
    FEILET: Types.FEILET,
    PENDING: Types.PENDING,
  });
}

