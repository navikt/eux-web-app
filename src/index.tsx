import 'core-js'
import { createBrowserHistory } from 'history'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router'
import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import { IS_PRODUCTION } from 'constants/environment'
import * as reducers from 'reducers'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import Pages from './pages'
import * as sakActions from 'actions/sak'
import * as appActions from 'actions/app'
import { unregister } from './registerServiceWorker'
import 'eessi-pensjon-ui/dist/minibootstrap.css'
import 'eessi-pensjon-ui/dist/nav.css'
import './index.css'

const store: Store = createStore(combineReducers(reducers), applyMiddleware(thunk))

if (!IS_PRODUCTION) {
  var axe = require('react-axe')
  axe(React, ReactDOM, 1000)
}

store.dispatch(sakActions.preload())
store.dispatch(appActions.getSaksbehandler())
store.dispatch(appActions.getServerinfo())

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <Route path='/vedlegg' component={Pages.Vedlegg} />
            <Route path='/opprett' component={Pages.OpprettSak} />
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