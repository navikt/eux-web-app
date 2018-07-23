import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import kodeverkReducers from './ducks/kodeverk';
import saksbehandlerReducers from './ducks/saksbehandler';
import rinasakReducers from './ducks/rinasak';
import rinavedleggReducers from './ducks/rinavedlegg';
import dokumenterReducers from './ducks/dokumenter';
import personReducers from './ducks/person';

export default combineReducers({
  rina: combineReducers({
    sak: rinasakReducers,
    vedlegg: rinavedleggReducers,
  }),
  form: formReducer,
  kodeverk: kodeverkReducers,
  saksbehandler: saksbehandlerReducers,
  dokumenter: dokumenterReducers,
  person: personReducers,
});
