import { postAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

export function send(data) {
  const URI_VEDLEGG_SEND = `${API_BASE_URL}vedlegg`;
  return postAsJson(URI_VEDLEGG_SEND, data);
}
