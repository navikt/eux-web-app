import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import kodeverkReducer from './ducks/kodeverk';
import saksbehandlerReducer from './ducks/saksbehandler/';

export default combineReducers({
  form: formReducer,
  kodeverk: kodeverkReducer,
  saksbehandler: saksbehandlerReducer,
});
