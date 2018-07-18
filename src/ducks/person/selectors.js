/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

// eslint-disable-next-line import/prefer-default-export
export const personSelector = createSelector(
  state => state.person.data,
  person => person
);
export const familieRelasjonerSelector = createSelector(
  state => state.person.data.relasjoner,
  relasjoner => relasjoner
);