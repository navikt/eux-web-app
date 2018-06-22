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

export const valgtSectorSelector = createSelector(
  state => (state.form.opprettSak ? state.form.opprettSak : {}),
  opprettSakForm => {
    const { values = {} } = opprettSakForm;
    return values.sector;
  }
);
export const valgtBucTypeSelector = createSelector(
  state => (state.form.opprettSak ? state.form.opprettSak : {}),
  opprettSakForm => {
    const { values = {} } = opprettSakForm;
    return values.buctype;
  }
);

export const buctyperSelector = createSelector(
  state => kodemapsSelector(state),
  state => state.kodeverk.data.buctyper,
  state => valgtSectorSelector(state),
  (kodemaps, buctyper, valgtSector) => {
    if (!kodemaps) { return []; }
    if (!valgtSector) { return []; }
    return buctyper[kodemaps.SECTOR2BUC[valgtSector]];
  }
);

export const alleSEDtyperSelector = createSelector(
  state => state.kodeverk.data.sedtyper,
  sedtyper => sedtyper
);

export const sedtypeSelector = createSelector(
  state => valgtSectorSelector(state),
  state => kodemapsSelector(state),
  state => alleSEDtyperSelector(state),
  state => valgtBucTypeSelector(state),
  (valgtSector, kodemaps, sedKodeverk, valgtBucType) => {
    if (!(valgtSector && valgtSector === 'FB')) { return []; }
    if (!kodemaps) { return []; }
    if (!valgtBucType) { return []; }
    const sedtyper = kodemaps.BUC2SEDS[valgtSector][valgtBucType];
    if (!(sedtyper && sedtyper.length)) return [];
    return sedtyper.reduce((acc, curr) => {
      const kode = sedKodeverk.find(elem => elem.kode === curr);
      acc.push(kode);
      return acc;
    }, []);
  }
);

export const institusjonSelector = createSelector(
  state => state.kodeverk.data.institusjoner,
  institusjoner => institusjoner
);
export const familierelasjonerSelector = createSelector(
  state => state.kodeverk.data.familierelasjoner,
  familierelasjoner => familierelasjoner
);
