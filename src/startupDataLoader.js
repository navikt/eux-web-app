import { KodeverkOperations } from './ducks/kodeverk/';
import { saksbehandlerOperations } from './ducks/saksbehandler/';
import { ServerinfoOperations } from './ducks/serverinfo/';

export default function loadInitialData(store) {
  store.dispatch(KodeverkOperations.preload());
  store.dispatch(saksbehandlerOperations.hent());
  store.dispatch(ServerinfoOperations.hent());
}
