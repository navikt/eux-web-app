import { combineReducers } from 'redux';


import kodeverkReducer from './ducks/kodeverk';
import saksbehandlerReducer from './ducks/saksbehandler/';

export default combineReducers({
  kodeverk: kodeverkReducer,
  saksbehandler: saksbehandlerReducer,
});
