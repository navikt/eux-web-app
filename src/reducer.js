import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import arbeidsgivereReducers from './ducks/arbeidsgivere';
import dokumenterReducers from './ducks/dokumenter';
import fagsakReducers from './ducks/fagsak';
import kodeverkReducers from './ducks/kodeverk';
import landkoderReducers from './ducks/landkoder';
import personReducers from './ducks/person';
import rinasakReducers from './ducks/rinasak';
import rinavedleggReducers from './ducks/rinavedlegg';
import saksbehandlerReducers from './ducks/saksbehandler';

export default combineReducers({
  arbeidsgivere: arbeidsgivereReducers,
  dokumenter: dokumenterReducers,
  fagsaker: fagsakReducers,
  form: formReducer,
  kodeverk: kodeverkReducers,
  landkoder: landkoderReducers,
  person: personReducers,
  rina: combineReducers({
    sak: rinasakReducers,
    vedlegg: rinavedleggReducers,
  }),
  saksbehandler: saksbehandlerReducers,
});
