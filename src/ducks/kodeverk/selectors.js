/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const kodemapsSelector = createSelector(
  state => state.kodeverk.data.kodemaps,
  kodemaps => kodemaps
);

export const landkoderSelector = createSelector(
  state => state.kodeverk.data.landkoder,
  landkoder => landkoder
);

export const sectorSelector = createSelector(
  state => state.kodeverk.data.sector,
  sector => sector
);

export const alleSEDtyperSelector = createSelector(
  state => state.kodeverk.data.sedtyper,
  sedtyper => sedtyper
);

export const familierelasjonerSelector = createSelector(
  state => state.kodeverk.data.familierelasjoner,
  familierelasjoner => familierelasjoner
);
