/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const ArbeidsgivereSelector = createSelector(
  state => state.arbeidsgivere.data,
  arbeidsgivere => arbeidsgivere
);

export const ArbeidsgivereStatusSelector = createSelector(
  state => state.arbeidsgivere.status,
  arbeidsgivere => arbeidsgivere
);
