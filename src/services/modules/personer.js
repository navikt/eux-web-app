import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hentPerson(fnr) {
  const URI_PERSONER = `${API_BASE_URL}personer/?fnr=${fnr}`;
  return getAsJson(URI_PERSONER);
}
