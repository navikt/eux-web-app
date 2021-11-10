import * as appActions from 'actions/app'
import { IS_PRODUCTION } from 'constants/environment'
import 'core-js'
import * as Amplitude from 'metrics/amplitude'
import * as Sentry from 'metrics/sentry'
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
import Pages from 'pages'
import 'rc-tooltip/assets/bootstrap_white.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import * as reducers from 'reducers'
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import * as Utils from 'utils/utils'
import i18n from './i18n'
import { unregister } from './registerServiceWorker'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store: Store = createStore(combineReducers(reducers), composeEnhancers(applyMiddleware(thunk)))

if (!IS_PRODUCTION) {
  const axe = require('react-axe')
  axe(React, ReactDOM, 1000)
} else {
  Sentry.init()
  Amplitude.init()
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
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <BrowserRouter>
          <Routes>
            <Route path='/vedlegg' element={<Pages.Vedlegg />} />
            <Route path='/opprettsak' element={<Pages.OpprettSak />} />
            <Route path='/svarsed' element={<Pages.SvarSed />} />
            <Route path='/pdu1' element={<Pages.PDU1 />} />
            <Route path='/' element={<Pages.Forside />} />
            <Route element={<Pages.UkjentSide />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
)

unregister()
