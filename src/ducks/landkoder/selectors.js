/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// eslint-disable-next-line import/prefer-default-export
export const statusSelector = createSelector(
  state => state.landkoder.status,
  status => status
);
export const errorDataSelector = createSelector(
  state => (state.landkoder.status === 'ERROR' ? state.landkoder.data : {}),
  data => (data.data ? JSON.parse(data.data) : {})
);

export const landkoderSelector = createSelector(
  state => state.landkoder.data,
  landkoder => landkoder
);
export const familieRelasjonerSelector = createSelector(
  state => state.landkoder.data.relasjoner || [],
  relasjoner => relasjoner
);
