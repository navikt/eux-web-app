/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const lookupSelector = state => state.kodeverk.data.lookup;

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

const mapSektor2BucGruppe = {
  AD: 'administrative',
  AW: 'awod',
  FB: 'family',
  HZ: 'horizontal',
  LA: 'legislation',
  MI: 'miscellaneous',
  PE: 'pensions',
  RE: 'recovery',
  SI: 'sickness',
  UB: 'unemployment',
};

export const buctyperSelector = createSelector(
  state => state.kodeverk.data.buctyper,
  state => valgtSectorSelector(state),
  (buctyper, valgtSektor) => {
    if (!valgtSektor) { return []; }
    return buctyper[mapSektor2BucGruppe[valgtSektor]];
  }
);
const hasProp = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function mapBucTtoSEDs (buctype) {
  const buc2seds = {
    FB_BUC_01: ['SED_F001'],
    FB_BUC_02: ['SED_F016'],
    FB_BUC_03: ['SED_F018', 'SED_F021'],
    FB_BUC_04: ['SED_F003'],
  };
  return hasProp(buc2seds, buctype) ? buc2seds[buctype] : [];
}

export const sedtyperSelector = createSelector(
  state => state.kodeverk.data.sedtyper,
  sedtyper => sedtyper
);

export const sedtypeSelector = createSelector(
  state => sedtyperSelector(state),
  state => valgtBucTypeSelector(state),
  (sedKodeverk, valgtBucType) => {
    if (!valgtBucType) { return []; }
    const sedtyper = mapBucTtoSEDs(valgtBucType);
    if (!sedtyper.length) return [];
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
