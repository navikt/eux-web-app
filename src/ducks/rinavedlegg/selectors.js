/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// selector(s)
export const vedleggSelector = createSelector(
  state => (state.rina.vedlegg.data ? state.rina.vedlegg.data : {}),
  rinavedlegg => rinavedlegg || {}
);
export const vedleggStatusSelector = createSelector(
  state => (state.rina.vedlegg.status ? state.rina.vedlegg.status : ''),
  rinavedleggStatus => rinavedleggStatus || ''
);
