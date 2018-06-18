import { postAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function send(data) {
  const URI_OPPRETT_EUSAK = `${API_BASE_URL}eusak`;
  return postAsJson(URI_OPPRETT_EUSAK, data);
}
