/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const ArbeidsforholdSelector = createSelector(
  state => state.arbeidsforhold.data,
  arbeidsforhold => arbeidsforhold
);

export const ArbeidsforholdStatusSelector = createSelector(
  state => state.arbeidsforhold.status,
  arbeidsforhold => arbeidsforhold
);
