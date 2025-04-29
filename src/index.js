import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import rootReducer from "./reducers/index"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

const root = ReactDOM.createRoot(document.getElementById('root'));

const initiaState = {}
const middleware = [thunk];

root.render(
  <React.StrictMode>
    <Provider store={createStore(rootReducer, initiaState, composeWithDevTools(applyMiddleware(...middleware)))}>
      <App />
    </Provider>
  </React.StrictMode>
);

