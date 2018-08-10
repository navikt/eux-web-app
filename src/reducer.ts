import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import dokumenterReducers from './ducks/dokumenter';
import kodeverkReducers from './ducks/kodeverk';
import personReducers from './ducks/person';
import rinasakReducers from './ducks/rinasak';
import rinavedleggReducers from './ducks/rinavedlegg';
import saksbehandlerReducers from './ducks/saksbehandler';

export interface AppState {
  dokumenter: any;
  form: any;
  kodeverk: any;
  person: any;
  rina: {
    sak: any;
    vedlegg: any;
  };
  saksbehandler: any;
}
export default combineReducers({
  dokumenter: dokumenterReducers,
  form: formReducer,
  kodeverk: kodeverkReducers,
  person: personReducers,
  rina: combineReducers({
    sak: rinasakReducers,
    vedlegg: rinavedleggReducers,
  }),
  saksbehandler: saksbehandlerReducers,
});
