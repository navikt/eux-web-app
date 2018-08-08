import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Router as ReduxRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import loadInitialData from './startupDataLoader';

import routerHistory from './history';
import { unregister } from './registerServiceWorker';
import Routing from './routing';
import createStore from './store';

const store = createStore(routerHistory);
loadInitialData(store);


ReactDOM.render(
  <ReduxProvider store={store}>
    <ReduxRouter history={routerHistory}>
      <App>
        <Routing />
      </App>
    </ReduxRouter>
  </ReduxProvider>,
  document.getElementById('root')
);

unregister();
