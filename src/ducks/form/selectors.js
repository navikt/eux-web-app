/**
 * Selectors
 * -----------------------------------------------------------------------------------------
 * Målet med selectorer er å samle funksjonalitet som behandler, itererer og omformer
 * data slik at denne logikken kan benyttes flere steder i applikasjonen - ikke bare ett sted.
 */

import { createSelector } from 'reselect';

export const OpprettSakFormSelector = createSelector(
  state => (state.form.opprettSak ? state.form.opprettSak : {}),
  opprettSak => opprettSak
);

export const valgtSektorSelector = createSelector(
  state => OpprettSakFormSelector(state),
  opprettSakForm => {
    const { values = {} } = opprettSakForm;
    return values.sektor;
  }
);
export const valgtBucTypeSelector = createSelector(
  state => OpprettSakFormSelector(state),
  opprettSakForm => {
    const { values = {} } = opprettSakForm;
    return values.buctype;
  }
);
