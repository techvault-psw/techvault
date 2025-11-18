import { configureStore } from "@reduxjs/toolkit";
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import rootReducer from "./root-reducer.ts";
import { configureAuthFetch } from "@/lib/fetch-utils";
import { configureUploadAuth } from "@/lib/upload-pacote-image";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

configureAuthFetch(store.getState);
configureUploadAuth(store.getState);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch

export default store