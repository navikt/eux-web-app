import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hent(fnr) {
  const URI_ARBEIDSGIVERE = `${API_BASE_URL}arbeidsgivere/${fnr}`;
  return getAsJson(URI_ARBEIDSGIVERE);
}
