import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import kodeverkReducer from './ducks/kodeverk';
import saksbehandlerReducer from './ducks/saksbehandler/';
import rinasakReducer from './ducks/rinasak';
import rinavedleggReducers from './ducks/rinavedlegg';
import dokumenterReducer from './ducks/dokumenter';

export default combineReducers({
  rinasak: rinasakReducer,
  rinavedlegg: rinavedleggReducers,
  form: formReducer,
  kodeverk: kodeverkReducer,
  saksbehandler: saksbehandlerReducer,
  dokumenter: dokumenterReducer,
});
