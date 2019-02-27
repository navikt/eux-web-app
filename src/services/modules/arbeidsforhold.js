import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function hent(fnr) {
  const URI_ARBEIDSFORHOLD = `${API_BASE_URL}arbeidsforhold/${fnr}`;
  return getAsJson(URI_ARBEIDSFORHOLD);
}
