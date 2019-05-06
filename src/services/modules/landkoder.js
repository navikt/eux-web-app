import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hent(buctype) {
  const URI_LANDKODER = `${API_BASE_URL}landkoder/${buctype}`;
  return getAsJson(URI_LANDKODER);
}
