import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function ansettelser(fnr) {
  const URI_FAGSAKER = `${API_BASE_URL}arbeidsforhold/${fnr}/ansettelser`;
  return getAsJson(URI_FAGSAKER);
}
