/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';
import { KodeverkSelectors } from '../kodeverk';
import { FormSelectors } from '../form';

export const fagsakerSelector = createSelector(
  state => (state.fagsaker.data ? state.fagsaker.data : []),
  fagsaker => fagsaker
);

export const behandlingstypeSelector = createSelector(
  state => KodeverkSelectors.kodemapsSelector(state),
  state => KodeverkSelectors.behandlingstemaSelector(state),
  state => FormSelectors.valgtSektorSelector(state),
  (kodemaps, behandlingstema, valgtSektor) => {
    if (!kodemaps) { return []; }
    if (!valgtSektor) { return []; }
    return behandlingstema[kodemaps.SEKTOR2FAGSAK[valgtSektor]];
  }
);
