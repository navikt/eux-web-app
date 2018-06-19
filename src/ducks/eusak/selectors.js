/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// selector(s)
export const EusakSelector = createSelector(
  state => (state.eusak.data ? state.eusak.data : {}),
  eusak => eusak || {}
);
export const EusakStatusSelector = createSelector(
  state => (state.eusak.status ? state.eusak.status : ''),
  eusakStatus => eusakStatus || ''
);
