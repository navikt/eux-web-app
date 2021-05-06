import 'core-js'
import { createBrowserHistory } from 'history'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router'
import { applyMiddleware, compose, combineReducers, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import { createGlobalStyle } from 'styled-components'
import { IS_PRODUCTION } from './constants/environment'
import * as reducers from './reducers'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import Pages from './pages'
import * as appActions from './actions/app'
import { unregister } from './registerServiceWorker'
import * as Utils from './utils/utils'
import * as Sentry from './metrics/sentry'
import { slideInFromLeft, slideInFromRight, slideInFromTop, slideInFromBottom, fadeIn } from 'nav-hoykontrast'

import 'nav-frontend-alertstriper-style/dist/main.css'
import 'nav-frontend-core/dist/main.css'
import 'nav-frontend-chevron-style/dist/main.css'
import 'nav-frontend-ekspanderbartpanel-style/dist/main.css'
import 'nav-frontend-hjelpetekst-style/dist/main.css'
import 'nav-frontend-knapper-style/dist/main.css'
import 'nav-frontend-lenkepanel-style/dist/main.css'
import 'nav-frontend-lukknapp-style/dist/main.css'
import 'nav-frontend-lenker-style/dist/main.css'
import 'nav-frontend-modal-style/dist/main.css'
import 'nav-frontend-paneler-style/dist/main.css'
import 'nav-frontend-popover-style/dist/main.css'
import 'nav-frontend-skjema-style/dist/main.css'
import 'nav-frontend-tabell-style/dist/main.css'
import 'nav-frontend-typografi-style/dist/main.css'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;

  color: black;
  background: whitesmoke;

  display: flex;
  flex-direction: column;
  min-height: 100vh;

  background-color: rgb(233, 231, 231);
  font-family: 'Source Sans Pro', Arial, sans-serif;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

section {
  margin:0.5em 0;
}

.panelSeksjon {
  margin:1em 0;
}
.nolabel {
  margin-top: 1.8rem;
}
.fadeIn {
  opacity: 0;
  animation: ${fadeIn} 0.25s forwards;
}
.slideInFromLeft {
  opacity: 0;
  transform: translateX(-20px);
  animation: ${slideInFromLeft(20)} 0.3s forwards;
}
.slideInFromRight {
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight(20)} 0.3s forwards;
}
.slideInFromTop {
  opacity: 0;
  transform: translateY(-20px);
  animation: ${slideInFromTop(20)} 0.3s forwards;
}
.slideInFromBottom {
  opacity: 0;
  transform: translateY(20px);
  animation: ${slideInFromBottom(20)} 0.3s forwards;
}
`

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
store.dispatch(appActions.getServerinfo())
// @ts-ignore
store.dispatch(appActions.getUtgaarDato())

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <GlobalStyle />
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
