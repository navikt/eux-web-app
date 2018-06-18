/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const landkoderSelector = createSelector(
  state => state.kodeverk.data.landkoder,
  landkoder => landkoder
);

export const sectorSelector = createSelector(
  state => state.kodeverk.data.sector,
  sector => sector
);

export const sedtyperSelector = createSelector(
  state => state.kodeverk.data.sedtyper,
  sedtyper => sedtyper
);

export const valgtSectorSelector = createSelector(
  state => (state.form.opprettSak ? state.form.opprettSak : {}),
  opprettSakForm => {
    const { values = {} } = opprettSakForm;
    return values.sector;
  }
)

const mapToBucSektor = {
  AD: 'administrative',
  AW: 'awod',
  'FA': 'family',
  'AD': 'horizontal',
  'AD': 'legislation',
  'AD': 'miscellaneous',
  'AD': 'pensions',
  'AD': 'recovery',
  'AD': 'sickness',
  'AD': 'unemployment',
}

export const buctyperSelector = createSelector(
  state => state.kodeverk.data.buctyper,
  state => valgtSectorSelector(state),
  (buctyper, valgtSektor) => {
    if(!valgtSektor) { return []}
    return buctyper[mapToBucSektor[valgtSektor]];
  }
);
