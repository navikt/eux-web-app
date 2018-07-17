import { postAsJson } from '../utils';
import { API_BASE_URL } from '../api-constants';

// eslint-disable-next-line import/prefer-default-export
export function sendSak(data) {
  const URI_RINA_OPPRETT_SAK = `${API_BASE_URL}rina/sak`;
  return postAsJson(URI_RINA_OPPRETT_SAK, data);
}

export function sendVedlegg(data) {
  const URI_RINA_SEND_VEDLEGG = `${API_BASE_URL}rina/vedlegg`;
  return postAsJson(URI_RINA_SEND_VEDLEGG, data);
}
