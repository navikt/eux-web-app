/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const ServerinfoSelector = createSelector(
  state => state.serverinfo.data,
  serverinfo => serverinfo
);

export const ServerinfoStatusSelector = createSelector(
  state => state.serverinfo.status,
  serverinfo => serverinfo
);
