import { saksbehandlerOperations } from './ducks/saksbehandler/';
import { KodeverkOperations } from './ducks/kodeverk/';

export default function loadInitialData(store) {
  store.dispatch(KodeverkOperations.preload());
  store.dispatch(saksbehandlerOperations.hent());
}
