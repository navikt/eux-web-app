import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import kodeverkReducer from './ducks/kodeverk';
import saksbehandlerReducer from './ducks/saksbehandler/';
import vedleggReducer from './ducks/vedlegg';

export default combineReducers({
  form: formReducer,
  kodeverk: kodeverkReducer,
  saksbehandler: saksbehandlerReducer,
  vedlegg: vedleggReducer,
});
