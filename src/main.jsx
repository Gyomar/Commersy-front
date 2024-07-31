import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from 'redux';
import thunk from 'redux-thunk';
import { Auth0Provider } from '@auth0/auth0-react';
import App from '../App';
import rootReducer from './services/reducers';

const container = document.getElementById('root');
const root = createRoot(container);

const composeAlt = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const composedEnhancers = composeAlt(applyMiddleware(thunk));

const store = createStore(rootReducer, composedEnhancers);

root.render(
  <Provider store={store}>
    <Auth0Provider
      domain="dev-esebhbpji7qk0ahp.us.auth0.com"
      clientId="3XODS0EuTzm2IXhPl6PFw1PujWk7s7D5"
      authorizationParams={{
        redirect_uri: window.location.origin + '/dashboard'
      }}
    >
      <App tab="home" />
    </Auth0Provider>
  </Provider>,
);
