import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hent(buctype, landkode) {
  const URI_INSTITUSJONER = `${API_BASE_URL}institusjoner/${buctype}/?landkode=${landkode}`;
  return getAsJson(URI_INSTITUSJONER);
}
