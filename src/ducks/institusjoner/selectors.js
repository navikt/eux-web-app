/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// eslint-disable-next-line import/prefer-default-export
export const statusSelector = createSelector(
  state => state.institusjoner.status,
  status => status
);
export const errorDataSelector = createSelector(
  state => (state.institusjoner.status === 'ERROR' ? state.institusjoner.data : {}),
  data => (data.data ? JSON.parse(data.data) : {})
);

export const institusjonerSelector = createSelector(
  state => state.institusjoner.data,
  institusjoner => institusjoner
);
export const familieRelasjonerSelector = createSelector(
  state => state.institusjoner.data.relasjoner || [],
  relasjoner => relasjoner
);
