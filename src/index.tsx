import 'core-js'
import { createBrowserHistory } from 'history'
import 'nav-frontend-alertstriper-style/dist/main.css'
import 'nav-frontend-chevron-style/dist/main.css'
import 'nav-frontend-core/dist/main.css'
import 'nav-frontend-ekspanderbartpanel-style/dist/main.css'
import 'nav-frontend-hjelpetekst-style/dist/main.css'
import 'nav-frontend-knapper-style/dist/main.css'
import 'nav-frontend-lenkepanel-style/dist/main.css'
import 'nav-frontend-lenker-style/dist/main.css'
import 'nav-frontend-lukknapp-style/dist/main.css'
import 'nav-frontend-modal-style/dist/main.css'
import 'nav-frontend-paneler-style/dist/main.css'
import 'nav-frontend-popover-style/dist/main.css'
import 'nav-frontend-skjema-style/dist/main.css'
import 'nav-frontend-tabell-style/dist/main.css'
import 'nav-frontend-typografi-style/dist/main.css'
import 'rc-tooltip/assets/bootstrap_white.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router'
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import * as appActions from './actions/app'
import { IS_PRODUCTION } from './constants/environment'
import i18n from './i18n'
import * as Sentry from './metrics/sentry'
import Pages from './pages'
import * as reducers from './reducers'
import { unregister } from './registerServiceWorker'
import * as Utils from './utils/utils'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store: Store = createStore(combineReducers(reducers), composeEnhancers(applyMiddleware(thunk)))

if (!IS_PRODUCTION) {
  const axe = require('react-axe')
  axe(React, ReactDOM, 1000)
} else {
  Sentry.init()
}

(window as any).frontendlogger.info(Utils.buildinfo())
store.dispatch(appActions.preload())
// @ts-ignore
store.dispatch(appActions.getSaksbehandler())
// @ts-ignore
store.dispatch(appActions.getEnheter())
// @ts-ignore
store.dispatch(appActions.getFeatures())
// @ts-ignore
store.dispatch(appActions.getServerinfo())
// @ts-ignore
store.dispatch(appActions.getUtgaarDato())

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <Route path='/vedlegg' component={Pages.Vedlegg} />
            <Route path='/opprett' component={Pages.OpprettSak} />
            <Route path='/svarpased' component={Pages.SvarPaSed} />
            <Route exact path='/' component={Pages.Forside} />
            <Route component={Pages.UkjentSide} />
          </Switch>
        </Router>
      </Suspense>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
)

unregister()
