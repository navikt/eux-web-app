import { getAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function saksliste(fnr, sektor, tema) {
  const URI_FAGSAKER = `${API_BASE_URL}fagsaker/${fnr}/?sektor=${sektor}&tema=${tema}`;
  return getAsJson(URI_FAGSAKER);
}
