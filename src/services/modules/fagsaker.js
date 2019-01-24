import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function saksliste(fnr, behandlingstema) {
  const URI_FAGSAKER = `${API_BASE_URL}fagsaker/${fnr}/saksliste/?behandlingstema=${behandlingstema}`;
  return getAsJson(URI_FAGSAKER);
}
