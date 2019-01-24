/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const familierelasjonerSelector = createSelector(
  state => state.kodeverk.data.familierelasjoner,
  familierelasjoner => familierelasjoner
);

export const landkoderSelector = createSelector(
  state => state.kodeverk.data.landkoder,
  landkoder => landkoder
);

export const kodemapsSelector = createSelector(
  state => state.kodeverk.data.kodemaps,
  kodemaps => kodemaps
);

export const sektorSelector = createSelector(
  state => state.kodeverk.data.sektor,
  sektor => sektor
);

export const alleSEDtyperSelector = createSelector(
  state => state.kodeverk.data.sedtyper,
  sedtyper => sedtyper
);

export const alleBUCtyperSelector = createSelector(
  state => state.kodeverk.data.buctyper,
  buctyper => buctyper
);

export const kjoennSelector = createSelector(
  state => state.kodeverk.data.kjoenn,
  kjoenn => kjoenn
);

export const behandlingstemaSelector = createSelector(
  state => state.kodeverk.data.behandlingstema,
  behandlingstema => behandlingstema
);
