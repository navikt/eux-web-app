/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';
import { alleSEDtyperSelector, kodemapsSelector } from '../kodeverk/selectors';

// selector(s)
export const sakSelector = createSelector(
  state => (state.rina.sak.data ? state.rina.sak.data : {}),
  rinasak => rinasak || {}
);
export const sakStatusSelector = createSelector(
  state => (state.rina.sak.status ? state.rina.sak.status : ''),
  rinasakStatus => rinasakStatus || ''
);

export const valgtSektorSelector = createSelector(
  state => (state.form.opprettSak ? state.form.opprettSak : {}),
  opprettSakForm => {
    const { values = {} } = opprettSakForm;
    return values.sektor;
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
  state => valgtSektorSelector(state),
  (kodemaps, buctyper, valgtSektor) => {
    if (!kodemaps) { return []; }
    if (!valgtSektor) { return []; }
    return buctyper[kodemaps.SEKTOR2BUC[valgtSektor]];
  }
);


export const sedtypeSelector = createSelector(
  state => valgtSektorSelector(state),
  state => kodemapsSelector(state),
  state => alleSEDtyperSelector(state),
  state => valgtBucTypeSelector(state),
  (valgtSektor, kodemaps, sedKodeverk, valgtBucType) => {
    if (!(valgtSektor && valgtSektor === 'FB')) { return []; }
    if (!kodemaps) { return []; }
    if (!valgtBucType) { return []; }
    const sedtyper = kodemaps.BUC2SEDS[valgtSektor][valgtBucType];
    if (!(sedtyper && sedtyper.length)) return [];
    return sedtyper.reduce((acc, curr) => {
      const kode = sedKodeverk.find(elem => elem.kode === curr);
      acc.push(kode);
      return acc;
    }, []);
  }
);
