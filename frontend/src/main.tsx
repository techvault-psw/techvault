import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import  store, { persistor }  from "./redux/store";
import { AuthInitializer } from "./components/auth-initializer";

import './index.css'
import App from './App.tsx'

import "@fontsource/poppins/300.css"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"

const root = document.getElementById("root");

createRoot(root!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </PersistGate>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
