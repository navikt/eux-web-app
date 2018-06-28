import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import kodeverkReducer from './ducks/kodeverk';
import saksbehandlerReducer from './ducks/saksbehandler/';
import vedleggReducer from './ducks/vedlegg';
import eusakReducer from './ducks/eusak';
import dokumenterReducer from './ducks/dokumenter';

export default combineReducers({
  eusak: eusakReducer,
  form: formReducer,
  kodeverk: kodeverkReducer,
  saksbehandler: saksbehandlerReducer,
  vedlegg: vedleggReducer,
  dokumenter: dokumenterReducer,
});
