import { IS_PRODUCTION } from 'constants/environment'
import 'core-js'
import * as Amplitude from 'metrics/amplitude'
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import * as Utils from 'utils/utils'
import i18n from './i18n'
import { unregister } from './registerServiceWorker'
import '@navikt/ds-css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import store from 'store'
import {App} from "./app";
import {pdfjs} from 'react-pdf'

if (!IS_PRODUCTION) {
  // const axe = require('react-axe')
  // axe(React, ReactDOM, 1000)
} else {
  Amplitude.init()
}

(window as any).frontendlogger.info(Utils.buildinfo())

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </I18nextProvider>
)

unregister()
