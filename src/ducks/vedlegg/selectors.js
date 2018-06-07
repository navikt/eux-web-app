/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// selector(s)
export const VedleggSelector = createSelector(
  state => (state.vedlegg.data ? state.vedlegg.data : {}),
  vedlegg => vedlegg || {}
);
export const VedleggStatusSelector = createSelector(
  state => (state.vedlegg.status ? state.vedlegg.status : ''),
  vedleggStatus => vedleggStatus || ''
);
