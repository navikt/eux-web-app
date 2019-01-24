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
  sak => sak || {}
);
export const sakStatusSelector = createSelector(
  state => (state.rina.sak.status ? state.rina.sak.status : ''),
  status => status || ''
);

export const errorDataSakSelector = createSelector(
  state => (state.rina.sak.status === 'ERROR' ? state.rina.sak.data : {}),
  data => (data.data ? JSON.parse(data.data) : {})
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

export const behandlingstypeSelector = createSelector(
  state => kodemapsSelector(state),
  state => state.kodeverk.data.behandlingstema,
  state => valgtSektorSelector(state),
  (kodemaps, behandlingstema, valgtSektor) => {
    if (!kodemaps) { return []; }
    if (!valgtSektor) { return []; }
    return behandlingstema[kodemaps.SEKTOR2FAGSAK[valgtSektor]];
  }
);

export const sedtypeSelector = createSelector(
  state => valgtSektorSelector(state),
  state => kodemapsSelector(state),
  state => alleSEDtyperSelector(state),
  state => valgtBucTypeSelector(state),
  (valgtSektor, kodemaps, sedKodeverk, valgtBucType) => {
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
