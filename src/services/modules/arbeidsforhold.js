import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hent(fom, tom) {
  const URI_FAGSAKER = `${API_BASE_URL}arbeidsforhold/?fom=${fom}&tom=${tom}`;
  return getAsJson(URI_FAGSAKER);
}
