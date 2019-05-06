import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hent(rinasaksnummer) {
  const URI_RINA_DOKUMENTER = `${API_BASE_URL}rina/dokumenter/?rinasaksnummer=${rinasaksnummer}`;
  return getAsJson(URI_RINA_DOKUMENTER);
}
