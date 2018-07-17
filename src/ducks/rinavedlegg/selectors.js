/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// selector(s)
export const vedleggSelector = createSelector(
  state => (state.rinavedlegg.data ? state.rinavedlegg.data : {}),
  rinavedlegg => rinavedlegg || {}
);
export const vedleggStatusSelector = createSelector(
  state => (state.rinavedlegg.status ? state.rinavedlegg.status : ''),
  rinavedleggStatus => rinavedleggStatus || ''
);
