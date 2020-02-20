import 'core-js'
import { createBrowserHistory } from 'history'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router'
import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
import { IS_PRODUCTION } from 'constants/environment'
import arbeidsforholdReducers from './ducks/arbeidsforhold'
import dokumenterReducers from './ducks/dokumenter'
import fagsakReducers from './ducks/fagsak'
import kodeverkReducers from './ducks/kodeverk'
import { KodeverkOperations } from './ducks/kodeverk/'
import landkoderReducers from './ducks/landkoder'
import personReducers from './ducks/person'
import rinasakReducers from './ducks/rinasak'
import rinavedleggReducers from './ducks/rinavedlegg'
import saksbehandlerReducers from './ducks/saksbehandler'
import { saksbehandlerOperations } from './ducks/saksbehandler/'
import * as reducers from 'reducers'
import serverinfoReducers from './ducks/serverinfo'
import { ServerinfoOperations } from './ducks/serverinfo/'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import Pages from './pages'
import { unregister } from './registerServiceWorker'
import 'eessi-pensjon-ui/dist/minibootstrap.css'
import 'eessi-pensjon-ui/dist/nav.css'
import './index.css'

const _reducers = combineReducers({
  ...reducers,
  arbeidsforhold: arbeidsforholdReducers,
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
  serverinfo: serverinfoReducers,
})

const store: Store = createStore(_reducers, applyMiddleware(thunk))
  store.dispatch(KodeverkOperations.preload())
  // @ts-ignore
store.dispatch(saksbehandlerOperations.hent())
  // @ts-ignore
store.dispatch(ServerinfoOperations.hent())

if (!IS_PRODUCTION) {
  var axe = require('react-axe')
  axe(React, ReactDOM, 1000)
}

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <Route exact path="/" component={Pages.Forside} />
            <Route exact path="/vedlegg" component={Pages.Vedlegg} />
            <Route exact path="/opprett" component={Pages.OpprettSak} />
            <Route component={Pages.UkjentSide} />
          </Switch>
        </Router>
      </Suspense>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);

unregister();
